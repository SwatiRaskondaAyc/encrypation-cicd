"""
Ratios Verification Script

This script provides detailed debugging output for Risk Ratio calculations.
It shows every step for:
- Sharpe Ratio
- Sortino Ratio
- Information Ratio  
- Treynor Ratio
- Omega Ratio

Usage:
    python verify_ratios.py --portfolio_file "path/to/portfolio.xlsx"
"""

import sys
import os
import json
import logging
from datetime import datetime
from typing import Dict
import pandas as pd
import numpy as np

# Add parent directory to path for imports
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
metrics_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
sys.path.insert(0, metrics_dir)

from metrics.ratios import RatioCalculator
from metrics.repo import fetch_and_align_data
from mtm.orm.engine import get_price_db_session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RatiosVerifier:
    """Detailed verification and debugging for Ratio calculations."""
    
    def __init__(self, normalized_portfolio: Dict, benchmark_symbol: str = "Nifty 50", risk_free_rate: float = 0.0662):
        self.normalized_portfolio = normalized_portfolio
        self.benchmark_symbol = benchmark_symbol
        self.risk_free_rate = risk_free_rate
        self.verification_data = {
            "timestamp": datetime.now().isoformat(),
            "input_data": {},
            "data_fetching": {},
            "individual_calculations": {},
            "portfolio_calculations": {},
            "summary": {}
        }
    
    def verify_all(self) -> Dict:
        """Run complete verification and return detailed JSON."""
        logger.info("Starting Ratios verification...")
        
        # Step 1: Document input data
        self._verify_input_data()
        
        # Step 2: Verify data fetching
        self._verify_data_fetching()
        
        # Step 3: Verify individual stock calculations
        self._verify_individual_calculations()
        
        # Step 4: Verify portfolio calculations
        self._verify_portfolio_calculations()
        
        # Step 5: Generate summary
        self._generate_summary()
        
        return self.verification_data
    
    def _verify_input_data(self):
        """Document all input data."""
        logger.info("Verifying input data...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        
        self.verification_data['input_data'] = {
            "benchmark_symbol": self.benchmark_symbol,
            "risk_free_rate": self.risk_free_rate,
            "risk_free_rate_annual_percentage": f"{self.risk_free_rate*100:.2f}%",
            "lookback_days": 365,
            "lookback_description": "1 year of data for ratio calculations",
            "annualization_factor": 252,
            "annualization_description": "252 trading days per year",
            "number_of_holdings": len(current_holdings),
            "holdings": []
        }
        
        total_value = 0
        for holding in current_holdings:
            symbol = holding.get('symbol')
            quantity = holding.get('quantity', 0)
            price = holding.get('current_price', 0)
            value = quantity * price
            total_value += value
            
            self.verification_data['input_data']['holdings'].append({
                "symbol": symbol,
                "quantity": quantity,
                "current_price": price,
                "market_value": round(value, 2)
            })
        
        # Add weights
        for holding_info in self.verification_data['input_data']['holdings']:
            holding_info['weight'] = round(holding_info['market_value'] / total_value, 4) if total_value > 0 else 0
        
        # Calculate HHI
        weights = [h['weight'] for h in self.verification_data['input_data']['holdings']]
        hhi = sum([w**2 for w in weights])
        
        self.verification_data['input_data']['total_portfolio_value'] = round(total_value, 2)
        self.verification_data['input_data']['hhi'] = round(hhi, 4)
        self.verification_data['input_data']['hhi_description'] = "Herfindahl-Hirschman Index (portfolio concentration). Ranges 0-1, higher = more concentrated"
    
    def _verify_data_fetching(self):
        """Verify data fetching for ratios calculation."""
        logger.info("Verifying data fetching...")
        
        # First, fetch benchmark data
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        try:
            # Benchmark data
            bench_df = fetch_and_align_data(
                symbol=self.benchmark_symbol,
                benchmark_symbol=self.benchmark_symbol,
                lookback_days=365,
                session=session
            )
            
            if not bench_df.empty:
                bench_returns = bench_df['Close_market'].pct_change().dropna()
                
                self.verification_data['data_fetching']['benchmark'] = {
                    "status": "SUCCESS",
                    "date_range": {
                        "start_date": bench_df.index.min().strftime('%Y-%m-%d'),
                        "end_date": bench_df.index.max().strftime('%Y-%m-%d'),
                        "data_points": len(bench_df)
                    },
                    "returns_statistics": {
                        "total_returns": len(bench_returns),
                        "mean_daily_return": round(bench_returns.mean(), 6),
                        "std_daily_return": round(bench_returns.std(), 6),
                        "annualized_return": round(bench_returns.mean() * 252, 4),
                        "annualized_volatility": round(bench_returns.std() * np.sqrt(252), 4)
                    }
                }
            else:
                self.verification_data['data_fetching']['benchmark'] = {
                    "status": "FAILED",
                    "error": "No benchmark data"
                }
            
            # Stock data
            current_holdings = self.normalized_portfolio.get('current_holdings', [])
            for holding in current_holdings:
                symbol = holding.get('symbol')
                logger.info(f"Fetching data for {symbol}...")
                
                df = fetch_and_align_data(
                    symbol=symbol,
                    benchmark_symbol=self.benchmark_symbol,
                    lookback_days=365,
                    session=session
                )
                
                if df.empty or len(df) < 100:
                    self.verification_data['data_fetching'][symbol] = {
                        "status": "INSUFFICIENT_DATA",
                        "data_points": len(df),
                        "minimum_required": 100
                    }
                    continue
                
                stock_returns = df['Close_stock'].pct_change().dropna()
                market_returns = df['Close_market'].pct_change().dropna()
                
                data_info = {
                    "status": "SUCCESS",
                    "date_range": {
                        "start_date": df.index.min().strftime('%Y-%m-%d'),
                        "end_date": df.index.max().strftime('%Y-%m-%d'),
                        "data_points": len(df)
                    },
                    "returns_statistics": {
                        "total_returns": len(stock_returns),
                        "mean_daily_return": round(stock_returns.mean(), 6),
                        "std_daily_return": round(stock_returns.std(), 6)
                    }
                }
                
                self.verification_data['data_fetching'][symbol] = data_info
        
        finally:
            session.close()
    
    def _verify_individual_calculations(self):
        """Verify ratio calculations for each individual stock."""
        logger.info("Verifying individual stock calculations...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        try:
            # Get benchmark returns for alignment
            bench_df = fetch_and_align_data(
                symbol=self.benchmark_symbol,
                benchmark_symbol=self.benchmark_symbol,
                lookback_days=365,
                session=session
            )
            bench_returns = bench_df['Close_market'].pct_change().dropna()
            
            for holding in current_holdings:
                symbol = holding.get('symbol')
                logger.info(f"Calculating ratios for {symbol}...")
                
                df = fetch_and_align_data(
                    symbol=symbol,
                    benchmark_symbol=self.benchmark_symbol,
                    lookback_days=365,
                    session=session
                )
                
                if df.empty or len(df) < 100:
                    self.verification_data['individual_calculations'][symbol] = {
                        "error": "Insufficient data"
                    }
                    continue
                
                # Calculate returns
                stock_returns = df['Close_stock'].pct_change().dropna()
                market_returns_aligned = df['Close_market'].pct_change().dropna()
                
                # Align to common index
                common_idx = stock_returns.index.intersection(market_returns_aligned.index)
                rets = stock_returns.loc[common_idx]
                bench = market_returns_aligned.loc[common_idx]
                
                if len(rets) < 20:
                    self.verification_data['individual_calculations'][symbol] = {
                        "error": "Insufficient aligned data"
                    }
                    continue
                
                # Calculate all metrics with detailed steps
                calc_details = self._calculate_all_ratios(rets, bench, symbol)
                self.verification_data['individual_calculations'][symbol] = calc_details
        
        finally:
            session.close()
    
    def _calculate_all_ratios(self, returns_series: pd.Series, benchmark_returns: pd.Series, symbol: str) -> Dict:
        """Calculate all ratios with detailed step-by-step breakdown."""
        
        N = 252  # Annualization factor
        
        # Basic statistics
        mean_ret = returns_series.mean()
        ann_ret = mean_ret * N
        std_dev = returns_series.std()
        ann_vol = std_dev * np.sqrt(N)
        
        basic_stats = {
            "data_points": len(returns_series),
            "mean_daily_return": round(mean_ret, 6),
            "annual_return": round(ann_ret, 4),
            "annual_return_formula": "Mean Daily Return × 252",
            "std_dev_daily": round(std_dev, 6),
            "annual_volatility": round(ann_vol, 4),
            "annual_volatility_formula": "Std Dev Daily × √252"
        }
        
        # 1. Sharpe Ratio
        sharpe_numerator = ann_ret - self.risk_free_rate
        sharpe = sharpe_numerator / ann_vol if ann_vol > 0 else 0
        
        sharpe_calc = {
            "formula": "(Annual Return - Risk Free Rate) / Annual Volatility",
            "annual_return": round(ann_ret, 4),
            "risk_free_rate": self.risk_free_rate,
            "annual_volatility": round(ann_vol, 4),
            "numerator": round(sharpe_numerator, 4),
            "denominator": round(ann_vol, 4),
            "sharpe_ratio": round(sharpe, 4),
            "interpretation": self._interpret_sharpe(sharpe)
        }
        
        # 2. Sortino Ratio
        neg_rets = returns_series[returns_series < 0]
        downside_std = neg_rets.std() * np.sqrt(N)
        sortino = (ann_ret - self.risk_free_rate) / downside_std if downside_std > 0 else 0
        
        sortino_calc = {
            "formula": "(Annual Return - Risk Free Rate) / Downside Deviation",
            "negative_returns_count": len(neg_rets),
            "negative_returns_std": round(neg_rets.std(), 6),
            "downside_deviation_annualized": round(downside_std, 4),
            "numerator": round(ann_ret - self.risk_free_rate, 4),
            "denominator": round(downside_std, 4),
            "sortino_ratio": round(sortino, 4),
            "interpretation": "Higher is better. Focuses on downside risk only."
        }
        
        # 3. Information Ratio
        active_returns = returns_series - benchmark_returns
        mean_active = active_returns.mean() * N
        tracking_error = active_returns.std() * np.sqrt(N)
        info_ratio = mean_active / tracking_error if tracking_error > 0 else 0
        
        info_calc = {
            "formula": "Active Return / Tracking Error",
            "active_returns_description": "Stock Returns - Benchmark Returns",
            "mean_active_return_annualized": round(mean_active, 4),
            "tracking_error": round(tracking_error, 4),
            "tracking_error_formula": "Std Dev of Active Returns × √252",
            "information_ratio": round(info_ratio, 4),
            "interpretation": "Measures excess return per unit of active risk"
        }
        
        # 4. Treynor Ratio & Beta
        cov_matrix = np.cov(returns_series, benchmark_returns)
        cov_p_m = cov_matrix[0, 1]
        var_m = cov_matrix[1, 1]
        beta = cov_p_m / var_m if var_m > 0 else 0
        treynor = (ann_ret - self.risk_free_rate) / beta if abs(beta) > 0.001 else 0
        
        treynor_calc = {
            "beta_calculation": {
                "formula": "Covariance(Stock, Market) / Variance(Market)",
                "covariance": round(cov_p_m, 8),
                "market_variance": round(var_m, 8),
                "beta": round(beta, 4)
            },
            "treynor_formula": "(Annual Return - Risk Free Rate) / Beta",
            "numerator": round(ann_ret - self.risk_free_rate, 4),
            "beta": round(beta, 4),
            "treynor_ratio": round(treynor, 4),
            "interpretation": "Return per unit of systematic risk (beta)"
        }
        
        # 5. Omega Ratio
        daily_rf = self.risk_free_rate / 252
        excess_returns = returns_series - daily_rf
        pos_excess = excess_returns[excess_returns > 0].sum()
        neg_excess = -excess_returns[excess_returns < 0].sum()
        omega = pos_excess / neg_excess if neg_excess > 0 else (999.99 if pos_excess > 0 else 0)
        
        omega_calc = {
            "formula": "Sum(Positive Excess Returns) / Sum(|Negative Excess Returns|)",
            "daily_risk_free_rate": round(daily_rf, 6),
            "positive_excess_sum": round(pos_excess, 4),
            "negative_excess_sum": round(neg_excess, 4),
            "omega_ratio": round(omega, 4) if omega != 999.99 else 999.99,
            "interpretation": "Ratio of gains to losses. Higher is better."
        }
        
        return {
            "basic_statistics": basic_stats,
            "sharpe_ratio": sharpe_calc,
            "sortino_ratio": sortino_calc,
            "information_ratio": info_calc,
            "treynor_ratio": treynor_calc,
            "omega_ratio": omega_calc
        }
    
    def _interpret_sharpe(self, sharpe: float) -> str:
        """Provide interpretation of Sharpe ratio."""
        if sharpe < 0:
            return "Negative: Returns below risk-free rate"
        elif sharpe < 1:
            return "Below 1: Excess return doesn't justify risk"
        elif sharpe < 2:
            return "1-2: Good risk-adjusted returns"
        elif sharpe < 3:
            return "2-3: Very good risk-adjusted returns"
        else:
            return "Above 3: Excellent risk-adjusted returns"
    
    def _verify_portfolio_calculations(self):
        """Verify portfolio-level calculations."""
        logger.info("Verifying portfolio calculations...")
        
        # Use RatioCalculator to get portfolio metrics
        ratio_calc = RatioCalculator(benchmark_symbol=self.benchmark_symbol, risk_free_rate=self.risk_free_rate)
        ratio_results = ratio_calc.calculate_ratios(self.normalized_portfolio)
        
        portfolio_metrics = ratio_results.get('portfolio_metrics', {})
        
        # Document portfolio aggregation
        portfolio_calc = {
            "aggregation_method": "Weighted portfolio returns calculated from individual stock returns",
            "portfolio_metrics": {
                "sharpe_ratio": portfolio_metrics.get('sharpe_ratio'),
                "sortino_ratio": portfolio_metrics.get('sortino_ratio'),
                "information_ratio": portfolio_metrics.get('information_ratio'),
                "treynor_ratio": portfolio_metrics.get('treynor_ratio'),
                "omega_ratio": portfolio_metrics.get('omega_ratio'),
                "annual_return": portfolio_metrics.get('annual_return'),
                "annual_volatility": portfolio_metrics.get('annual_volatility'),
                "downside_volatility": portfolio_metrics.get('downside_volatility'),
                "tracking_error": portfolio_metrics.get('tracking_error'),
                "beta": portfolio_metrics.get('beta_calc'),
                "hhi": portfolio_metrics.get('hhi')
            },
            "hhi_interpretation": self._interpret_hhi(portfolio_metrics.get('hhi', 0))
        }
        
        self.verification_data['portfolio_calculations'] = portfolio_calc
    
    def _interpret_hhi(self, hhi: float) -> str:
        """Interpret HHI value."""
        if hhi < 0.15:
            return "Highly diversified portfolio"
        elif hhi < 0.25:
            return "Moderately diversified portfolio"
        else:
            return "Concentrated portfolio"
    
    def _generate_summary(self):
        """Generate summary of verification."""
        logger.info("Generating summary...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        
        summary = {
            "total_stocks": len(current_holdings),
            "stocks_with_ratios": 0,
            "stocks_without_ratios": 0,
            "portfolio_sharpe_ratio": None,
            "portfolio_sortino_ratio": None,
            "verification_status": "SUCCESS"
        }
        
        # Count stocks with ratios
        for symbol in self.verification_data['individual_calculations']:
            calc_data = self.verification_data['individual_calculations'][symbol]
            if 'error' not in calc_data:
                summary['stocks_with_ratios'] += 1
            else:
                summary['stocks_without_ratios'] += 1
        
        # Extract portfolio ratios
        portfolio_calc = self.verification_data.get('portfolio_calculations', {})
        portfolio_metrics = portfolio_calc.get('portfolio_metrics', {})
        
        summary['portfolio_sharpe_ratio'] = portfolio_metrics.get('sharpe_ratio')
        summary['portfolio_sortino_ratio'] = portfolio_metrics.get('sortino_ratio')
        summary['portfolio_information_ratio'] = portfolio_metrics.get('information_ratio')
        
        self.verification_data['summary'] = summary


def main():
    """Main entry point for ratios verification."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Verify Ratio calculations')
    parser.add_argument('--portfolio_file', type=str, required=True, help='Path to portfolio file')
    parser.add_argument('--output', type=str, default='ratios_verification.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    # Import orchestrator to normalize portfolio
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sys.path.insert(0, backend_dir)
    from orchestrator import Orchestrator
    
    # Normalize portfolio
    print(f"Normalizing portfolio: {args.portfolio_file}")
    orchestrator = Orchestrator()
    df_normalized = orchestrator._get_normalized_dataframe(args.portfolio_file)
    
    # Get current holdings
    from Portfolio_Analysis.Calculations.repeated_calc import RepeatedCalc
    calculator = RepeatedCalc(df_normalized)
    _ = calculator.calculate_results()
    current_holdings_snapshot = calculator.get_current_holdings()
    
    # Create normalized portfolio JSON
    current_holdings_json = []
    for _, holding in current_holdings_snapshot.iterrows():
        current_holdings_json.append({
            'symbol': holding.get('Symbol'),
            'quantity': holding.get('Qty', 0),
            'current_price': holding.get('Mkt_Price', 0)
        })
    
    normalized_portfolio = {
        'current_holdings': current_holdings_json
    }
    
    # Run verification
    print("Running Ratios verification...")
    verifier = RatiosVerifier(normalized_portfolio)
    verification_output = verifier.verify_all()
    
    # Save output
    with open(args.output, 'w') as f:
        json.dump(verification_output, f, indent=2)
    
    print(f"Verification complete! Output saved to: {args.output}")
    print(f"\nSummary:")
    print(f"  Total stocks: {verification_output['summary']['total_stocks']}")
    print(f"  Stocks with ratios: {verification_output['summary']['stocks_with_ratios']}")
    print(f"  Portfolio Sharpe Ratio: {verification_output['summary']['portfolio_sharpe_ratio']}")
    print(f"  Portfolio Sortino Ratio: {verification_output['summary']['portfolio_sortino_ratio']}")


if __name__ == '__main__':
    main()
