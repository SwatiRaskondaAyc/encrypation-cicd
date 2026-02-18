import pandas as pd
import numpy as np
import logging
from typing import Dict, Optional, Literal
from metrics.repo import fetch_and_align_data

logger = logging.getLogger(__name__)

class AlphaCalculator:
    """
    Calculates Jensen's Alpha for stocks and portfolio.
    Alpha = Actual Return - Expected Return
    Expected Return = Risk-Free Rate + Beta * (Market Return - Risk-Free Rate)
    """

    def __init__(self, benchmark_symbol: str = "Nifty 50", risk_free_rate: float = 0.0662):
        """
        Args:
            benchmark_symbol: Benchmark to compare against (default "Nifty 50").
            risk_free_rate: Annual Risk-Free Rate (default 6.62%).
        """
        self.benchmark_symbol = benchmark_symbol
        self.risk_free_rate = risk_free_rate
        self.lookback_days = 365 # 1 Year Alpha by default

    def calculate_alpha(self, symbol: str, beta: float, session = None) -> Dict:
        """
        Calculate Alpha for a single stock given its Beta.
        
        Args:
            symbol: Stock symbol.
            beta: The beta of the stock (pre-calculated).
            session: Database session.
            
        Returns:
            Dict containing:
                - alpha: Jensen's Alpha value.
                - expected_return: CAPM Expected Return.
                - actual_return: Actual return of the stock over the period.
                - benchmark_return: Return of the benchmark over the period.
                - risk_free_rate: Rf used.
        """
        if beta is None or pd.isna(beta):
            return self._empty_result("Invalid Beta")
            
        try:
            # Fetch aligned data for 1 year
            df = fetch_and_align_data(
                symbol=symbol,
                benchmark_symbol=self.benchmark_symbol,
                lookback_days=self.lookback_days,
                session=session
            )
            
            if df.empty or len(df) < 200: # Ensure enough data for 1 year return validity
                logger.warning(f"Insufficient data for Alpha calculation: {symbol}")
                return self._empty_result("Insufficient Data")

            # Calculate Returns
            # We use Simple Return over the period: (End / Start) - 1
            start_price_stock = df['Close_stock'].iloc[0]
            end_price_stock = df['Close_stock'].iloc[-1]
            actual_return = (end_price_stock - start_price_stock) / start_price_stock
            
            start_price_market = df['Close_market'].iloc[0]
            end_price_market = df['Close_market'].iloc[-1]
            benchmark_return = (end_price_market - start_price_market) / start_price_market
            
            # Annualize Rf? Rf is already annual (0.0662).
            # If our period is exactly 1 year, we use Rf directly.
            # If period is significantly different (e.g. recent IPO), we should de-annualize Rf.
            # For simplicity and standardization, we assume the period is approx 1 year.
            # If data is < 1 year (e.g. 200 days), we should scale Rf.
            
            days = (df.index[-1] - df.index[0]).days
            if days < 350:
                # Scale Rf: (1 + Rf)^(days/365) - 1
                period_rf = (1 + self.risk_free_rate)**(days/365) - 1
            else:
                period_rf = self.risk_free_rate

            # CAPM Expected Return
            expected_return = period_rf + beta * (benchmark_return - period_rf)
            
            # Alpha
            alpha = actual_return - expected_return
            
            return {
                "alpha": round(alpha, 4),
                "expected_return": round(expected_return, 4),
                "actual_return": round(actual_return, 4),
                "benchmark_return": round(benchmark_return, 4),
                "risk_free_rate": round(period_rf, 4),
                "beta_used": round(beta, 4),
                "error": None
            }

        except Exception as e:
            logger.error(f"Error calculating alpha for {symbol}: {e}")
            return self._empty_result(str(e))

    def _empty_result(self, reason: str) -> Dict:
        return {
            "alpha": None,
            "expected_return": None,
            "actual_return": None,
            "benchmark_return": None,
            "risk_free_rate": None,
            "error": reason
        }
