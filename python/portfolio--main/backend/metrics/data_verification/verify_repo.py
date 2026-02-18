"""
Repository Functions Verification Script

This script provides detailed debugging output for data fetching/repository functions.
It verifies:
- fetch_and_align_data function
- Data quality (missing values, duplicates)
- Alignment process

Usage:
    python verify_repo.py --symbol "RELIANCE" --benchmark "Nifty 50"
"""

import sys
import os
import json
import logging
from datetime import datetime
from typing import Dict
import pandas as pd

# Add parent directory to path for imports
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
metrics_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
sys.path.insert(0, metrics_dir)

from metrics.repo import fetch_and_align_data
from mtm.orm.engine import get_price_db_session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RepoVerifier:
    """Detailed verification and debugging for repository functions."""
    
    def __init__(self, symbol: str, benchmark_symbol: str = "Nifty 50", lookback_days: int = 365):
        self.symbol = symbol
        self.benchmark_symbol = benchmark_symbol
        self.lookback_days = lookback_days
        self.verification_data = {
            "timestamp": datetime.now().isoformat(),
            "input_parameters": {},
            "data_fetching": {},
            "data_quality": {},
            "alignment_process": {},
            "summary": {}
        }
    
    def verify_all(self) -> Dict:
        """Run complete verification and return detailed JSON."""
        logger.info("Starting Repository functions verification...")
        
        # Step 1: Document input parameters
        self._verify_input_parameters()
        
        # Step 2: Verify data fetching
        self._verify_data_fetching()
        
        # Step 3: Verify data quality
        self._verify_data_quality()
        
        # Step 4: Generate summary
        self._generate_summary()
        
        return self.verification_data
    
    def _verify_input_parameters(self):
        """Document all input parameters."""
        logger.info("Documenting input parameters...")
        
        self.verification_data['input_parameters'] = {
            "symbol": self.symbol,
            "benchmark_symbol": self.benchmark_symbol,
            "lookback_days": self.lookback_days,
            "lookback_description": f"Fetching {self.lookback_days} days of historical data"
        }
    
    def _verify_data_fetching(self):
        """Verify fetch_and_align_data function."""
        logger.info("Verifying fetch_and_align_data...")
        
        price_gen = get_price_db_session()
        session = next(price_gen)
        
        try:
            # Fetch aligned data
            df = fetch_and_align_data(
                symbol=self.symbol,
                benchmark_symbol=self.benchmark_symbol,
                lookback_days=self.lookback_days,
                session=session
            )
            
            if df.empty:
                self.verification_data['data_fetching'] = {
                    "status": "FAILED",
                    "error": "No data fetched. Symbol may not exist or no data in database."
                }
                return
            
            # Document fetched data
            fetching_info = {
                "status": "SUCCESS",
                "date_range": {
                    "start_date": df.index.min().strftime('%Y-%m-%d'),
                    "end_date": df.index.max().strftime('%Y-%m-%d'),
                    "total_days_in_range": (df.index.max() - df.index.min()).days,
                    "actual_data_points": len(df)
                },
                "columns": list(df.columns),
                "first_10_records": [],
                "last_10_records": [],
                "sample_middle_records": []
            }
            
            # First 10 records
            for idx, row in df.head(10).iterrows():
                fetching_info['first_10_records'].append({
                    "date": idx.strftime('%Y-%m-%d'),
                    "stock_close": round(row['Close_stock'], 2),
                    "market_close": round(row['Close_market'], 2)
                })
            
            # Last 10 records
            for idx, row in df.tail(10).iterrows():
                fetching_info['last_10_records'].append({
                    "date": idx.strftime('%Y-%m-%d'),
                    "stock_close": round(row['Close_stock'], 2),
                    "market_close": round(row['Close_market'], 2)
                })
            
            # Middle sample (around middle of dataset)
            mid_point = len(df) // 2
            for idx, row in df.iloc[mid_point:mid_point+5].iterrows():
                fetching_info['sample_middle_records'].append({
                    "date": idx.strftime('%Y-%m-%d'),
                    "stock_close": round(row['Close_stock'], 2),
                    "market_close": round(row['Close_market'], 2)
                })
            
            self.verification_data['data_fetching'] = fetching_info
            
            # Store dataframe for quality checks
            self.df = df
        
        finally:
            session.close()
    
    def _verify_data_quality(self):
        """Verify data quality."""
        logger.info("Verifying data quality...")
        
        if not hasattr(self, 'df') or self.df.empty:
            self.verification_data['data_quality'] = {
                "error": "No data available for quality check"
            }
            return
        
        df = self.df
        
        quality_info = {
            "missing_values": {},
            "duplicates": {},
            "price_statistics": {},
            "return_statistics": {}
        }
        
        # Check for missing values
        missing_stock = df['Close_stock'].isna().sum()
        missing_market = df['Close_market'].isna().sum()
        
        quality_info['missing_values'] = {
            "stock_missing_count": int(missing_stock),
            "market_missing_count": int(missing_market),
            "total_rows": len(df),
            "stock_missing_percentage": round(missing_stock / len(df) * 100, 2),
            "market_missing_percentage": round(missing_market / len(df) * 100, 2),
            "status": "CLEAN" if (missing_stock == 0 and missing_market == 0) else "HAS_MISSING_VALUES"
        }
        
        # Check for duplicate dates
        duplicate_dates = df.index.duplicated().sum()
        
        quality_info['duplicates'] = {
            "duplicate_date_count": int(duplicate_dates),
            "status": "CLEAN" if duplicate_dates == 0 else "HAS_DUPLICATES"
        }
        
        if duplicate_dates > 0:
            dup_dates = df.index[df.index.duplicated()].tolist()
            quality_info['duplicates']['duplicate_dates'] = [d.strftime('%Y-%m-%d') for d in dup_dates[:5]]
        
        # Price statistics
        quality_info['price_statistics'] = {
            "stock": {
                "min": round(df['Close_stock'].min(), 2),
                "max": round(df['Close_stock'].max(), 2),
                "mean": round(df['Close_stock'].mean(), 2),
                "median": round(df['Close_stock'].median(), 2),
                "std_dev": round(df['Close_stock'].std(), 2)
            },
            "market": {
                "min": round(df['Close_market'].min(), 2),
                "max": round(df['Close_market'].max(), 2),
                "mean": round(df['Close_market'].mean(), 2),
                "median": round(df['Close_market'].median(), 2),
                "std_dev": round(df['Close_market'].std(), 2)
            }
        }
        
        # Return statistics
        stock_returns = df['Close_stock'].pct_change().dropna()
        market_returns = df['Close_market'].pct_change().dropna()
        
        quality_info['return_statistics'] = {
            "stock_returns": {
                "count": len(stock_returns),
                "mean_daily": round(stock_returns.mean(), 6),
                "std_dev_daily": round(stock_returns.std(), 6),
                "min_return": round(stock_returns.min(), 6),
                "max_return": round(stock_returns.max(), 6),
                "negative_returns_count": int((stock_returns < 0).sum()),
                "positive_returns_count": int((stock_returns > 0).sum())
            },
            "market_returns": {
                "count": len(market_returns),
                "mean_daily": round(market_returns.mean(), 6),
                "std_dev_daily": round(market_returns.std(), 6),
                "min_return": round(market_returns.min(), 6),
                "max_return": round(market_returns.max(), 6)
            }
        }
        
        # Alignment quality
        quality_info['alignment_process'] = {
            "description": "Inner join on dates to ensure both stock and market data exist",
            "aligned_data_points": len(df),
            "alignment_method": "Inner join on date index",
            "quality_status": "GOOD" if len(df) >= 200 else "LIMITED DATA"
        }
        
        self.verification_data['data_quality'] = quality_info
        self.verification_data['alignment_process'] = quality_info['alignment_process']
    
    def _generate_summary(self):
        """Generate summary of verification."""
        logger.info("Generating summary...")
        
        summary = {
            "symbol": self.symbol,
            "benchmark": self.benchmark_symbol,
            "data_fetch_status": self.verification_data['data_fetching'].get('status', 'UNKNOWN'),
            "data_quality_status": "UNKNOWN",
            "verification_status": "SUCCESS"
        }
        
        # Determine overall data quality
        if 'data_quality' in self.verification_data:
            quality = self.verification_data['data_quality']
            missing_status = quality.get('missing_values', {}).get('status', 'UNKNOWN')
            dup_status = quality.get('duplicates', {}).get('status', 'UNKNOWN')
            
            if missing_status == 'CLEAN' and dup_status == 'CLEAN':
                summary['data_quality_status'] = 'EXCELLENT'
            elif missing_status == 'HAS_MISSING_VALUES' or dup_status == 'HAS_DUPLICATES':
                summary['data_quality_status'] = 'NEEDS_ATTENTION'
            
            summary['total_data_points'] = self.verification_data['data_fetching'].get('date_range', {}).get('actual_data_points', 0)
        
        self.verification_data['summary'] = summary


def main():
    """Main entry point for repo verification."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Verify Repository functions')
    parser.add_argument('--symbol', type=str, required=True, help='Stock symbol to verify')
    parser.add_argument('--benchmark', type=str, default='Nifty 50', help='Benchmark symbol')
    parser.add_argument('--lookback_days', type=int, default=365, help='Days to look back')
    parser.add_argument('--output', type=str, default='repo_verification.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    # Run verification
    print(f"Running Repository verification for {args.symbol}...")
    verifier = RepoVerifier(args.symbol, args.benchmark, args.lookback_days)
    verification_output = verifier.verify_all()
    
    # Save output
    with open(args.output, 'w') as f:
        json.dump(verification_output, f, indent=2)
    
    print(f"Verification complete! Output saved to: {args.output}")
    print(f"\nSummary:")
    print(f"  Symbol: {verification_output['summary']['symbol']}")
    print(f"  Data Fetch Status: {verification_output['summary']['data_fetch_status']}")
    print(f"  Data Quality Status: {verification_output['summary']['data_quality_status']}")
    print(f"  Total Data Points: {verification_output['summary'].get('total_data_points', 0)}")


if __name__ == '__main__':
    main()
