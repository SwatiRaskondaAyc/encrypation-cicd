"""
Beta Verification Script

This script provides detailed debugging output for Beta calculations.
It shows every step of the calculation process including:
- Input data (dates, prices)
- Return calculations
- Covariance and variance
- Final beta values

Usage:
    python verify_beta.py --portfolio_file "path/to/portfolio.xlsx"
"""

import sys
import os
import json
import logging
from datetime import datetime
from typing import Dict, List
import pandas as pd
import numpy as np

# Add parent directory to path for imports
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
metrics_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
sys.path.insert(0, metrics_dir)

from metrics.beta import BetaCalculator
from metrics.repo import fetch_and_align_data
from mtm.orm.engine import get_price_db_session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BetaVerifier:
    """Detailed verification and debugging for Beta calculations."""
    
    def __init__(self, normalized_portfolio: Dict, benchmark_symbol: str = "Nifty 50"):
        self.normalized_portfolio = normalized_portfolio
        self.benchmark_symbol = benchmark_symbol
        self.verification_data = {
            "timestamp": datetime.now().isoformat(),
            "input_data": {},
            "data_fetching": {},
            "calculations": {},
            "portfolio_aggregation": {},
            "summary": {}
        }
    
    def verify_all(self) -> Dict:
        """Run complete verification and return detailed JSON."""
        logger.info("Starting Beta verification...")
        
        # Step 1: Document input data
        self._verify_input_data()
        
        # Step 2: Verify data fetching for each stock
        self._verify_data_fetching()
        
        # Step 3: Verify calculations (daily and monthly)
        self._verify_calculations()
        
        # Step 4: Verify portfolio aggregation
        self._verify_portfolio_aggregation()
        
        # Step 5: Generate summary
        self._generate_summary()
        
        return self.verification_data
    
    def _verify_input_data(self):
        """Document all input data."""
        logger.info("Verifying input data...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        
        self.verification_data['input_data'] = {
            "benchmark_symbol": self.benchmark_symbol,
            "lookback_days": 730,
            "lookback_description": "2 years of data for monthly beta calculation",
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
        
        self.verification_data['input_data']['total_portfolio_value'] = round(total_value, 2)
    
    def _verify_data_fetching(self):
        """Verify data fetching for each stock."""
        logger.info("Verifying data fetching...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        try:
            for holding in current_holdings:
                symbol = holding.get('symbol')
                logger.info(f"Fetching data for {symbol}...")
                
                # Fetch aligned data
                df = fetch_and_align_data(
                    symbol=symbol,
                    benchmark_symbol=self.benchmark_symbol,
                    lookback_days=730,
                    session=session
                )
                
                if df.empty:
                    self.verification_data['data_fetching'][symbol] = {
                        "status": "FAILED",
                        "error": "No data fetched"
                    }
                    continue
                
                # Document fetched data
                data_info = {
                    "status": "SUCCESS",
                    "date_range": {
                        "start_date": df.index.min().strftime('%Y-%m-%d'),
                        "end_date": df.index.max().strftime('%Y-%m-%d'),
                        "total_days": (df.index.max() - df.index.min()).days,
                        "data_points": len(df)
                    },
                    "first_5_records": [],
                    "last_5_records": []
                }
                
                # First 5 records
                for idx, row in df.head(5).iterrows():
                    data_info['first_5_records'].append({
                        "date": idx.strftime('%Y-%m-%d'),
                        "stock_price": round(row['Close_stock'], 2),
                        "benchmark_price": round(row['Close_market'], 2)
                    })
                
                # Last 5 records
                for idx, row in df.tail(5).iterrows():
                    data_info['last_5_records'].append({
                        "date": idx.strftime('%Y-%m-%d'),
                        "stock_price": round(row['Close_stock'], 2),
                        "benchmark_price": round(row['Close_market'], 2)
                    })
                
                self.verification_data['data_fetching'][symbol] = data_info
        
        finally:
            session.close()
    
    def _verify_calculations(self):
        """Verify beta calculations for both daily and monthly periods."""
        logger.info("Verifying beta calculations...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        calculator = BetaCalculator(benchmark_symbol=self.benchmark_symbol, lookback_days=730)
        
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        try:
            for holding in current_holdings:
                symbol = holding.get('symbol')
                logger.info(f"Calculating beta for {symbol}...")
                
                self.verification_data['calculations'][symbol] = {
                    "daily_beta": {},
                    "monthly_beta": {}
                }
                
                # Daily Beta
                self._verify_single_period(symbol, 'daily', session)
                
                # Monthly Beta
                self._verify_single_period(symbol, 'monthly', session)
        
        finally:
            session.close()
    
    def _verify_single_period(self, symbol: str, period: str, session):
        """Verify beta calculation for a single period (daily or monthly)."""
        
        # Fetch data
        df = fetch_and_align_data(
            symbol=symbol,
            benchmark_symbol=self.benchmark_symbol,
            lookback_days=730,
            session=session
        )
        
        if df.empty:
            self.verification_data['calculations'][symbol][f'{period}_beta'] = {
                "error": "Insufficient data"
            }
            return
        
        calc_details = {
            "step_1_data_preprocessing": {},
            "step_2_returns_calculation": {},
            "step_3_beta_calculation": {},
            "final_result": {}
        }
        
        # Step 1: Resampling (if monthly)
        if period == 'monthly':
            original_points = len(df)
            df_resampled = df.resample('ME').last()
            df_resampled = df_resampled.dropna(subset=['Close_stock', 'Close_market'])
            
            calc_details['step_1_data_preprocessing'] = {
                "resampling": "Monthly (last business day of month)",
                "original_daily_points": original_points,
                "monthly_points_after_resampling": len(df_resampled),
                "months_of_data": len(df_resampled)
            }
            
            df = df_resampled
        else:
            calc_details['step_1_data_preprocessing'] = {
                "resampling": "None (using daily data)",
                "data_points": len(df)
            }
        
        # Step 2: Calculate returns
        stock_returns = df['Close_stock'].pct_change().dropna()
        market_returns = df['Close_market'].pct_change().dropna()
        
        # Align returns
        valid_data = pd.DataFrame({
            'stock': stock_returns,
            'market': market_returns
        }).dropna()
        
        # Show first 5 returns
        first_5_returns = []
        for idx, row in valid_data.head(5).iterrows():
            first_5_returns.append({
                "date": idx.strftime('%Y-%m-%d'),
                "stock_return": round(row['stock'], 6),
                "market_return": round(row['market'], 6),
                "calculation_formula": "(Price_t - Price_t-1) / Price_t-1"
            })
        
        calc_details['step_2_returns_calculation'] = {
            "total_return_periods": len(valid_data),
            "first_5_returns": first_5_returns,
            "returns_statistics": {
                "stock_mean_return": round(valid_data['stock'].mean(), 6),
                "market_mean_return": round(valid_data['market'].mean(), 6),
                "stock_std_dev": round(valid_data['stock'].std(), 6),
                "market_std_dev": round(valid_data['market'].std(), 6)
            }
        }
        
        # Step 3: Beta calculation
        covariance = valid_data['stock'].cov(valid_data['market'])
        market_variance = valid_data['market'].var()
        
        if market_variance == 0:
            calc_details['step_3_beta_calculation'] = {
                "error": "Market variance is zero"
            }
            self.verification_data['calculations'][symbol][f'{period}_beta'] = calc_details
            return
        
        beta = covariance / market_variance
        correlation = valid_data['stock'].corr(valid_data['market'])
        
        # Annualized volatilities
        annualization_factor = 252 if period == 'daily' else 12
        stock_volatility = valid_data['stock'].std() * np.sqrt(annualization_factor)
        market_volatility = valid_data['market'].std() * np.sqrt(annualization_factor)
        
        calc_details['step_3_beta_calculation'] = {
            "formula": "Beta = Covariance(Stock, Market) / Variance(Market)",
            "covariance_stock_market": round(covariance, 8),
            "variance_market": round(market_variance, 8),
            "beta_value": round(beta, 4),
            "correlation": round(correlation, 4),
            "annualization_factor": annualization_factor,
            "stock_volatility_annualized": round(stock_volatility, 4),
            "market_volatility_annualized": round(market_volatility, 4)
        }
        
        calc_details['final_result'] = {
            "beta": round(beta, 4),
            "interpretation": self._interpret_beta(beta)
        }
        
        self.verification_data['calculations'][symbol][f'{period}_beta'] = calc_details
    
    def _interpret_beta(self, beta: float) -> str:
        """Provide interpretation of beta value."""
        if beta < 0:
            return "Negative beta: Stock moves opposite to market"
        elif beta < 1:
            return f"Low beta ({beta:.2f}): Less volatile than market"
        elif beta == 1:
            return "Beta = 1: Moves in line with market"
        else:
            return f"High beta ({beta:.2f}): More volatile than market"
    
    def _verify_portfolio_aggregation(self):
        """Verify portfolio-level beta calculation."""
        logger.info("Verifying portfolio aggregation...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        calculator = BetaCalculator(benchmark_symbol=self.benchmark_symbol, lookback_days=730)
        
        # Calculate portfolio beta using the actual calculator
        beta_results = calculator.calculate_portfolio_beta(self.normalized_portfolio)
        
        # Extract and document
        for period in ['daily', 'monthly']:
            period_key = f'{period}_betas'
            period_data = beta_results.get(period_key, {})
            
            individual_betas = period_data.get('individual', {})
            portfolio_beta = period_data.get('portfolio_beta')
            metadata = period_data.get('portfolio_metadata', {})
            
            aggregation_details = {
                "individual_stock_betas": {},
                "weighted_calculation": [],
                "portfolio_beta": portfolio_beta,
                "metadata": metadata
            }
            
            # Document individual betas
            total_value = self.verification_data['input_data']['total_portfolio_value']
            
            for holding in current_holdings:
                symbol = holding.get('symbol')
                quantity = holding.get('quantity', 0)
                price = holding.get('current_price', 0)
                value = quantity * price
                weight = value / total_value if total_value > 0 else 0
                
                beta_data = individual_betas.get(symbol, {})
                beta_value = beta_data.get('beta')
                
                aggregation_details['individual_stock_betas'][symbol] = {
                    "beta": beta_value,
                    "weight": round(weight, 4),
                    "weighted_beta": round(beta_value * weight, 4) if beta_value is not None else None
                }
                
                if beta_value is not None:
                    aggregation_details['weighted_calculation'].append({
                        "symbol": symbol,
                        "beta": beta_value,
                        "weight": round(weight, 4),
                        "contribution": round(beta_value * weight, 4)
                    })
            
            # Calculate sum of weighted betas
            if aggregation_details['weighted_calculation']:
                total_weighted_beta = sum(item['contribution'] for item in aggregation_details['weighted_calculation'])
                aggregation_details['portfolio_beta_verification'] = {
                    "sum_of_weighted_betas": round(total_weighted_beta, 4),
                    "calculator_portfolio_beta": portfolio_beta,
                    "match": abs(total_weighted_beta - (portfolio_beta or 0)) < 0.0001
                }
            
            self.verification_data['portfolio_aggregation'][f'{period}_portfolio_beta'] = aggregation_details
    
    def _generate_summary(self):
        """Generate summary of verification."""
        logger.info("Generating summary...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        
        summary = {
            "total_stocks": len(current_holdings),
            "stocks_with_data": 0,
            "stocks_without_data": 0,
            "daily_portfolio_beta": None,
            "monthly_portfolio_beta": None,
            "verification_status": "SUCCESS"
        }
        
        # Count stocks with data
        for symbol in self.verification_data['data_fetching']:
            if self.verification_data['data_fetching'][symbol].get('status') == 'SUCCESS':
                summary['stocks_with_data'] += 1
            else:
                summary['stocks_without_data'] += 1
        
        # Extract portfolio betas
        daily_agg = self.verification_data['portfolio_aggregation'].get('daily_portfolio_beta', {})
        monthly_agg = self.verification_data['portfolio_aggregation'].get('monthly_portfolio_beta', {})
        
        summary['daily_portfolio_beta'] = daily_agg.get('portfolio_beta')
        summary['monthly_portfolio_beta'] = monthly_agg.get('portfolio_beta')
        
        self.verification_data['summary'] = summary


def main():
    """Main entry point for beta verification."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Verify Beta calculations')
    parser.add_argument('--portfolio_file', type=str, required=True, help='Path to portfolio file')
    parser.add_argument('--output', type=str, default='beta_verification.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    # Import orchestrator to normalize portfolio
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sys.path.insert(0, backend_dir)
    from orchestrator import Orchestrator
    
    # Normalize portfolio
    print(f"Normalizing portfolio: {args.portfolio_file}")
    orchestrator = Orchestrator()
    df_normalized = orchestrator._get_normalized_dataframe(args.portfolio_file)
    
    # Get current holdings from RepeatedCalc
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
    print("Running Beta verification...")
    verifier = BetaVerifier(normalized_portfolio)
    verification_output = verifier.verify_all()
    
    # Save output
    with open(args.output, 'w') as f:
        json.dump(verification_output, f, indent=2)
    
    print(f"Verification complete! Output saved to: {args.output}")
    print(f"\nSummary:")
    print(f"  Total stocks: {verification_output['summary']['total_stocks']}")
    print(f"  Stocks with data: {verification_output['summary']['stocks_with_data']}")
    print(f"  Daily Portfolio Beta: {verification_output['summary']['daily_portfolio_beta']}")
    print(f"  Monthly Portfolio Beta: {verification_output['summary']['monthly_portfolio_beta']}")


if __name__ == '__main__':
    main()
