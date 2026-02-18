import pandas as pd
import numpy as np
from typing import Dict, List
import logging
from datetime import datetime, timedelta

# Import necessary utils
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.utils import fetch_price_history_bulk, fetch_benchmark_history, pivot_price_data
from mtm.orm.engine import get_price_db_session

logger = logging.getLogger(__name__)

# Default benchmarks - Expanded list
DEFAULT_BENCHMARKS = [
    "Nifty 50",
    "Nifty Auto",
    "Nifty Bank",
    "Nifty Media",
    "Nifty CPSE",
    "Nifty IT",
    "Nifty Commodities",
    "Nifty Energy",
    "Nifty Pharma",
    "Nifty Next 50",
    "Nifty Smallcap 50",
    "NIFTY Midcap 100",  # Note: NIFTY in caps to match database
]


def calculate_benchmark_correlations(
    symbols: List[str],
    benchmark_symbols: List[str] = None,
    lookback_days: int = 365
) -> Dict:
    """
    Calculate correlation of stocks against multiple benchmark indices.
    
    Args:
        symbols: List of stock symbols
        benchmark_symbols: List of benchmark symbols (defaults to DEFAULT_BENCHMARKS)
        lookback_days: Number of days to look back for correlation calculation
        
    Returns:
        Dict with benchmark correlations
    """
    if benchmark_symbols is None:
        benchmark_symbols = DEFAULT_BENCHMARKS
        
    try:
        # Get database session
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        # Date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=lookback_days)
        
        # Fetch stock prices
        stock_prices = fetch_price_history_bulk(symbols, start_date=start_date, end_date=end_date, session=session)
        
        logger.info(f"Fetched stock prices: {len(stock_prices)} rows for {len(symbols)} symbols")
        
        if stock_prices.empty:
            logger.warning("No stock price data fetched")
            session.close()
            return {"benchmarks": [], "symbols": [], "correlations": []}
        
        # Fetch all benchmark prices
        benchmark_dfs = []
        valid_benchmarks = []
        
        for benchmark in benchmark_symbols:
            logger.info(f"Fetching benchmark: {benchmark}")
            bench_df = fetch_benchmark_history(benchmark, start_date=start_date, end_date=end_date, session=session)
            logger.info(f"Benchmark {benchmark}: {len(bench_df)} rows fetched")
            
            if not bench_df.empty:
                benchmark_dfs.append(bench_df)
                valid_benchmarks.append(benchmark)
            else:
                logger.warning(f"No data found for benchmark: {benchmark}")
        
        session.close()
        
        logger.info(f"Valid benchmarks found: {valid_benchmarks}")
        
        if not benchmark_dfs:
            logger.warning("No benchmark data fetched")
            return {"benchmarks": [], "symbols": [], "correlations": []}
        
        # Combine all price data
        all_prices = pd.concat([stock_prices] + benchmark_dfs, ignore_index=True)
        
        # Pivot to wide format
        prices_wide = pivot_price_data(all_prices, symbols=symbols + valid_benchmarks)
        
        if prices_wide.empty:
            return {"benchmarks": [], "symbols": [], "correlations": []}
        
        # Calculate daily returns
        returns = prices_wide.pct_change().dropna()
        
        # Calculate correlation for each stock against each benchmark
        correlations = []
        
        for symbol in symbols:
            if symbol not in returns.columns:
                continue
                
            symbol_corr = {"symbol": symbol}
            
            for benchmark in valid_benchmarks:
                if benchmark not in returns.columns:
                    symbol_corr[benchmark] = None
                    continue
                    
                # Calculate Pearson correlation
                corr = returns[symbol].corr(returns[benchmark])
                symbol_corr[benchmark] = float(corr) if not pd.isna(corr) else None
            
            correlations.append(symbol_corr)
        
        return {
            "benchmarks": valid_benchmarks,
            "symbols": symbols,
            "correlations": correlations
        }
        
    except Exception as e:
        logger.error(f"Error calculating benchmark correlations: {e}", exc_info=True)
        return {"benchmarks": [], "symbols": [], "correlations": []}


def calculate_inter_stock_correlations(
    symbols: List[str],
    lookback_days: int = 365
) -> Dict:
    """
    Calculate pairwise correlation matrix between all stocks.
    
    Args:
        symbols: List of stock symbols
        lookback_days: Number of days to look back
        
    Returns:
        Dict with inter-stock correlation matrix
    """
    try:
        # Get database session
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        # Date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=lookback_days)
        
        # Fetch stock prices
        stock_prices = fetch_price_history_bulk(symbols, start_date=start_date, end_date=end_date, session=session)
        session.close()
        
        if stock_prices.empty:
            logger.warning("No stock price data fetched")
            return {"symbols": [], "correlations": []}
        
        # Pivot to wide format
        prices_wide = pivot_price_data(stock_prices, symbols=symbols)
        
        if prices_wide.empty:
            return {"symbols": [], "correlations": []}
        
        # Calculate daily returns
        returns = prices_wide.pct_change().dropna()
        
        # Calculate correlation matrix
        correlations = []
        
        for symbol in symbols:
            if symbol not in returns.columns:
                continue
                
            symbol_corr = {"symbol": symbol}
            
            for other_symbol in symbols:
                if other_symbol not in returns.columns:
                    symbol_corr[other_symbol] = None
                    continue
                    
                # Calculate Pearson correlation
                corr = returns[symbol].corr(returns[other_symbol])
                symbol_corr[other_symbol] = float(corr) if not pd.isna(corr) else None
            
            correlations.append(symbol_corr)
        
        return {
            "symbols": symbols,
            "correlations": correlations
        }
        
    except Exception as e:
        logger.error(f"Error calculating inter-stock correlations: {e}", exc_info=True)
        return {"symbols": [], "correlations": []}


def calculate_portfolio_correlation(
    portfolio_df: pd.DataFrame,
    symbols: List[str],
    benchmark_symbols: List[str] = None,
    lookback_days: int = 365
) -> Dict:
    """
    Calculate portfolio-level correlation to benchmarks using market-value weighting.
    
    Args:
        portfolio_df: Portfolio DataFrame with Symbol, Market Value columns
        symbols: List of stock symbols in current holdings
        benchmark_symbols: List of benchmark symbols
        lookback_days: Number of days to look back
        
    Returns:
        Dict with portfolio-level correlations to each benchmark
    """
    if benchmark_symbols is None:
        benchmark_symbols = DEFAULT_BENCHMARKS
    
    try:
        # Get latest holdings with market values for weighting
        if 'Market Value' in portfolio_df.columns or 'Market_Value' in portfolio_df.columns:
            mv_col = 'Market Value' if 'Market Value' in portfolio_df.columns else 'Market_Value'
            
            # Get latest data
            if 'Date' in portfolio_df.columns:
                latest_df = portfolio_df.sort_values('Date').groupby('Symbol').last().reset_index()
            else:
                latest_df = portfolio_df
            
            # Filter to current symbols and get weights
            holdings_df = latest_df[latest_df['Symbol'].isin(symbols)].copy()
            total_value = holdings_df[mv_col].sum()
            
            if total_value <= 0:
                logger.warning("Total portfolio value is zero or negative")
                return {"portfolio_correlations": {}}
            
            # Calculate weights
            holdings_df['weight'] = holdings_df[mv_col] / total_value
            weights_dict = dict(zip(holdings_df['Symbol'], holdings_df['weight']))
        else:
            # Equal weighting fallback
            logger.warning("No Market Value column found, using equal weighting")
            weights_dict = {sym: 1.0 / len(symbols) for sym in symbols}
        
        # Get database session
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        # Date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=lookback_days)
        
        # Fetch stock prices
        stock_prices = fetch_price_history_bulk(symbols, start_date=start_date, end_date=end_date, session=session)
        
        if stock_prices.empty:
            logger.warning("No stock price data for portfolio correlation")
            session.close()
            return {"portfolio_correlations": {}}
        
        # Pivot to wide format
        prices_wide = pivot_price_data(stock_prices, symbols=symbols)
        
        if prices_wide.empty:
            session.close()
            return {"portfolio_correlations": {}}
        
        # Calculate daily returns for each stock
        returns = prices_wide.pct_change().dropna()
        
        # Calculate weighted portfolio returns
        portfolio_returns = pd.Series(0.0, index=returns.index)
        for symbol in symbols:
            if symbol in returns.columns and symbol in weights_dict:
                portfolio_returns += returns[symbol] * weights_dict[symbol]
        
        # Calculate correlation with each benchmark
        portfolio_corrs = {}
        
        for benchmark in benchmark_symbols:
            bench_df = fetch_benchmark_history(benchmark, start_date=start_date, end_date=end_date, session=session)
            
            if bench_df.empty:
                portfolio_corrs[benchmark] = None
                continue
            
            # Pivot benchmark data
            bench_wide = pivot_price_data(bench_df, symbols=[benchmark])
            
            if bench_wide.empty or benchmark not in bench_wide.columns:
                portfolio_corrs[benchmark] = None
                continue
            
            # Calculate benchmark returns
            bench_returns = bench_wide[benchmark].pct_change().dropna()
            
            # Align dates
            aligned_portfolio = portfolio_returns.reindex(bench_returns.index).dropna()
            aligned_bench = bench_returns.reindex(aligned_portfolio.index).dropna()
            
            if len(aligned_portfolio) < 30 or len(aligned_bench) < 30:
                portfolio_corrs[benchmark] = None
                continue
            
            # Calculate correlation
            corr = aligned_portfolio.corr(aligned_bench)
            portfolio_corrs[benchmark] = float(corr) if not pd.isna(corr) else None
        
        session.close()
        
        return {"portfolio_correlations": portfolio_corrs}
        
    except Exception as e:
        logger.error(f"Error calculating portfolio correlation: {e}", exc_info=True)
        return {"portfolio_correlations": {}}


def generate_correlation_insights(
    benchmark_data: Dict,
    inter_stock_data: Dict,
    portfolio_corr_data: Dict = None,
    portfolio_df: pd.DataFrame = None
) -> Dict:
    """
    Generate comprehensive, user-friendly correlation insights with specific stock names.
    
    Returns insights structured as:
    {
        "key_takeaways": [...],
        "recommendations": [...]
    }
    """
    insights_list = []
    actions_list = []
    
    def add_insight(title, text, reasoning):
        insights_list.append({"title": title, "text": text, "reasoning": reasoning})
    
    def add_action(title, text, reasoning):
        actions_list.append({"title": title, "text": text, "reasoning": reasoning})
    
    try:
        # ----------- BENCHMARK CORRELATION INSIGHTS -----------
        
        has_benchmark_data = (
            benchmark_data.get("correlations") and 
            len(benchmark_data.get("correlations", [])) > 0 and
            len(benchmark_data.get("benchmarks", [])) > 0
        )
        
        if has_benchmark_data:
            logger.info("Generating benchmark correlation insights")
            correlations = benchmark_data["correlations"]
            benchmarks = benchmark_data.get("benchmarks", [])
            
            # Focus on Nifty 50 for main insights
            if "Nifty 50" in benchmarks:
                nifty_correlations = []
                high_corr_stocks = []
                etf_stocks = []
                low_corr_stocks = []
                negative_corr_stocks = []
                
                for stock_data in correlations:
                    symbol = stock_data.get("symbol")
                    nifty_corr = stock_data.get("Nifty 50")
                    
                    if nifty_corr is None:
                        continue
                    
                    nifty_correlations.append((symbol, nifty_corr))
                    
                    # Categorize stocks
                    if nifty_corr >= 0.95:
                        etf_stocks.append((symbol, nifty_corr))
                    elif nifty_corr >= 0.7:
                        high_corr_stocks.append((symbol, nifty_corr))
                    elif 0.0 <= nifty_corr < 0.5:
                        low_corr_stocks.append((symbol, nifty_corr))
                    elif nifty_corr < 0.0:
                        negative_corr_stocks.append((symbol, nifty_corr))
                
                # Insight 1: Most stocks are market-driven (with specific names)
                if high_corr_stocks:
                    stock_names = ", ".join([f"**{s[0]}** ({s[1]:.2f})" for s in sorted(high_corr_stocks, key=lambda x: x[1], reverse=True)[:5]])
                    add_insight(
                        "🔹 Stocks strongly tied to Nifty 50",
                        f"{stock_names} move very closely with the Nifty 50.",
                        "These stocks' performance is largely decided by market direction. When the Nifty falls, these stocks are likely to fall together, limiting downside protection during broad market corrections."
                    )
                
                # Insight 2: ETFs show near-perfect correlation (specific names)
                if etf_stocks:
                    etf_names = ", ".join([f"**{s[0]}** ({s[1]:.2f})" for s in etf_stocks])
                    add_insight(
                        "🔹 Index funds/ETFs detected",
                        f"{etf_names} move almost identically with the Nifty 50.",
                        "These are pure market exposure instruments. They add no diversification, only scale your market exposure. Holding both index ETFs and highly correlated stocks doubles your market risk."
                    )
                
                # Insight 3: Low correlation stocks (specific names)
                if low_corr_stocks:
                    low_names = ", ".join([f"**{s[0]}** ({s[1]:.2f})" for s in sorted(low_corr_stocks, key=lambda x: x[1])[:4]])
                    add_insight(
                        "🔹 Independent movers identified",
                        f"{low_names} behave more independently from the market.",
                        "These stocks have company-specific drivers (earnings, sector demand, contracts). They help smooth portfolio returns when the market is volatile."
                    )
                
                # Insight 4: Negative correlation stocks (specific names - rare but valuable)
                if negative_corr_stocks:
                    neg_names = ", ".join([f"**{s[0]}** ({s[1]:.2f})" for s in sorted(negative_corr_stocks, key=lambda x: x[1])])
                    add_insight(
                        "🔹 Natural hedges found",
                        f"{neg_names} sometimes move opposite to the market.",
                        "These stocks may rise or stay stable even when the market falls. They act as natural shock absorbers during downturns."
                    )
                
                # Portfolio-level insight
                if nifty_correlations:
                    avg_corr = np.mean([c[1] for c in nifty_correlations])
                    strong_count = len(high_corr_stocks) + len(etf_stocks)
                    total_count = len(nifty_correlations)
                    
                    if strong_count / total_count >= 0.6:
                        add_insight(
                            "📊 Portfolio is market-driven",
                            f"**{strong_count}/{total_count}** stocks ({int(strong_count/total_count*100)}%) have high correlation (≥0.7) with the Nifty 50.",
                            "Your portfolio's returns are heavily influenced by overall market direction. Diversification into low-correlation stocks would improve risk-adjusted returns."
                        )
        
        # ----------- PORTFOLIO-LEVEL CORRELATION INSIGHTS -----------
        
        if portfolio_corr_data and portfolio_corr_data.get("portfolio_correlations"):
            portfolio_corrs = portfolio_corr_data["portfolio_correlations"]
            valid_corrs = {k: v for k, v in portfolio_corrs.items() if v is not None}
            
            if valid_corrs:
                logger.info("Generating portfolio-level correlation insights")
                max_benchmark = max(valid_corrs.items(), key=lambda x: x[1])
                max_name, max_corr = max_benchmark
                
                if max_corr >= 0.8:
                    add_insight(
                        "📈 Portfolio tracks market closely",
                        f"Your overall portfolio has **{max_corr:.2f}** correlation with **{max_name}**.",
                        "This high correlation means your portfolio moves almost in lockstep with this index. Diversification into low-correlated assets could reduce risk."
                    )
                elif max_corr >= 0.5:
                    add_insight(
                        "📈 Moderate market correlation",
                        f"Portfolio correlation: **{max_corr:.2f}** with **{max_name}**.",
                        "Your portfolio is influenced by market movements but maintains some independent performance. Good balance of growth and diversification."
                    )
                elif max_corr < 0.5:
                    add_insight(
                        "📈 Well-diversified portfolio",
                        f"Highest correlation is only **{max_corr:.2f}** with **{max_name}**.",
                        "Your portfolio doesn't closely track any single market index. This reduces systemic risk and allows for independent performance."
                    )
        
        # ----------- INTER-STOCK CORRELATION INSIGHTS -----------
        
        if inter_stock_data.get("correlations") and len(inter_stock_data.get("correlations", [])) > 0:
            correlations = inter_stock_data["correlations"]
            symbols = inter_stock_data.get("symbols", [])
            
            # Find high correlation pairs (clusters)
            high_corr_pairs = []
            low_corr_stocks_count = {}
            
            for i, stock1_data in enumerate(correlations):
                symbol1 = stock1_data.get("symbol")
                low_corr_count = 0
                
                for symbol2 in symbols:
                    if symbol1 == symbol2:
                        continue
                    
                    corr = stock1_data.get(symbol2)
                    
                    if corr is None:
                        continue
                    
                    # High correlation pairs
                    if corr >= 0.8 and symbol1 < symbol2:  # Avoid duplicates
                        high_corr_pairs.append((symbol1, symbol2, corr))
                    
                    # Count low correlations for each stock
                    if abs(corr) < 0.3:
                        low_corr_count += 1
                
                low_corr_stocks_count[symbol1] = low_corr_count / max(len(symbols) - 1, 1)
            
            # Insight 5: High correlation clusters (specific pairs)
            if high_corr_pairs:
                top_pairs = sorted(high_corr_pairs, key=lambda x: x[2], reverse=True)[:4]
                pair_text = "; ".join([f"**{p[0]}** & **{p[1]}** ({p[2]:.2f})" for p in top_pairs])
                
                add_insight(
                    "🔹 Stock clusters detected",
                    f"These stock pairs move almost identically: {pair_text}",
                    "These stocks behave like one combined position. If one stock in a cluster falls, others are likely to fall too, creating hidden concentration risk even if your allocation looks spread out."
                )
            
            # Insight 6: True diversifiers (specific names)
            true_diversifiers = sorted(low_corr_stocks_count.items(), key=lambda x: x[1], reverse=True)
            if true_diversifiers and true_diversifiers[0][1] > 0.4:
                top_divs = [(d[0], d[1]) for d in true_diversifiers[:4] if d[1] > 0.4]
                if top_divs:
                    div_text = ", ".join([f"**{d[0]}** ({int(d[1]*100)}% independent)" for d in top_divs])
                    add_insight(
                        "🔹 Best diversifiers in portfolio",
                        f"{div_text} behave independently from most other holdings.",
                        "These stocks' price movements are driven by unique business factors. They are your most valuable diversifiers and help reduce overall portfolio volatility."
                    )
        
        # ----------- ACTIONABLE RECOMMENDATIONS -----------
        
        # Action 1: Specific replacement suggestion
        if benchmark_data.get("correlations"):
            high_corr_count = sum(1 for c in benchmark_data["correlations"] if c.get("Nifty 50", 0) >= 0.7)
            low_corr_stocks = [c["symbol"] for c in benchmark_data["correlations"] if 0 <= c.get("Nifty 50", 1) < 0.5]
            
            if high_corr_count > 3 and low_corr_stocks:
                add_action(
                    "💡 Reduce market dependence",
                    f"Consider trimming one high-correlation stock and adding exposure to low-correlation sectors.",
                    f"Stocks like {', '.join([f'**{s}**' for s in low_corr_stocks[:3]])} could improve your risk-adjusted returns without sacrificing growth potential."
                )
        
        # Action 2: Trim specific clusters
        if high_corr_pairs:
            cluster_stocks = list(set([p[0] for p in high_corr_pairs[:2]] + [p[1] for p in high_corr_pairs[:2]]))
            add_action(
                "💡 Break up concentrated clusters",
                f"Consider reducing position sizes in {', '.join([f'**{s}**' for s in cluster_stocks])}.",
                "These stocks move together. Trimming cluster exposure can meaningfully reduce portfolio volatility without hurting diversification."
            )
        
        # Action 3: Balance strategy
        add_action(
            "💡 Optimal portfolio mix",
            "Aim for 60-70% market-correlated stocks (growth) + 30-40% low-correlated stocks (stability).",
            "This balance captures market upside while providing downside protection during corrections."
        )
        
        # Summary insight (always first)
        total_stocks = len(benchmark_data.get("correlations", []))
        if total_stocks > 0:
            insights_list.insert(0, {
                "title": "📊 Portfolio Overview",
                "text": f"Analyzing correlation patterns across your {total_stocks} holdings.",
                "reasoning": "True diversification comes from owning stocks that behave differently — not just owning more stocks. Use the heatmap and these insights to identify concentration risks."
            })
        
    except Exception as e:
        logger.error(f"Error generating correlation insights: {e}", exc_info=True)
    
    # Fallback if no insights generated
    if not insights_list:
        insights_list.append({
            "title": "📊 Insufficient Data",
            "text": "Unable to generate correlation insights.",
            "reasoning": "More historical price data is needed for correlation analysis."
        })
    
    if not actions_list:
        actions_list.append({
            "title": "💡 Monitor Correlations",
            "text": "Regularly review how your stocks move together.",
            "reasoning": "Market conditions change, and today's diversifiers may become tomorrow's correlated assets."
        })
    
    return {
        "key_takeaways": insights_list,
        "recommendations": actions_list
    }


def create_correlation_heatmap(portfolio_df: pd.DataFrame, symbols: list = None, benchmark_symbols: list = None):
    """
    Main function to create correlation heatmap with insights.
    
    Args:
        portfolio_df: Portfolio DataFrame
        symbols: Optional list of symbols to analyze
        benchmark_symbols: Optional list of benchmarks
        
    Returns:
        Dict with correlation data and insights
    """
    try:
        logger.info("=== Starting create_correlation_heatmap ===")
        
        # Extract symbols from portfolio
        if symbols is None:
            if portfolio_df is None or portfolio_df.empty:
                logger.error("No portfolio data provided")
                return {
                    "status": "error",
                    "message": "No portfolio data provided"
                }
            
            if 'Symbol' in portfolio_df.columns:
                # Filter to current holdings only (exclude sold stocks)
                if 'Remaining Qty' in portfolio_df.columns or 'Remaining_Qty' in portfolio_df.columns:
                    qty_col = 'Remaining Qty' if 'Remaining Qty' in portfolio_df.columns else 'Remaining_Qty'
                    # Get latest data for each symbol
                    if 'Date' in portfolio_df.columns:
                        latest_df = portfolio_df.sort_values('Date').groupby('Symbol').last().reset_index()
                    else:
                        latest_df = portfolio_df
                    
                    # Filter stocks with remaining quantity > 0
                    current_holdings = latest_df[latest_df[qty_col] > 0]['Symbol'].unique().tolist()
                    symbols = current_holdings
                    logger.info(f"Filtered to {len(symbols)} current holdings (excluding sold stocks)")
                else:
                    # Fallback: use all unique symbols
                    symbols = portfolio_df['Symbol'].dropna().unique().tolist()
                    logger.info(f"Extracted {len(symbols)} symbols from portfolio (no quantity filter available)")
            else:
                logger.error("No Symbol column in portfolio")
                return {
                    "status": "error",
                    "message": "No Symbol column in portfolio"
                }
        
        if not symbols:
            logger.error("Symbols list is empty")
            return {
                "status": "error",
                "message": "No symbols found in portfolio"
            }
        
        logger.info(f"Processing {len(symbols)} symbols for correlation: {symbols}")
        
        # Calculate benchmark correlations
        logger.info("Calculating benchmark correlations...")
        try:
            benchmark_data = calculate_benchmark_correlations(symbols, benchmark_symbols)
            logger.info(f"Benchmark correlation result: {len(benchmark_data.get('correlations', []))} stocks")
        except Exception as e:
            logger.error(f"Error in calculate_benchmark_correlations: {e}", exc_info=True)
            benchmark_data = {"benchmarks": [], "symbols": [], "correlations": []}
        
        # Calculate inter-stock correlations
        logger.info("Calculating inter-stock correlations...")
        try:
            inter_stock_data = calculate_inter_stock_correlations(symbols)
            logger.info(f"Inter-stock correlation result: {len(inter_stock_data.get('correlations', []))} stocks")
        except Exception as e:
            logger.error(f"Error in calculate_inter_stock_correlations: {e}", exc_info=True)
            inter_stock_data = {"symbols": [], "correlations": []}
        
        # Calculate portfolio-level correlation
        logger.info("Calculating portfolio-level correlation...")
        try:
            portfolio_corr_data = calculate_portfolio_correlation(portfolio_df, symbols, benchmark_symbols)
            logger.info(f"Portfolio correlation calculated for {len(portfolio_corr_data.get('portfolio_correlations', {}))} benchmarks")
        except Exception as e:
            logger.error(f"Error in calculate_portfolio_correlation: {e}", exc_info=True)
            portfolio_corr_data = {"portfolio_correlations": {}}
        
        # Generate insights
        logger.info("Generating insights...")
        try:
            insights = generate_correlation_insights(
                benchmark_data=benchmark_data,
                inter_stock_data=inter_stock_data,
                portfolio_corr_data=portfolio_corr_data,
                portfolio_df=portfolio_df
            )
            logger.info(f"Generated {len(insights.get('key_takeaways', []))} key takeaways and {len(insights.get('recommendations', []))} recommendations")
        except Exception as e:
            logger.error(f"Error in generate_correlation_insights: {e}", exc_info=True)
            insights = {
                "key_takeaways": [{
                    "title": "⚠️ Insight Generation Error",
                    "text": f"Error generating insights: {str(e)}",
                    "reasoning": "Please check backend logs for details."
                }],
                "recommendations": []
            }
        
        # Combine results
        result = {
            "benchmark_correlations": benchmark_data,
            "inter_stock_correlations": inter_stock_data,
            "insights": insights,
            "total_stocks": len(symbols),
            "symbols": symbols
        }
        
        logger.info("=== create_correlation_heatmap completed successfully ===")
        
        # Make JSON serializable
        return convert_to_serializable(result)
        
    except Exception as e:
        logger.error(f"CRITICAL ERROR in create_correlation_heatmap: {e}", exc_info=True)
        return {
            "status": "error",
            "message": str(e),
            "symbols": symbols if symbols else [],
            "benchmark_correlations": {"benchmarks": [], "symbols": [], "correlations": []},
            "inter_stock_correlations": {"symbols": [], "correlations": []},
            "insights": {
                "key_takeaways": [{
                    "title": "⚠️ Critical Error",
                    "text": f"Failed to generate correlation analysis: {str(e)}",
                    "reasoning": "Check backend logs for full traceback."
                }],
                "recommendations": []
            }
        }

