import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Optional
from metrics.repo import fetch_and_align_data
from mtm.orm.engine import get_price_db_session

logger = logging.getLogger(__name__)

class RatioCalculator:
    """
    Calculates Portfolio and Individual Risk Ratios:
    1. Sharpe Ratio
    2. Sortino Ratio
    3. Information Ratio
    """

    def __init__(self, benchmark_symbol: str = "Nifty 50", risk_free_rate: float = 0.0662):
        self.benchmark_symbol = benchmark_symbol
        self.risk_free_rate = risk_free_rate
        self.lookback_days = 365  # 1 Year Analysis

    def calculate_ratios(self, normalized_portfolio: Dict, session = None) -> Dict:
        """
        Calculate metrics for the portfolio and individual stocks.
        """
        current_holdings = normalized_portfolio.get('current_holdings', [])
        
        if not current_holdings:
            return self._empty_response("No holdings")

        close_session = False
        if session is None:
            gen = get_price_db_session()
            session = next(gen)
            close_session = True

        try:
            # 1. Prepare Portfolio Weights
            holdings_map = {}
            total_value = 0
            
            for h in current_holdings:
                qty = float(h.get('quantity', 0))
                price = float(h.get('current_price', 0))
                val = qty * price
                holdings_map[h.get('symbol')] = val
                total_value += val
            
            # 2. Fetch Data for all stocks
            # We need a common index (Benchmark Index)
            # Fetch Benchmark first
            bench_df = fetch_and_align_data(
                 symbol=self.benchmark_symbol, # Hack to get just benchmark
                 benchmark_symbol=self.benchmark_symbol,
                 lookback_days=self.lookback_days,
                 session=session
            )
            
            if bench_df.empty:
                return self._empty_response("Benchmark data missing")
                
            # Rename for clarity
            bench_data = bench_df[['Close_market']].copy()
            bench_data.columns = ['Benchmark']
            bench_returns = bench_data['Benchmark'].pct_change().dropna()
            
            stock_returns_map = {}
            individual_metrics = {}
            
            # 3. Process each stock
            aggregated_returns = pd.Series(0.0, index=bench_returns.index)
            # We align everything to benchmark returns index (intersection)
            
            valid_weight_sum = 0
            
            for symbol, value in holdings_map.items():
                if value <= 0: continue
                
                # Fetch stock data
                df = fetch_and_align_data(
                    symbol=symbol,
                    benchmark_symbol=self.benchmark_symbol,
                    lookback_days=self.lookback_days,
                    session=session
                )
                
                if df.empty or len(df) < 100:
                    metrics = self._empty_metrics(f"Insufficient Data ({len(df)})")
                    individual_metrics[symbol] = metrics
                    continue
                
                # Calculate Daily Returns
                s_returns = df['Close_stock'].pct_change().dropna()
                
                # Align to common benchmark index
                aligned_s = s_returns.reindex(bench_returns.index).fillna(0.0) # Fill missing days with 0 return? or drop?
                # Using 0.0 might dampen volatility incorrectly.
                # Better to use intersection for portfolio calculation.
                
                # Metrics for Individual Stock
                # Use its own aligned data (intersection with market)
                metrics = self._calculate_series_metrics(s_returns, df['Close_market'].pct_change().dropna())
                individual_metrics[symbol] = metrics
                
                # Add to Portfolio Aggregation
                weight = value / total_value
                aggregated_returns += aligned_s * weight
                valid_weight_sum += weight

            # Calculate HHI (Portfolio Concentration)
            # HHI = Sum(weight^2). Ranges 0 to 1.
            weights = [val / total_value for val in holdings_map.values()]
            hhi = sum([w**2 for w in weights])

            # 4. Portfolio Metrics
            # If we missed some data, valid_weight_sum might be close to 1.
            # aggregated_returns is approximately the portfolio return series.
            
            portfolio_metrics = self._calculate_series_metrics(aggregated_returns, bench_returns)
            # Inject HHI into portfolio stats
            if portfolio_metrics:
                portfolio_metrics['hhi'] = round(hhi, 4)
            
            return {
                "portfolio_metrics": portfolio_metrics,
                "individual_metrics": individual_metrics,
                "benchmark": self.benchmark_symbol,
                "risk_free_rate": self.risk_free_rate
            }

        except Exception as e:
            logger.error(f"Error calculating ratios: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return self._empty_response(str(e))
        finally:
            if close_session:
                session.close()

    def _calculate_series_metrics(self, returns_series: pd.Series, benchmark_returns: pd.Series) -> Dict:
        """
        Calculate Sharpe, Sortino, Info Ratio, Treynor, Omega for a return series.
        """
        try:
            # Align
            common_idx = returns_series.index.intersection(benchmark_returns.index)
            rets = returns_series.loc[common_idx]
            bench = benchmark_returns.loc[common_idx]
            
            if len(rets) < 20:
                return self._empty_metrics("Insufficient aligned data")

            # Annualization Factor
            N = 252
            
            # 1. Annualized Return & Volatility
            mean_ret = rets.mean()
            ann_ret = mean_ret * N
            
            std_dev = rets.std()
            ann_vol = std_dev * np.sqrt(N)
            
            # 2. Sharpe Ratio
            # (Rp - Rf) / Sigma_p
            # Rf is annual.
            sharpe = (ann_ret - self.risk_free_rate) / ann_vol if ann_vol > 0 else 0
            
            # 3. Sortino Ratio
            # (Rp - Rf) / Downside_Deviation
            neg_rets = rets[rets < 0]
            downside_std = neg_rets.std() * np.sqrt(N) # Annualized downside vol
            
            sortino = (ann_ret - self.risk_free_rate) / downside_std if downside_std > 0 else 0
            
            # 4. Information Ratio
            # (Rp - Rb) / Tracking_Error
            # Active Return based on series
            active_returns = rets - bench
            mean_active = active_returns.mean() * N # Annualized active return
            tracking_error = active_returns.std() * np.sqrt(N)
            
            info_ratio = mean_active / tracking_error if tracking_error > 0 else 0
            
            # 5. Treynor Ratio & Beta (On the fly)
            # Beta = Cov(Rp, Rm) / Var(Rm)
            cov_matrix = np.cov(rets, bench)
            cov_p_m = cov_matrix[0, 1]
            var_m = cov_matrix[1, 1]
            
            beta = cov_p_m / var_m if var_m > 0 else 0
            
            # Treynor = (Rp - Rf) / Beta
            treynor = (ann_ret - self.risk_free_rate) / beta if abs(beta) > 0.001 else 0
            
            # 6. Omega Ratio
            # Sum(Gains - Threshold) / Sum(Threshold - Losses)
            # Threshold = Daily Risk Free Rate
            daily_rf = self.risk_free_rate / 252
            excess_returns = rets - daily_rf
            
            pos_excess = excess_returns[excess_returns > 0].sum()
            neg_excess = -excess_returns[excess_returns < 0].sum() # Make positive magnitude
            
            omega = pos_excess / neg_excess if neg_excess > 0 else (np.inf if pos_excess > 0 else 0)

            return {
                "sharpe_ratio": round(sharpe, 4),
                "sortino_ratio": round(sortino, 4),
                "information_ratio": round(info_ratio, 4),
                "treynor_ratio": round(treynor, 4),
                "omega_ratio": round(omega, 4) if omega != np.inf else 999.99,
                "annual_return": round(ann_ret, 4),
                "active_return": round(mean_active, 4),
                "annual_volatility": round(ann_vol, 4),
                "downside_volatility": round(downside_std, 4),
                "tracking_error": round(tracking_error, 4),
                "beta_calc": round(beta, 4) # Beta calculated over this 1y period
            }
            
        except Exception as e:
            return self._empty_metrics(str(e))

    def _empty_response(self, error: str):
        return {
            "portfolio_metrics": self._empty_metrics(error),
            "individual_metrics": {},
            "error": error
        }

    def _empty_metrics(self, error: str = None):
        return {
            "sharpe_ratio": None,
            "sortino_ratio": None,
            "information_ratio": None,
            "treynor_ratio": None,
            "omega_ratio": None,
            "hhi": None,
            "annual_return": None,
            "active_return": None,
            "annual_volatility": None,
            "downside_volatility": None,
            "tracking_error": None,
            "beta_calc": None,
            "error": error
        }
