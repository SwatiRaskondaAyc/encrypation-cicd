import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Tuple, Literal
from datetime import datetime, timedelta

from metrics.repo import fetch_and_align_data
from mtm.orm.engine import get_price_db_session

logger = logging.getLogger(__name__)


class BetaCalculator:
    """
    Calculates beta for individual stocks and combined portfolio beta.
    Beta measures the volatility of a stock relative to the overall market (benchmark).
    Supports both daily and monthly beta calculations with full metadata.
    """
    
    def __init__(self, benchmark_symbol: str = "Nifty 50", lookback_days: int = 730):
        """
        Initialize the Beta Calculator.
        
        Args:
            benchmark_symbol: The benchmark index to compare against (default: "Nifty 50")
            lookback_days: Number of days to look back for beta calculation (default: 730 = ~2 years for monthly beta)
        """
        self.benchmark_symbol = benchmark_symbol
        self.lookback_days = lookback_days
    
    def calculate_beta_with_metadata(
        self, 
        symbol: str, 
        session=None,
        period: Literal['daily', 'monthly'] = 'daily'
    ) -> Dict:
        """
        Calculate beta for a single stock with full calculation metadata.
        
        Beta = Covariance(Stock Returns, Market Returns) / Variance(Market Returns)
        
        Args:
            symbol: Stock symbol
            session: Optional database session
            period: 'daily' or 'monthly' for return calculation frequency
            
        Returns:
            Dict containing beta value and calculation metadata
        """
        try:
            # Fetch aligned data
            df = fetch_and_align_data(
                symbol=symbol,
                benchmark_symbol=self.benchmark_symbol,
                lookback_days=self.lookback_days,
                session=session
            )
            
            if df.empty or len(df) < 20:
                logger.warning(f"Insufficient data for beta calculation: {symbol}")
                return self._empty_metadata(symbol, period, "Insufficient data")
            
            # Resample to monthly if needed - use last business day of month
            if period == 'monthly':
                try:
                    # Use 'ME' for month-end in newer pandas, 'M' for older
                    df_resampled = df.resample('ME').last()
                    
                    # Drop rows where we don't have data for both stock and market
                    df_resampled = df_resampled.dropna(subset=['Close_stock', 'Close_market'])
                    
                    logger.info(f"{symbol} monthly data: {len(df_resampled)} months from {df.index.min()} to {df.index.max()}")
                    
                    if len(df_resampled) < 12:  # Need at least 12 months
                        logger.warning(f"Insufficient monthly data for {symbol}: only {len(df_resampled)} months available")
                        return self._empty_metadata(symbol, period, f"Insufficient monthly data: only {len(df_resampled)} months")
                    
                    df = df_resampled
                except Exception as e:
                    logger.error(f"Error resampling to monthly for {symbol}: {e}")
                    return self._empty_metadata(symbol, period, f"Resampling error: {str(e)}")
            
            # Calculate returns
            stock_returns = df['Close_stock'].pct_change().dropna()
            market_returns = df['Close_market'].pct_change().dropna()
            
            # Align the returns
            valid_data = pd.DataFrame({
                'stock': stock_returns,
                'market': market_returns
            }).dropna()
            
            min_points = 12 if period == 'monthly' else 20
            if len(valid_data) < min_points:
                logger.warning(f"Insufficient valid returns for beta: {symbol}, got {len(valid_data)} points, need {min_points}")
                return self._empty_metadata(symbol, period, f"Less than {min_points} data points (got {len(valid_data)})")
            
            
            # Calculate beta components
            covariance = valid_data['stock'].cov(valid_data['market'])
            market_variance = valid_data['market'].var()
            
            if market_variance == 0:
                logger.warning(f"Market variance is zero for {symbol}")
                return self._empty_metadata(symbol, period, "Zero market variance")
            
            beta = covariance / market_variance
            
            # Calculate correlation for additional insight
            correlation = valid_data['stock'].corr(valid_data['market'])
            
            # DEBUG: Include all data points for manual verification
            stock_returns_list = valid_data['stock'].round(6).tolist()
            market_returns_list = valid_data['market'].round(6).tolist()
            dates_list = valid_data.index.strftime('%Y-%m-%d').tolist()
            
            return {
                'symbol': symbol,
                'beta': round(beta, 4),
                'period': period,
                'covariance': round(covariance, 8),
                'market_variance': round(market_variance, 8),
                'correlation': round(correlation, 4),
                'data_points': len(valid_data),
                'lookback_days': self.lookback_days,
                'start_date': df.index.min().strftime('%Y-%m-%d') if not df.empty else None,
                'end_date': df.index.max().strftime('%Y-%m-%d') if not df.empty else None,
                'benchmark': self.benchmark_symbol,
                'stock_volatility': round(valid_data['stock'].std() * np.sqrt(252 if period == 'daily' else 12), 4),
                'market_volatility': round(valid_data['market'].std() * np.sqrt(252 if period == 'daily' else 12), 4),
                # Detailed data for manual verification
                'debug_data': {
                    'dates': dates_list,
                    'stock_returns': stock_returns_list,
                    'market_returns': market_returns_list,
                    'mean_stock_return': round(valid_data['stock'].mean(), 8),
                    'mean_market_return': round(valid_data['market'].mean(), 8),
                    'stock_variance': round(valid_data['stock'].var(), 8)
                }
            }
            
        except Exception as e:
            logger.error(f"Error calculating beta for {symbol}: {e}")
            return self._empty_metadata(symbol, period, str(e))
    
    def _empty_metadata(self, symbol: str, period: str, reason: str) -> Dict:
        """Return empty metadata structure when calculation fails."""
        return {
            'symbol': symbol,
            'beta': None,
            'period': period,
            'covariance': None,
            'market_variance': None,
            'correlation': None,
            'data_points': 0,
            'lookback_days': self.lookback_days,
            'start_date': None,
            'end_date': None,
            'benchmark': self.benchmark_symbol,
            'stock_volatility': None,
            'market_volatility': None,
            'error': reason
        }
    
    def calculate_portfolio_beta(self, normalized_portfolio: Dict, benchmark_symbol: str = None, session=None) -> Dict:
        """
        Calculate beta for all current holdings and the combined portfolio beta.
        Calculates both daily and monthly betas with full metadata.
        
        Args:
            normalized_portfolio: The normalized portfolio JSON containing current_holdings
            benchmark_symbol: Optional benchmark override (default uses instance benchmark)
            session: Optional database session to reuse
            
        Returns:
            Dict containing:
                - daily_betas: Dict with individual and portfolio daily beta + metadata
                - monthly_betas: Dict with individual and portfolio monthly beta + metadata
                - benchmark: Benchmark used
        """
        if benchmark_symbol:
            self.benchmark_symbol = benchmark_symbol
        
        current_holdings = normalized_portfolio.get('current_holdings', [])
        
        if not current_holdings:
            logger.warning("No current holdings found in portfolio")
            return {
                'daily_betas': {
                    'individual': {},
                    'portfolio_beta': None,
                    'portfolio_metadata': {}
                },
                'monthly_betas': {
                    'individual': {},
                    'portfolio_beta': None,
                    'portfolio_metadata': {}
                },
                'benchmark': self.benchmark_symbol
            }
        
        # Get database session if not provided
        close_session = False
        if session is None:
            price_gen = get_price_db_session()
            session = next(price_gen)
            close_session = True
        
        try:
            # Calculate for both periods
            daily_results = self._calculate_for_period(current_holdings, session, 'daily')
            monthly_results = self._calculate_for_period(current_holdings, session, 'monthly')
            
            return {
                'daily_betas': daily_results,
                'monthly_betas': monthly_results,
                'benchmark': self.benchmark_symbol
            }
            
        except Exception as e:
            logger.error(f"Error calculating portfolio beta: {e}")
            return {
                'daily_betas': {
                    'individual': {},
                    'portfolio_beta': None,
                    'portfolio_metadata': {}
                },
                'monthly_betas': {
                    'individual': {},
                    'portfolio_beta': None,
                    'portfolio_metadata': {}
                },
                'benchmark': self.benchmark_symbol
            }
        finally:
            if close_session:
                session.close()
    
    def _calculate_for_period(self, current_holdings: List[Dict], session, period: str) -> Dict:
        """Calculate betas for a specific period (daily or monthly)."""
        individual_betas = {}
        total_value = 0
        weighted_beta_sum = 0
        valid_stocks = []
        
        # Calculate total portfolio value
        for holding in current_holdings:
            symbol = holding.get('symbol')
            quantity = holding.get('quantity', 0)
            current_price = holding.get('current_price', 0)
            
            if symbol and quantity > 0 and current_price > 0:
                holding_value = quantity * current_price
                total_value += holding_value
        
        # Calculate individual betas and weighted portfolio beta
        for holding in current_holdings:
            symbol = holding.get('symbol')
            quantity = holding.get('quantity', 0)
            current_price = holding.get('current_price', 0)
            
            if not symbol or quantity <= 0 or current_price <= 0:
                continue
            
            # Calculate beta with metadata for this stock
            beta_data = self.calculate_beta_with_metadata(symbol, session=session, period=period)
            individual_betas[symbol] = beta_data
            
            beta_value = beta_data.get('beta')
            if beta_value is not None:
                # Calculate weight and contribution to portfolio beta
                holding_value = quantity * current_price
                weight = holding_value / total_value if total_value > 0 else 0
                weighted_beta_sum += beta_value * weight
                valid_stocks.append({
                    'symbol': symbol,
                    'beta': beta_value,
                    'weight': weight
                })
        
        portfolio_beta = round(weighted_beta_sum, 4) if total_value > 0 else None
        
        # Calculate portfolio-level metadata
        portfolio_metadata = {
            'total_stocks': len(current_holdings),
            'stocks_with_beta': len(valid_stocks),
            'portfolio_value': round(total_value, 2),
            'period': period,
            'weighted_contributions': valid_stocks
        }
        
        return {
            'individual': individual_betas,
            'portfolio_beta': portfolio_beta,
            'portfolio_metadata': portfolio_metadata
        }
    
    def set_benchmark(self, benchmark_symbol: str):
        """
        Update the benchmark symbol.
        
        Args:
            benchmark_symbol: New benchmark index symbol
        """
        self.benchmark_symbol = benchmark_symbol
