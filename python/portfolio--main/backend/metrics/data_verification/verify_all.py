"""
Master Verification Script

This script runs all metric verifications and combines them into a single comprehensive report.

Usage:
    python verify_all.py --portfolio_file "path/to/portfolio.xlsx" --output "verification_output.json"
"""

import sys
import os
import json
import logging
import numpy as np
from datetime import datetime
from typing import Dict

# Add parent directory to path for imports
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
metrics_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
sys.path.insert(0, metrics_dir)

from verify_beta import BetaVerifier
from verify_alpha import AlphaVerifier
from verify_ratios import RatiosVerifier

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MasterVerifier:
    """Master verifier that runs all metric verifications."""
    
    def __init__(self, normalized_portfolio: Dict):
        self.normalized_portfolio = normalized_portfolio
        self.master_report = {
            "timestamp": datetime.now().isoformat(),
            "verification_type": "COMPREHENSIVE_METRICS_VERIFICATION",
            "portfolio_summary": {},
            "beta_verification": {},
            "alpha_verification": {},
            "ratios_verification": {},
            "overall_summary": {}
        }
    
    def verify_all(self) -> Dict:
        """Run all verifications and combine results."""
        logger.info("="*80)
        logger.info("STARTING COMPREHENSIVE METRICS VERIFICATION")
        logger.info("="*80)
        
        # Document portfolio summary
        self._document_portfolio_summary()
        
        # Run Beta Verification
        logger.info("\n" + "="*80)
        logger.info("BETA VERIFICATION")
        logger.info("="*80)
        try:
            beta_verifier = BetaVerifier(self.normalized_portfolio)
            self.master_report['beta_verification'] = beta_verifier.verify_all()
            logger.info("✓ Beta verification completed successfully")
        except Exception as e:
            logger.error(f"✗ Beta verification failed: {e}")
            self.master_report['beta_verification'] = {"error": str(e)}
        
        # Run Alpha Verification
        logger.info("\n" + "="*80)
        logger.info("ALPHA VERIFICATION")
        logger.info("="*80)
        try:
            alpha_verifier = AlphaVerifier(self.normalized_portfolio)
            self.master_report['alpha_verification'] = alpha_verifier.verify_all()
            logger.info("✓ Alpha verification completed successfully")
        except Exception as e:
            logger.error(f"✗ Alpha verification failed: {e}")
            self.master_report['alpha_verification'] = {"error": str(e)}
        
        # Run Ratios Verification
        logger.info("\n" + "="*80)
        logger.info("RATIOS VERIFICATION")
        logger.info("="*80)
        try:
            ratios_verifier = RatiosVerifier(self.normalized_portfolio)
            self.master_report['ratios_verification'] = ratios_verifier.verify_all()
            logger.info("✓ Ratios verification completed successfully")
        except Exception as e:
            logger.error(f"✗ Ratios verification failed: {e}")
            self.master_report['ratios_verification'] = {"error": str(e)}
        
        # Generate overall summary
        self._generate_overall_summary()
        
        logger.info("\n" + "="*80)
        logger.info("VERIFICATION COMPLETE")
        logger.info("="*80)
        
        return self.master_report
    
    def _document_portfolio_summary(self):
        """Document portfolio summary information."""
        current_holdings = self.normalized_portfolio.get('current_holdings', [])
        
        total_value = sum(
            h.get('quantity', 0) * h.get('current_price', 0) 
            for h in current_holdings
        )
        
        self.master_report['portfolio_summary'] = {
            "total_holdings": len(current_holdings),
            "total_portfolio_value": round(total_value, 2),
            "holdings_list": [
                {
                    "symbol": h.get('symbol'),
                    "quantity": h.get('quantity'),
                    "current_price": h.get('current_price'),
                    "market_value": round(h.get('quantity', 0) * h.get('current_price', 0), 2),
                    "weight": round((h.get('quantity', 0) * h.get('current_price', 0)) / total_value, 4) if total_value > 0 else 0
                }
                for h in current_holdings
            ]
        }
    
    def _generate_overall_summary(self):
        """Generate comprehensive overall summary."""
        logger.info("Generating overall summary...")
        
        summary = {
            "verification_timestamp": self.master_report['timestamp'],
            "portfolio_summary": {
                "total_stocks": self.master_report['portfolio_summary']['total_holdings'],
                "total_value": self.master_report['portfolio_summary']['total_portfolio_value']
            },
            "verification_results": {},
            "key_metrics": {},
            "data_quality": {},
            "production_readiness": {}
        }
        
        # Extract key metrics from each verification
        
        # Beta
        beta_summary = self.master_report['beta_verification'].get('summary', {})
        summary['verification_results']['beta'] = {
            "status": "SUCCESS" if 'error' not in self.master_report['beta_verification'] else "FAILED",
            "stocks_with_data": beta_summary.get('stocks_with_data', 0),
            "stocks_without_data": beta_summary.get('stocks_without_data', 0)
        }
        summary['key_metrics']['daily_portfolio_beta'] = beta_summary.get('daily_portfolio_beta')
        summary['key_metrics']['monthly_portfolio_beta'] = beta_summary.get('monthly_portfolio_beta')
        
        # Alpha
        alpha_summary = self.master_report['alpha_verification'].get('summary', {})
        summary['verification_results']['alpha'] = {
            "status": "SUCCESS" if 'error' not in self.master_report['alpha_verification'] else "FAILED",
            "stocks_with_alpha": alpha_summary.get('stocks_with_alpha', 0),
            "stocks_without_alpha": alpha_summary.get('stocks_without_alpha', 0)
        }
        summary['key_metrics']['portfolio_alpha'] = alpha_summary.get('portfolio_alpha')
        
        # Ratios
        ratios_summary = self.master_report['ratios_verification'].get('summary', {})
        summary['verification_results']['ratios'] = {
            "status": "SUCCESS" if 'error' not in self.master_report['ratios_verification'] else "FAILED",
            "stocks_with_ratios": ratios_summary.get('stocks_with_ratios', 0),
            "stocks_without_ratios": ratios_summary.get('stocks_without_ratios', 0)
        }
        summary['key_metrics']['portfolio_sharpe_ratio'] = ratios_summary.get('portfolio_sharpe_ratio')
        summary['key_metrics']['portfolio_sortino_ratio'] = ratios_summary.get('portfolio_sortino_ratio')
        summary['key_metrics']['portfolio_information_ratio'] = ratios_summary.get('portfolio_information_ratio')
        
        # Data Quality Assessment
        total_stocks = summary['portfolio_summary']['total_stocks']
        stocks_with_all_metrics = min(
            summary['verification_results']['beta']['stocks_with_data'],
            summary['verification_results']['alpha']['stocks_with_alpha'],
            summary['verification_results']['ratios']['stocks_with_ratios']
        )
        
        data_quality_percentage = (stocks_with_all_metrics / total_stocks * 100) if total_stocks > 0 else 0
        
        summary['data_quality'] = {
            "total_stocks": total_stocks,
            "stocks_with_all_metrics": stocks_with_all_metrics,
            "data_completeness_percentage": round(data_quality_percentage, 2),
            "status": self._assess_data_quality(data_quality_percentage)
        }
        
        # Production Readiness Assessment
        all_verifications_passed = all([
            summary['verification_results']['beta']['status'] == 'SUCCESS',
            summary['verification_results']['alpha']['status'] == 'SUCCESS',
            summary['verification_results']['ratios']['status'] == 'SUCCESS'
        ])
        
        summary['production_readiness'] = {
            "all_verifications_passed": all_verifications_passed,
            "data_completeness_ok": data_quality_percentage >= 80,
            "production_ready": all_verifications_passed and data_quality_percentage >= 80,
            "recommendation": self._generate_recommendation(all_verifications_passed, data_quality_percentage)
        }
        
        self.master_report['overall_summary'] = summary
    
    def _assess_data_quality(self, percentage: float) -> str:
        """Assess data quality based on completeness percentage."""
        if percentage >= 95:
            return "EXCELLENT"
        elif percentage >= 80:
            return "GOOD"
        elif percentage >= 60:
            return "FAIR"
        else:
            return "POOR"
    
    def _generate_recommendation(self, all_passed: bool, data_percentage: float) -> str:
        """Generate production readiness recommendation."""
        if all_passed and data_percentage >= 95:
            return "✓ READY FOR PRODUCTION: All metrics calculated successfully with excellent data coverage."
        elif all_passed and data_percentage >= 80:
            return "✓ READY FOR PRODUCTION: All metrics calculated successfully. Some stocks have incomplete data but coverage is acceptable."
        elif all_passed and data_percentage >= 60:
            return "⚠ CAUTION: All metrics calculated but data coverage is limited. Review stocks without data before production deployment."
        elif all_passed:
            return "⚠ NOT RECOMMENDED: While calculations work, data coverage is poor. Investigate missing data before production."
        else:
            return "✗ NOT READY: Some verification failures detected. Review errors before production deployment."


def main():
    """Main entry point for master verification."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Run all metric verifications')
    parser.add_argument('--portfolio_file', type=str, required=True, help='Path to portfolio file')
    parser.add_argument('--output', type=str, default='verification_output.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    # Import orchestrator to normalize portfolio
    from orchestrator import Orchestrator
    from Portfolio_Analysis.Calculations.repeated_calc import RepeatedCalc
    
    # Normalize portfolio
    print(f"\nNormalizing portfolio: {args.portfolio_file}")
    orchestrator = Orchestrator()
    df_normalized = orchestrator._get_normalized_dataframe(args.portfolio_file)
    
    # Get current holdings
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
    
    print(f"Portfolio loaded: {len(current_holdings_json)} holdings")
    print(f"\nStarting comprehensive verification...\n")
    
    # Run master verification
    verifier = MasterVerifier(normalized_portfolio)
    verification_output = verifier.verify_all()
    
    # Custom JSON encoder to handle numpy booleans
    class NumpyEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.bool_):
                return bool(obj)
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return super(NumpyEncoder, self).default(obj)
    
    # Save output
    with open(args.output, 'w') as f:
        json.dump(verification_output, f, indent=2, cls=NumpyEncoder)
    
    print(f"\n{'='*80}")
    print(f"VERIFICATION COMPLETE!")
    print(f"{'='*80}")
    print(f"\nOutput saved to: {args.output}")
    print(f"\n{'='*80}")
    print(f"OVERALL SUMMARY")
    print(f"{'='*80}")
    
    overall = verification_output['overall_summary']
    
    print(f"\nPortfolio:")
    print(f"  Total Stocks: {overall['portfolio_summary']['total_stocks']}")
    print(f"  Total Value: Rs.{overall['portfolio_summary']['total_value']:,.2f}")
    
    print(f"\nVerification Results:")
    print(f"  Beta: {overall['verification_results']['beta']['status']}")
    print(f"  Alpha: {overall['verification_results']['alpha']['status']}")
    print(f"  Ratios: {overall['verification_results']['ratios']['status']}")
    
    print(f"\nKey Metrics:")
    print(f"  Portfolio Beta (Daily): {overall['key_metrics']['daily_portfolio_beta']}")
    print(f"  Portfolio Alpha: {overall['key_metrics']['portfolio_alpha']}")
    print(f"  Sharpe Ratio: {overall['key_metrics']['portfolio_sharpe_ratio']}")
    print(f"  Sortino Ratio: {overall['key_metrics']['portfolio_sortino_ratio']}")
    
    print(f"\nData Quality:")
    print(f"  Completeness: {overall['data_quality']['data_completeness_percentage']}%")
    print(f"  Status: {overall['data_quality']['status']}")
    
    print(f"\nProduction Readiness:")
    print(f"  {overall['production_readiness']['recommendation']}")
    
    print(f"\n{'='*80}\n")


if __name__ == '__main__':
    main()
