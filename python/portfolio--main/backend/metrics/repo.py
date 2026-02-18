import pandas as pd
import numpy as np
from sqlalchemy import select, and_
import logging
from datetime import datetime, timedelta

# Import ORM
from mtm.orm.db_priceaction.orm_models import HistPA, IndexPA
from mtm.orm.db_fundamentals.orm_models import Resultsf_IND_Cons_Ex1, Finance_fr, Company_master, Finance_cons_pl
from mtm.orm.engine import get_price_db_session, get_fundamental_db_session
from File_Handler.utils.utils import fetch_price_history_bulk, fetch_benchmark_history, pivot_price_data

logger = logging.getLogger(__name__)

def fetch_and_align_data(symbol: str, benchmark_symbol: str, lookback_days: int = None, start_date=None, end_date=None, session=None) -> pd.DataFrame:
    """
    Helper to fetch and align stock and benchmark data.
    Returns DataFrame with columns: ['Close_stock', 'Close_market']
    """
    
    close_session = False
    if session is None:
        price_gen = get_price_db_session()
        session = next(price_gen)
        close_session = True
    
    try:
        if start_date is None:
            if lookback_days is None:
                lookback_days = 365
            start_date = datetime.now() - timedelta(days=lookback_days)

        sd = start_date.date() if hasattr(start_date, 'date') else start_date
        
        # 1. Fetch Benchmark Data
        stmt_bench = select(IndexPA.Date, IndexPA.Close).where(
            IndexPA.Index == benchmark_symbol,
            IndexPA.Date >= sd
        )
        if end_date:
            ed = end_date.date() if hasattr(end_date, 'date') else end_date
            stmt_bench = stmt_bench.where(IndexPA.Date <= ed)
        
        stmt_bench = stmt_bench.order_by(IndexPA.Date.asc())
        bench_results = session.execute(stmt_bench).all()
        
        if not bench_results:
            logger.warning(f"Insufficient data for benchmark {benchmark_symbol}")
            return pd.DataFrame()

        df_bench = pd.DataFrame(bench_results, columns=['Date', 'Close_market'])
        df_bench['Date'] = pd.to_datetime(df_bench['Date'])
        df_bench.set_index('Date', inplace=True)
        # Handle duplicates in benchmark
        if df_bench.index.duplicated().any():
            df_bench = df_bench[~df_bench.index.duplicated(keep='last')]

        # If symbol IS the benchmark (e.g. for factor beta helper usage), just return data
        if symbol == benchmark_symbol:
            # Caller might expect 'Close' or 'Close_market' depending on context. 
            # Legacy expected ['Close_stock', 'Close_market'] for self-comparison?
            df_bench['Close_stock'] = df_bench['Close_market']
            return df_bench

        # 2. Fetch Stock Data
        stmt_stock = select(HistPA.Date, HistPA.Close).where(
            HistPA.Symbol == symbol,
            HistPA.Date >= sd
        )
        if end_date:
            stmt_stock = stmt_stock.where(HistPA.Date <= ed)
            
        stmt_stock = stmt_stock.order_by(HistPA.Date.asc())
        stock_results = session.execute(stmt_stock).all()
        
        if not stock_results:
                logger.warning(f"Insufficient data for symbol {symbol}")
                return pd.DataFrame()
                
        df_stock = pd.DataFrame(stock_results, columns=['Date', 'Close_stock'])
        df_stock['Date'] = pd.to_datetime(df_stock['Date'])
        df_stock.set_index('Date', inplace=True)
        # Handle duplicates
        if df_stock.index.duplicated().any():
            df_stock = df_stock[~df_stock.index.duplicated(keep='last')]

        # 3. Align (Inner Join)
        combined = df_stock.join(df_bench, how='inner')
        return combined

    except Exception as e:
        logger.error(f"Error fetching aligned data ({symbol} vs {benchmark_symbol}): {e}")
        return pd.DataFrame()
    finally:
        if close_session:
            session.close()

def fetch_universe_data(price_session, fund_session, start_date, end_date):
    """
    Fetches Price, Shares, and Book Value data for the universe of stocks.
    Uses separate sessions for Price DB and Fundamental DB.
    Returns:
        pd.DataFrame, pd.DataFrame, pd.DataFrame: Prices, Shares, BookValues
    """
    # 1. Fetch Prices (HistPA) using Price Session
    # Filter by date range. 
    stmt_price = select(HistPA.Symbol, HistPA.Date, HistPA.Close).where(
        and_(HistPA.Date >= start_date.date(), HistPA.Date <= end_date.date())
    )
    price_data = price_session.execute(stmt_price).all()
    if not price_data:
        return pd.DataFrame(), pd.DataFrame(), pd.DataFrame()
    
    price_df = pd.DataFrame(price_data, columns=['Symbol', 'Date', 'Close'])
    price_df['Date'] = pd.to_datetime(price_df['Date'])

    # 2. Fetch Shares (Resultsf_IND_Cons_Ex1 -> nsGrandTotal) using Fundamental Session
    stmt_shares = select(
        Company_master.SYMBOL, 
        Resultsf_IND_Cons_Ex1.Date_End, 
        Resultsf_IND_Cons_Ex1.nsGrandTotal
    ).join(
        Resultsf_IND_Cons_Ex1, Company_master.FINCODE == Resultsf_IND_Cons_Ex1.Fincode
    ).where(Resultsf_IND_Cons_Ex1.nsGrandTotal.isnot(None))
    
    # Helper to parse int dates
    def parse_int_date(d):
        try:
            s = str(int(d))
            if len(s) == 8:
                return pd.to_datetime(s, format='%Y%m%d')
            elif len(s) == 6:
                return pd.to_datetime(s + '01', format='%Y%m%d') + pd.offsets.MonthEnd(0)
            return pd.NaT
        except:
            return pd.NaT

    shares_data = fund_session.execute(stmt_shares).all()
    shares_df = pd.DataFrame(shares_data, columns=['Symbol', 'Date_End', 'Shares'])
    if not shares_df.empty:
        shares_df['Date_End'] = shares_df['Date_End'].apply(parse_int_date)
    
    # 3. Fetch Book Value (Finance_fr -> Book_NAV_Share) using Fundamental Session
    stmt_bv = select(
        Company_master.SYMBOL,
        Finance_fr.Year_end,
        Finance_fr.Book_NAV_Share
    ).join(
        Finance_fr, Company_master.FINCODE == Finance_fr.FINCODE
    ).where(Finance_fr.Book_NAV_Share.isnot(None))
    
    bv_data = fund_session.execute(stmt_bv).all()
    bv_df = pd.DataFrame(bv_data, columns=['Symbol', 'Year_end', 'Book_NAV_Share'])
    if not bv_df.empty:
        bv_df['Year_end'] = bv_df['Year_end'].apply(parse_int_date)
    
    return price_df, shares_df, bv_df
