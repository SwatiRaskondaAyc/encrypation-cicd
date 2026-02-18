"""
Alpha Verification Script

This script provides detailed debugging output for Alpha (Jensen's Alpha) calculations.
It shows every step of the calculation process including:
- Input data (beta values, risk-free rate)
- Stock and benchmark returns
- CAPM expected returns
- Alpha calculation

Usage:
    python verify_alpha.py --portfolio_file "path/to/portfolio.xlsx"
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

from metrics.alpha import AlphaCalculator
from metrics.beta import BetaCalculator
from metrics.repo import fetch_and_align_data
from mtm.orm.engine import get_price_db_session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AlphaVerifier:
    """Detailed verification and debugging for Alpha calculations."""
    
    def __init__(self, normalized_portfolio: Dict, benchmark_symbol: str = "Nifty 50", risk_free_rate: float = 0.0662):
        self.normalized_portfolio = normalized_portfolio
        self.benchmark_symbol = benchmark_symbol
        self.risk_free_rate = risk_free_rate
        self.verification_data = {
            "timestamp": datetime.now().isoformat(),
            "input_data": {},
            "beta_values": {},
            "data_fetching": {},
            "calculations": {},
            "portfolio_aggregation": {},
            "summary": {}
        }
    
    def verify_all(self) -> Dict:
        """Run complete verification and return detailed JSON."""
        logger.info("Starting Alpha verification...")
        
        # Step 1: Document input data
        self._verify_input_data()
        
        # Step 2: Get beta values (prerequisite for alpha)
        self._verify_beta_values()
        
        # Step 3: Verify data fetching
        self._verify_data_fetching()
        
        # Step 4: Verify alpha calculations
        self._verify_calculations()
        
        # Step 5: Verify portfolio aggregation
        self._verify_portfolio_aggregation()
        
        # Step 6: Generate summary
        self._generate_summary()
        
        return self.verification_data
    
    def _verify_input_data(self):
        """Document all input data."""
        logger.info("Verifying input data...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        
        self.verification_data['input_data'] = {
            "benchmark_symbol": self.benchmark_symbol,
            "risk_free_rate": self.risk_free_rate,
            "risk_free_rate_description": "Annual risk-free rate (typically 10-year government bond yield)",
            "lookback_days": 365,
            "lookback_description": "1 year of data for alpha calculation",
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
    
    def _verify_beta_values(self):
        """Get and document beta values for all stocks."""
        logger.info("Getting beta values (prerequisite for alpha)...")
        
        # Calculate betas using BetaCalculator
        beta_calc = BetaCalculator(benchmark_symbol=self.benchmark_symbol, lookback_days=730)
        beta_results = beta_calc.calculate_portfolio_beta(self.normalized_portfolio)
        
        # Extract daily betas (alpha uses daily betas)
        daily_betas = beta_results.get('daily_betas', {}).get('individual', {})
        
        self.verification_data['beta_values'] = {
            "source": "BetaCalculator with 730 days lookback",
            "period": "daily",
            "individual_betas": {}
        }
        
        for symbol, beta_data in daily_betas.items():
            self.verification_data['beta_values']['individual_betas'][symbol] = {
                "beta": beta_data.get('beta'),
                "data_points": beta_data.get('data_points'),
                "correlation": beta_data.get('correlation')
            }
    
    def _verify_data_fetching(self):
        """Verify data fetching for alpha calculation."""
        logger.info("Verifying data fetching for alpha...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        try:
            for holding in current_holdings:
                symbol = holding.get('symbol')
                logger.info(f"Fetching data for {symbol}...")
                
                # Fetch aligned data (1 year for alpha)
                df = fetch_and_align_data(
                    symbol=symbol,
                    benchmark_symbol=self.benchmark_symbol,
                    lookback_days=365,
                    session=session
                )
                
                if df.empty or len(df) < 200:
                    self.verification_data['data_fetching'][symbol] = {
                        "status": "INSUFFICIENT_DATA",
                        "data_points": len(df),
                        "minimum_required": 200
                    }
                    continue
                
                # Calculate period data
                start_date = df.index[0]
                end_date = df.index[-1]
                days = (end_date - start_date).days
                
                start_price_stock = df['Close_stock'].iloc[0]
                end_price_stock = df['Close_stock'].iloc[-1]
                start_price_market = df['Close_market'].iloc[0]
                end_price_market = df['Close_market'].iloc[-1]
                
                data_info = {
                    "status": "SUCCESS",
                    "date_range": {
                        "start_date": start_date.strftime('%Y-%m-%d'),
                        "end_date": end_date.strftime('%Y-%m-%d'),
                        "total_days": days,
                        "data_points": len(df)
                    },
                    "prices": {
                        "stock_start_price": round(start_price_stock, 2),
                        "stock_end_price": round(end_price_stock, 2),
                        "benchmark_start_price": round(start_price_market, 2),
                        "benchmark_end_price": round(end_price_market, 2)
                    }
                }
                
                self.verification_data['data_fetching'][symbol] = data_info
        
        finally:
            session.close()
    
    def _verify_calculations(self):
        """Verify alpha calculations for each stock."""
        logger.info("Verifying alpha calculations...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        alpha_calc = AlphaCalculator(benchmark_symbol=self.benchmark_symbol, risk_free_rate=self.risk_free_rate)
        
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        try:
            for holding in current_holdings:
                symbol = holding.get('symbol')
                logger.info(f"Calculating alpha for {symbol}...")
                
                # Get beta for this stock
                beta_info = self.verification_data['beta_values']['individual_betas'].get(symbol, {})
                beta = beta_info.get('beta')
                
                if beta is None:
                    self.verification_data['calculations'][symbol] = {
                        "error": "Beta not available"
                    }
                    continue
                
                # Fetch data
                df = fetch_and_align_data(
                    symbol=symbol,
                    benchmark_symbol=self.benchmark_symbol,
                    lookback_days=365,
                    session=session
                )
                
                if df.empty or len(df) < 200:
                    self.verification_data['calculations'][symbol] = {
                        "error": "Insufficient data"
                    }
                    continue
                
                # Calculate returns
                start_price_stock = df['Close_stock'].iloc[0]
                end_price_stock = df['Close_stock'].iloc[-1]
                actual_return = (end_price_stock - start_price_stock) / start_price_stock
                
                start_price_market = df['Close_market'].iloc[0]
                end_price_market = df['Close_market'].iloc[-1]
                benchmark_return = (end_price_market - start_price_market) / start_price_market
                
                # Adjust risk-free rate for period
                days = (df.index[-1] - df.index[0]).days
                if days < 350:
                    period_rf = (1 + self.risk_free_rate)**(days/365) - 1
                else:
                    period_rf = self.risk_free_rate
                
                # CAPM Expected Return
                expected_return = period_rf + beta * (benchmark_return - period_rf)
                
                # Alpha
                alpha = actual_return - expected_return
                
                calc_details = {
                    "step_1_actual_return": {
                        "formula": "(End Price - Start Price) / Start Price",
                        "stock_start_price": round(start_price_stock, 2),
                        "stock_end_price": round(end_price_stock, 2),
                        "calculation": f"({end_price_stock:.2f} - {start_price_stock:.2f}) / {start_price_stock:.2f}",
                        "actual_return": round(actual_return, 4),
                        "actual_return_percentage": f"{actual_return*100:.2f}%"
                    },
                    "step_2_benchmark_return": {
                        "formula": "(End Benchmark - Start Benchmark) / Start Benchmark",
                        "benchmark_start_price": round(start_price_market, 2),
                        "benchmark_end_price": round(end_price_market, 2),
                        "calculation": f"({end_price_market:.2f} - {start_price_market:.2f}) / {start_price_market:.2f}",
                        "benchmark_return": round(benchmark_return, 4),
                        "benchmark_return_percentage": f"{benchmark_return*100:.2f}%"
                    },
                    "step_3_risk_free_rate": {
                        "annual_risk_free_rate": self.risk_free_rate,
                        "period_days": days,
                        "adjustment_needed": days < 350,
                        "formula": "(1 + Rf)^(days/365) - 1" if days < 350 else "Use annual Rf directly",
                        "period_risk_free_rate": round(period_rf, 4),
                        "period_rf_percentage": f"{period_rf*100:.2f}%"
                    },
                    "step_4_expected_return_capm": {
                        "formula": "Rf + Beta * (Market Return - Rf)",
                        "beta": beta,
                        "market_return": round(benchmark_return, 4),
                        "risk_free_rate": round(period_rf, 4),
                        "market_risk_premium": round(benchmark_return - period_rf, 4),
                        "calculation": f"{period_rf:.4f} + {beta:.4f} * ({benchmark_return:.4f} - {period_rf:.4f})",
                        "expected_return": round(expected_return, 4),
                        "expected_return_percentage": f"{expected_return*100:.2f}%"
                    },
                    "step_5_alpha_calculation": {
                        "formula": "Alpha = Actual Return - Expected Return",
                        "actual_return": round(actual_return, 4),
                        "expected_return": round(expected_return, 4),
                        "calculation": f"{actual_return:.4f} - {expected_return:.4f}",
                        "alpha": round(alpha, 4),
                        "alpha_percentage": f"{alpha*100:.2f}%",
                        "interpretation": self._interpret_alpha(alpha)
                    }
                }
                
                self.verification_data['calculations'][symbol] = calc_details
        
        finally:
            session.close()
    
    def _interpret_alpha(self, alpha: float) -> str:
        """Provide interpretation of alpha value."""
        if alpha > 0:
            return f"Positive alpha ({alpha:.4f}): Stock outperformed expected return (good)"
        elif alpha < 0:
            return f"Negative alpha ({alpha:.4f}): Stock underperformed expected return (bad)"
        else:
            return "Alpha = 0: Stock performed exactly as expected"
    
    def _verify_portfolio_aggregation(self):
        """Verify portfolio-level alpha calculation."""
        logger.info("Verifying portfolio alpha aggregation...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        total_value = self.verification_data['input_data']['total_portfolio_value']
        
        aggregation_details = {
            "individual_stock_alphas": {},
            "weighted_calculation": [],
            "portfolio_alpha": None
        }
        
        weighted_alpha_sum = 0
        total_weight = 0
        
        for holding in current_holdings:
            symbol = holding.get('symbol')
            quantity = holding.get('quantity', 0)
            price = holding.get('current_price', 0)
            value = quantity * price
            weight = value / total_value if total_value > 0 else 0
            
            calc_data = self.verification_data['calculations'].get(symbol, {})
            if 'error' not in calc_data and 'step_5_alpha_calculation' in calc_data:
                alpha_value = calc_data['step_5_alpha_calculation']['alpha']
                
                aggregation_details['individual_stock_alphas'][symbol] = {
                    "alpha": alpha_value,
                    "weight": round(weight, 4),
                    "weighted_alpha": round(alpha_value * weight, 4)
                }
                
                aggregation_details['weighted_calculation'].append({
                    "symbol": symbol,
                    "alpha": alpha_value,
                    "weight": round(weight, 4),
                    "contribution": round(alpha_value * weight, 4)
                })
                
                weighted_alpha_sum += alpha_value * weight
                total_weight += weight
        
        # Calculate portfolio alpha
        if total_weight > 0:
            portfolio_alpha = weighted_alpha_sum / total_weight
            aggregation_details['portfolio_alpha'] = round(portfolio_alpha, 4)
            aggregation_details['portfolio_alpha_percentage'] = f"{portfolio_alpha*100:.2f}%"
            aggregation_details['interpretation'] = self._interpret_alpha(portfolio_alpha)
        
        self.verification_data['portfolio_aggregation'] = aggregation_details
    
    def _generate_summary(self):
        """Generate summary of verification."""
        logger.info("Generating summary...")
        
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        
        summary = {
            "total_stocks": len(current_holdings),
            "stocks_with_alpha": 0,
            "stocks_without_alpha": 0,
            "portfolio_alpha": self.verification_data['portfolio_aggregation'].get('portfolio_alpha'),
            "verification_status": "SUCCESS"
        }
        
        # Count stocks with alpha
        for symbol in self.verification_data['calculations']:
            calc_data = self.verification_data['calculations'][symbol]
            if 'error' not in calc_data and 'step_5_alpha_calculation' in calc_data:
                summary['stocks_with_alpha'] += 1
            else:
                summary['stocks_without_alpha'] += 1
        
        self.verification_data['summary'] = summary


def main():
    """Main entry point for alpha verification."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Verify Alpha calculations')
    parser.add_argument('--portfolio_file', type=str, required=True, help='Path to portfolio file')
    parser.add_argument('--output', type=str, default='alpha_verification.json', help='Output JSON file')
    
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
    print("Running Alpha verification...")
    verifier = AlphaVerifier(normalized_portfolio)
    verification_output = verifier.verify_all()
    
    # Save output
    with open(args.output, 'w') as f:
        json.dump(verification_output, f, indent=2)
    
    print(f"Verification complete! Output saved to: {args.output}")
    print(f"\nSummary:")
    print(f"  Total stocks: {verification_output['summary']['total_stocks']}")
    print(f"  Stocks with alpha: {verification_output['summary']['stocks_with_alpha']}")
    print(f"  Portfolio Alpha: {verification_output['summary']['portfolio_alpha']}")


if __name__ == '__main__':
    main()
