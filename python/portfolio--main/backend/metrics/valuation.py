import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from mtm.orm.engine import SessionFundamentals, SessionPriceAction
from mtm.orm.db_fundamentals.orm_models import (
    Company_master, Finance_fr, Finance_cons_bs, Resultsf_IND_Cons_Ex1, Shpsummary
)
from mtm.repo.query_executor import QueryExecutor

logger = logging.getLogger(__name__)

class ValuationCalculator:
    """
    Calculate portfolio-level valuation metrics including:
    - Weighted P/E Ratio
    - Weighted P/B Ratio
    - Weighted P/S Ratio
    - Weighted EPS
    - Weighted Dividend Yield
    
    Formula for Weighted P/E: ∑(wi * Pricei) / ∑(wi * EPSi)
    where wi is the market value weight of stock i
    """
    
    def __init__(self, lookback_days: int = 365):
        """
        Initialize the Valuation Calculator.
        
        Args:
            lookback_days: Number of days to look back for historical data
        """
        self.lookback_days = lookback_days
        
    def calculate_portfolio_valuation(self, normalized_portfolio: Dict, session=None) -> Dict:
        """
        Calculate comprehensive valuation metrics for the portfolio.
        
        Args:
            normalized_portfolio: Dict with 'current_holdings' list
            session: Optional database session
            
        Returns:
            Dict with portfolio metrics and individual stock data
        """
        current_holdings = normalized_portfolio.get('current_holdings', [])
        
        if not current_holdings:
            return self._empty_response("No holdings")
        
        close_session = False
        if session is None:
            fundamental_session = SessionFundamentals()
            close_session = True
        else:
            fundamental_session = session
            
        try:
            # Extract symbols and prepare weight calculations
            symbols = [h['symbol'] for h in current_holdings]
            holdings_map = {}
            total_value = 0
            
            for holding in current_holdings:
                sym = holding['symbol']
                qty = float(holding.get('quantity', 0))
                price = float(holding.get('current_price', 0))
                value = qty * price
                holdings_map[sym] = {
                    'quantity': qty,
                    'price': price,
                    'value': value
                }
                total_value += value
            
            # Calculate weights
            for sym in holdings_map:
                holdings_map[sym]['weight'] = holdings_map[sym]['value'] / total_value if total_value > 0 else 0
            
            logger.info(f"Calculating valuation metrics for {len(symbols)} symbols with total value: {total_value}")
            
            # Fetch fundamental data
            fundamental_data = self._fetch_fundamental_data(symbols, fundamental_session)
            
            if fundamental_data.empty:
                logger.warning("No fundamental data found for portfolio symbols")
                return self._empty_response("No fundamental data available")
            
            # Calculate individual stock metrics
            individual_metrics = {}
            portfolio_aggregates = {
                'weighted_price_sum': 0,
                'weighted_eps_sum': 0,
                'weighted_book_value_sum': 0,
                'weighted_sales_per_share_sum': 0,
                'weighted_dividend_yield_sum': 0,
                'total_weight': 0
            }
            
            debug_data = {
                'symbols': [],
                'weights': [],
                'prices': [],
                'eps_values': [],
                'book_values': [],
                'sales_per_share': [],
                'dps_values': [],
                'dividend_yields': [],
                'pe_ratios': [],
                'pb_ratios': [],
                'ps_ratios': []
            }
            
            for _, row in fundamental_data.iterrows():
                sym = row['Symbol']
                if sym not in holdings_map:
                    continue
                    
                holding_info = holdings_map[sym]
                weight = holding_info['weight']
                price = holding_info['price']
                
                # Extract fundamental values
                eps = float(row.get('EPS', 0)) if pd.notna(row.get('EPS')) else 0
                book_value = float(row.get('BookValue', 0)) if pd.notna(row.get('BookValue')) else 0
                dps = float(row.get('DPS', 0)) if pd.notna(row.get('DPS')) else 0
                sales_per_share = float(row.get('SalesPerShare', 0)) if pd.notna(row.get('SalesPerShare')) else 0
                quarter = str(row.get('Year_end', ''))  # Get quarter info
                
                # Calculate individual ratios
                pe = price / eps if eps > 0 else None
                pb = price / book_value if book_value > 0 else None
                ps = price / sales_per_share if sales_per_share > 0 else None
                div_yield = (dps / price) if price > 0 else 0
                
                # Store individual metrics
                individual_metrics[sym] = {
                    'pe': round(pe, 2) if pe else None,
                    'pb': round(pb, 2) if pb else None,
                    'ps': round(ps, 2) if ps else None,
                    'eps': round(eps, 2),
                    'book_value': round(book_value, 2),
                    'sales_per_share': round(sales_per_share, 2),
                    'dps': round(dps, 2),
                    'dividend_yield': round(div_yield * 100, 2),  # as percentage
                    'weight': round(weight * 100, 2), # Show as percentage for UI
                    'price': round(price, 2),
                    'quarter': quarter,
                    'contribution': round(weight * total_value, 2)
                }
                
                # Aggregate for portfolio metrics
                portfolio_aggregates['weighted_price_sum'] += weight * price
                portfolio_aggregates['weighted_eps_sum'] += weight * eps
                portfolio_aggregates['weighted_book_value_sum'] += weight * book_value
                portfolio_aggregates['weighted_sales_per_share_sum'] += weight * sales_per_share
                portfolio_aggregates['weighted_dividend_yield_sum'] += weight * div_yield
                portfolio_aggregates['total_weight'] += weight
                
                # Debug data
                debug_data['symbols'].append(sym)
                debug_data['weights'].append(round(weight, 4))
                debug_data['prices'].append(round(price, 2))
                debug_data['eps_values'].append(round(eps, 2))
                debug_data['book_values'].append(round(book_value, 2))
                debug_data['sales_per_share'].append(round(sales_per_share, 2))
                debug_data['dps_values'].append(round(dps, 2))
                debug_data['dividend_yields'].append(round(div_yield * 100, 2))
                debug_data['pe_ratios'].append(round(pe, 2) if pe else None)
                debug_data['pb_ratios'].append(round(pb, 2) if pb else None)
                debug_data['ps_ratios'].append(round(ps, 2) if ps else None)
            
            # Calculate portfolio-level metrics
            portfolio_pe = (portfolio_aggregates['weighted_price_sum'] / 
                          portfolio_aggregates['weighted_eps_sum']) if portfolio_aggregates['weighted_eps_sum'] > 0 else None
            
            portfolio_pb = (portfolio_aggregates['weighted_price_sum'] / 
                          portfolio_aggregates['weighted_book_value_sum']) if portfolio_aggregates['weighted_book_value_sum'] > 0 else None
            
            portfolio_ps = (portfolio_aggregates['weighted_price_sum'] / 
                          portfolio_aggregates['weighted_sales_per_share_sum']) if portfolio_aggregates['weighted_sales_per_share_sum'] > 0 else None
            
            portfolio_eps = portfolio_aggregates['weighted_eps_sum']
            portfolio_div_yield = portfolio_aggregates['weighted_dividend_yield_sum'] * 100  # as percentage
            
            return {
                'portfolio_metrics': {
                    'pe': round(portfolio_pe, 2) if portfolio_pe else None,
                    'pb': round(portfolio_pb, 2) if portfolio_pb else None,
                    'ps': round(portfolio_ps, 2) if portfolio_ps else None,
                    'eps': round(portfolio_eps, 2),
                    'dividend_yield': round(portfolio_div_yield, 2),
                    'total_value': round(total_value, 2)
                },
                'individual_metrics': individual_metrics,
                'debug_data': debug_data,
                'calculation_details': {
                    'formula_pe': 'Σ(weight * price) / Σ(weight * EPS)',
                    'weighted_price_sum': round(portfolio_aggregates['weighted_price_sum'], 2),
                    'weighted_eps_sum': round(portfolio_aggregates['weighted_eps_sum'], 2),
                    'weighted_book_value_sum': round(portfolio_aggregates['weighted_book_value_sum'], 2),
                    'weighted_sales_per_share_sum': round(portfolio_aggregates['weighted_sales_per_share_sum'], 2),
                    'total_weight': round(portfolio_aggregates['total_weight'], 4)
                }
            }
            
        except Exception as e:
            logger.error(f"Error calculating valuation metrics: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return self._empty_response(str(e))
        finally:
            if close_session:
                fundamental_session.close()
    
    def _fetch_fundamental_data(self, symbols: List[str], session: Session) -> pd.DataFrame:
        """
        Fetch fundamental data for given symbols.
        
        Returns DataFrame with columns: Symbol, EPS, BookValue, DPS, SalesPerShare
        """
        try:
            executor = QueryExecutor(session=session, mode="orm")
            
            # Get FINCODEs for symbols
            logger.info(f"[VALUATION DEBUG] Fetching FINCODEs for {len(symbols)} symbols: {symbols}")
            fincode_query = (
                session.query(
                    Company_master.SYMBOL,
                    Company_master.FINCODE
                )
                .filter(Company_master.SYMBOL.in_(symbols))
            )
            
            fincode_df = executor.select(fincode_query, format="df")
            logger.info(f"[VALUATION DEBUG] Found {len(fincode_df)} FINCODEs: {fincode_df['SYMBOL'].tolist() if not fincode_df.empty else 'NONE'}")
            if fincode_df.empty:
                logger.warning(f"No FINCODEs found for symbols: {symbols}")
                return pd.DataFrame()
            
            fincodes = fincode_df['FINCODE'].tolist()
            
            # Get latest year_end for filtering
            target_years = ['202412', '202406', '202403', '202503', '202506', '202509']
            
            # Fetch fundamental data from Finance_fr (EPS, Book Value, DPS)
            fundamental_query = (
                session.query(
                    Company_master.SYMBOL.label('Symbol'),
                    Finance_fr.Reported_EPS.label('EPS'),
                    Finance_fr.Book_NAV_Share.label('BookValue'),
                    Finance_fr.DPS,
                    Finance_fr.Year_end,
                    Finance_cons_bs.EQUITY_PAIDUP,
                    Company_master.FV
                )
                .outerjoin(Finance_fr, Company_master.FINCODE == Finance_fr.FINCODE)
                .outerjoin(
                    Finance_cons_bs,
                    (Company_master.FINCODE == Finance_cons_bs.Fincode) &
                    (Finance_fr.Year_end == Finance_cons_bs.Year_end)
                )
                .filter(Company_master.FINCODE.in_(fincodes))
                .filter(
                    (Finance_fr.Year_end.in_(target_years)) | (Finance_fr.Year_end.is_(None))
                )
            )
            
            fundamental_df = executor.select(fundamental_query, format="df")
            logger.info(f"[VALUATION DEBUG] Fundamental query returned {len(fundamental_df)} rows for symbols: {fundamental_df['Symbol'].unique().tolist() if not fundamental_df.empty else 'NONE'}")
            
            if fundamental_df.empty:
                return pd.DataFrame()
            
            # Get latest year_end per symbol
            fundamental_df = (
                fundamental_df.sort_values('Year_end', ascending=False)
                .groupby('Symbol')
                .first()
                .reset_index()
            )
            
            
            # Fetch shares outstanding
            shares_query = (
                session.query(
                    Company_master.SYMBOL.label('Symbol'),
                    Shpsummary.nsGrandTotal.label('SharesOutstanding'),
                    Shpsummary.DATE_END
                )
                .join(Shpsummary, Company_master.FINCODE == Shpsummary.FINCODE)
                .filter(Company_master.FINCODE.in_(fincodes))
                .filter(Shpsummary.DATE_END.in_(target_years))
            )
            
            shares_df = executor.select(shares_query, format="df")
            
            if not shares_df.empty:
                # Get latest shares data per symbol
                shares_df = (
                    shares_df.sort_values('DATE_END', ascending=False)
                    .groupby('Symbol')
                    .first()
                    .reset_index()
                )
                fundamental_df = fundamental_df.merge(shares_df[['Symbol', 'SharesOutstanding']], on='Symbol', how='left')
            else:
                fundamental_df['SharesOutstanding'] = None
            
            # Fallback: Calculate shares from EQUITY_PAIDUP / FV
            fundamental_df['SharesOutstanding'] = np.where(
                fundamental_df['SharesOutstanding'].isna() & 
                fundamental_df['EQUITY_PAIDUP'].notna() & 
                fundamental_df['FV'].notna() & 
                (fundamental_df['FV'] > 0),
                fundamental_df['EQUITY_PAIDUP'] / fundamental_df['FV'],
                fundamental_df['SharesOutstanding']
            )
            
            # Fetch sales data for P/S ratio
            sales_query = (
                session.query(
                    Company_master.SYMBOL.label('Symbol'),
                    Resultsf_IND_Cons_Ex1.Net_Sales,
                    Resultsf_IND_Cons_Ex1.Date_End
                )
                .join(Resultsf_IND_Cons_Ex1, Company_master.FINCODE == Resultsf_IND_Cons_Ex1.Fincode)
                .filter(Company_master.FINCODE.in_(fincodes))
                .filter(Resultsf_IND_Cons_Ex1.Date_End.in_(target_years))
                .filter(Resultsf_IND_Cons_Ex1.Result_Type == 'A')  # Annual results
            )
            
            sales_df = executor.select(sales_query, format="df")
            
            if not sales_df.empty:
                # Get latest sales data per symbol
                sales_df = (
                    sales_df.sort_values('Date_End', ascending=False)
                    .groupby('Symbol')
                    .first()
                    .reset_index()
                )
                fundamental_df = fundamental_df.merge(sales_df[['Symbol', 'Net_Sales']], on='Symbol', how='left')
            else:
                fundamental_df['Net_Sales'] = None
            
            # Calculate Sales per Share
            fundamental_df['SalesPerShare'] = np.where(
                fundamental_df['Net_Sales'].notna() & 
                fundamental_df['SharesOutstanding'].notna() &
                (fundamental_df['SharesOutstanding'] > 0),
                fundamental_df['Net_Sales'] / fundamental_df['SharesOutstanding'],
                None
            )
            
            # Return required columns including Year_end for quarter display
            return fundamental_df[['Symbol', 'EPS', 'BookValue', 'DPS', 'SalesPerShare', 'Year_end']]
            
        except Exception as e:
            logger.error(f"Error fetching fundamental data: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return pd.DataFrame()

    
    def calculate_dividend_income(self, transactions_df: pd.DataFrame, current_holdings_snapshot: pd.DataFrame) -> Dict:
        """
        Calculate total dividends earned based on holding periods.
        Matches dividend declarations with actual holding periods for each stock.
        
        Args:
            transactions_df: DataFrame with transaction history
            current_holdings_snapshot: DataFrame with current holdings
            
        Returns:
            Dict with total dividends, breakdown by stock, and by quarter
        """
        try:
            fundamental_session = SessionFundamentals()
            executor = QueryExecutor(session=fundamental_session, mode="orm")
            
            # Get all symbols (both current and exited)
            all_symbols = set(transactions_df['Symbol'].unique().tolist() if 'Symbol' in transactions_df.columns 
                            else transactions_df['Scrip_Name'].unique().tolist())
            
            if not all_symbols:
                return {'total_dividend_earned': 0, 'by_stock': {}, 'by_quarter': {}}
            
            # Get FINCODEs
            fincode_query = (
                fundamental_session.query(
                    Company_master.SYMBOL,
                    Company_master.FINCODE
                )
                .filter(Company_master.SYMBOL.in_(list(all_symbols)))
            )
            fincode_df = executor.select(fincode_query, format="df")
            
            if fincode_df.empty:
                return {'total_dividend_earned': 0, 'by_stock': {}, 'by_quarter': {}}
            
            fincodes = fincode_df['FINCODE'].tolist()
            symbol_to_fincode = dict(zip(fincode_df['SYMBOL'], fincode_df['FINCODE']))
            
            # Fetch all dividend declarations (DPS > 0)
            # Year_end represents the quarter of dividend declaration
            dividend_query = (
                fundamental_session.query(
                    Company_master.SYMBOL,
                    Finance_fr.DPS,
                    Finance_fr.Year_end.label('Quarter')
                )
                .join(Finance_fr, Company_master.FINCODE == Finance_fr.FINCODE)
                .filter(Company_master.FINCODE.in_(fincodes))
                .filter(Finance_fr.DPS > 0)
            )
            
            dividend_df = executor.select(dividend_query, format="df")
            fundamental_session.close()
            
            if dividend_df.empty:
                return {'total_dividend_earned': 0, 'by_stock': {}, 'by_quarter': {}}
            
            # Convert Quarter to datetime for matching
            # Quarter format: YYYYMM -> convert to date
            dividend_df['DividendDate'] = pd.to_datetime(dividend_df['Quarter'], format='%Y%m', errors='coerce')
            dividend_df = dividend_df.dropna(subset=['DividendDate'])
            
            # Build holding periods from transactions
            # Group by symbol and calculate buy/sell timeline
            symbol_col = 'Symbol' if 'Symbol' in transactions_df.columns else 'Scrip_Name'
            transactions_df['Trade_Date'] = pd.to_datetime(transactions_df['Trade_Date'])
            
            holding_periods = {}  # {symbol: [(start_date, end_date, qty), ...]}
            
            from collections import defaultdict, deque
            
            for symbol in all_symbols:
                symbol_txns = transactions_df[transactions_df[symbol_col] == symbol].sort_values('Trade_Date')
                holdings = deque()  # FIFO queue
                periods = []
                
                for _, txn in symbol_txns.iterrows():
                    qty = float(txn['Qty'])
                    date = txn['Trade_Date']
                    side = txn['Order_Type']
                    
                    if side == 'B':
                        holdings.append({'qty': qty, 'buy_date': date})
                    else:  # Sell
                        qty_to_sell = qty
                        while qty_to_sell > 0 and holdings:
                            lot = holdings[0]
                            if lot['qty'] <= qty_to_sell:
                                # Fully sold this lot
                                periods.append({
                                    'start_date': lot['buy_date'],
                                    'end_date': date,
                                    'qty': lot['qty']
                                })
                                qty_to_sell -= lot['qty']
                                holdings.popleft()
                            else:
                                # Partial sell
                                periods.append({
                                    'start_date': lot['buy_date'],
                                    'end_date': date,
                                    'qty': qty_to_sell
                                })
                                lot['qty'] -= qty_to_sell
                                qty_to_sell = 0
                
                # Add remaining holdings (still open)
                for lot in holdings:
                    periods.append({
                        'start_date': lot['buy_date'],
                        'end_date': pd.Timestamp.now(),  # Still holding
                        'qty': lot['qty']
                    })
                
                holding_periods[symbol] = periods
            
            # Calculate dividends
            total_dividend_earned = 0
            by_stock = {}
            by_quarter = defaultdict(float)
            
            debug_data = {
                'dividend_events': [],
                'holding_period_matches': []
            }
            
            for _, div_row in dividend_df.iterrows():
                symbol = div_row['Symbol']
                dps = float(div_row['DPS'])
                div_date = div_row['DividendDate']
                quarter = div_row['Quarter']
                
                if symbol not in holding_periods:
                    continue
                
                # Find holdings active during this dividend date
                shares_held = 0
                for period in holding_periods[symbol]:
                    if period['start_date'] <= div_date <= period['end_date']:
                        shares_held += period['qty']
                
                if shares_held > 0:
                    dividend_amount = shares_held * dps
                    total_dividend_earned += dividend_amount
                    
                    if symbol not in by_stock:
                        by_stock[symbol] = {
                            'total': 0,
                            'quarters': {}
                        }
                    
                    by_stock[symbol]['total'] += dividend_amount
                    by_stock[symbol]['quarters'][quarter] = {
                        'dps': dps,
                        'shares_held': shares_held,
                        'amount': dividend_amount
                    }
                    
                    by_quarter[quarter] += dividend_amount
                    
                    debug_data['dividend_events'].append({
                        'symbol': symbol,
                        'quarter': quarter,
                        'dps': dps,
                        'shares_held': shares_held,
                        'amount': dividend_amount
                    })
            
            # Round values
            total_dividend_earned = round(total_dividend_earned, 2)
            for stock in by_stock:
                by_stock[stock]['total'] = round(by_stock[stock]['total'], 2)
                for q in by_stock[stock]['quarters']:
                    by_stock[stock]['quarters'][q]['amount'] = round(by_stock[stock]['quarters'][q]['amount'], 2)
            
            by_quarter_formatted = {k: round(v, 2) for k, v in by_quarter.items()}
            
            return {
                'total_dividend_earned': total_dividend_earned,
                'by_stock': by_stock,
                'by_quarter': by_quarter_formatted,
                'debug_data': debug_data
            }
            
        except Exception as e:
            logger.error(f"Error calculating dividend income: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {
                'total_dividend_earned': 0,
                'by_stock': {},
                'by_quarter': {},
                'error': str(e)
            }
    
    def _empty_response(self, error: str):
        return {
            'portfolio_metrics': {
                'pe': None,
                'pb': None,
                'ps': None,
                'eps': None,
                'dividend_yield': None,
                'total_value': None
            },
            'individual_metrics': {},
            'error': error
        }


