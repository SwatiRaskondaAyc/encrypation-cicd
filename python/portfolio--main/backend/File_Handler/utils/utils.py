import pandas as pd
import numpy as np
from babel.numbers import format_currency, format_decimal
from sqlalchemy import select, and_
from mtm.orm.db_priceaction.orm_models import HistPA, IndexPA
from datetime import datetime

_INR_LOCALE = "en_IN"

def fetch_price_history_bulk(symbols: list, start_date=None, end_date=None, session=None) -> pd.DataFrame:
    """
    Fetches price history for a list of symbols in a single query.
    Returns a DataFrame with columns: ['Date', 'Symbol', 'Close', 'Open', 'High', 'Low', 'Volume']
    """
    if not symbols or session is None:
        return pd.DataFrame()
    
    try:
        stmt = select(HistPA).where(HistPA.Symbol.in_(symbols))
        
        if start_date:
            stmt = stmt.where(HistPA.Date >= start_date)
        if end_date:
            stmt = stmt.where(HistPA.Date <= end_date)
            
        # Order by Date ASC
        stmt = stmt.order_by(HistPA.Date.asc())
        
        results = session.execute(stmt).scalars().all()
        
        if not results:
            return pd.DataFrame()
            
        data = []
        for r in results:
            data.append({
                'Date': r.Date,
                'Symbol': r.Symbol,
                'Close': float(r.Close),
                'Open': float(r.Open) if r.Open else None,
                'High': float(r.High) if r.High else None,
                'Low': float(r.Low) if r.Low else None
            })
            
        df = pd.DataFrame(data)
        if not df.empty:
            df['Date'] = pd.to_datetime(df['Date'])
            
        return df
        
    except Exception as e:
        print(f"Error fetching bulk prices: {e}")
        return pd.DataFrame()

def fetch_benchmark_history(symbol: str, start_date=None, end_date=None, session=None) -> pd.DataFrame:
    """
    Fetches benchmark history from IndexPA.
    """
    if not session:
        return pd.DataFrame()
        
    try:
        # Map generic 'Nifty 50' to whatever is in DB if needed, or assume exact match
        # checking IndexPA table
        stmt = select(IndexPA).where(IndexPA.Index == symbol)
        
        if start_date:
            stmt = stmt.where(IndexPA.Date >= start_date)
        if end_date:
            stmt = stmt.where(IndexPA.Date <= end_date)
            
        stmt = stmt.order_by(IndexPA.Date.asc())
        
        results = session.execute(stmt).scalars().all()
        
        if not results:
            return pd.DataFrame()
            
        data = [{
            'Date': r.Date,
            'Symbol': r.Index,
            'Close': float(r.Close)
        } for r in results]
        
        df = pd.DataFrame(data)
        if not df.empty:
            df['Date'] = pd.to_datetime(df['Date'])
            
        return df
        
    except Exception as e:
        print(f"Error fetching benchmark: {e}")
        return pd.DataFrame()

def pivot_price_data(df_bulk: pd.DataFrame, symbols: list = None, value_col='Close') -> pd.DataFrame:
    """
    Pivots a long-format DataFrame (Date, Symbol, Value) into a wide format (Index=Date, Cols=Symbols).
    Handles duplicates and forward fills missing data.
    """
    if df_bulk.empty:
        return pd.DataFrame()
        
    # Drop duplicates if any (same symbol same date) - take last
    df_clean = df_bulk.drop_duplicates(subset=['Date', 'Symbol'], keep='last')
    
    pivot_df = df_clean.pivot(index='Date', columns='Symbol', values=value_col)
    
    # Ensure all requested symbols are present (even if all NaNs)
    if symbols:
        for sym in symbols:
            if sym not in pivot_df.columns:
                pivot_df[sym] = np.nan
                
    # Sort index
    pivot_df.sort_index(inplace=True)
    
    # Forward fill to handle missing days (holidays/data gaps)
    pivot_df.ffill(inplace=True)
    
    return pivot_df


_INR_LOCALE = "en_IN"

def format_inr_currency(value: float) -> str:
    """Format a number as INR currency, fallback to raw value on error."""
    try:
        return format_currency(value, "INR", locale=_INR_LOCALE)
    except Exception:
        return str(value)

def format_inr_number(value: float) -> str:
    """Format a plain number in Indian number format (no ₹)."""
    try:
        return format_decimal(value, locale=_INR_LOCALE)
    except Exception:
        return str(value)

def clean_numeric_columns(df: pd.DataFrame, cols: list) -> pd.DataFrame:
    """
    Ensure that every value in `cols` is numeric (float) or NaN.
    Handles 'nan', 'null', '-', empty strings, etc.
    """
    if not cols or df.empty:
        return df
        
    df = df.copy()
    null_tokens = {"", "none", "nan", "null", "na", "-", "--"}
    
    for col in cols:
        if col not in df.columns:
            continue
        
        # Convert to string first to handle mixed types safely
        s = df[col].astype(str).str.strip()
        
        # Mask obvious nulls
        s = s.where(~s.str.lower().isin(null_tokens), other=pd.NA)
        
        # Remove everything except digits, dots, and minus signs
        s = s.str.replace(r"[^\d\.\-]", "", regex=True)
        
        # Replace empty strings resulting from regex with NaN
        s = s.replace("", pd.NA)
        
        # Convert to numeric
        df[col] = pd.to_numeric(s, errors="coerce")
        
    return df

def normalise_portfolio_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Bring old column names to a consistent schema.
    """
    rename_map = {
        "Deployed_Amount": "Deployed Amount",
        "Brokerage_Amount": "Brokerage Amount",
        "Realized_PNL": "Realized PNL",
        "Unrealized_PNL": "Unrealized PNL",
        "Remaining_Qty": "Remaining Qty",
        "Market_Value": "Market Value",
        "Unrealized_%_Return": "Unrealized % Return",
    }
    df = df.copy()
    df.rename(columns=rename_map, inplace=True)
    
    # Normalise Date column
    if "Date" in df.columns:
        if pd.api.types.is_integer_dtype(df["Date"]) or str(df["Date"].dtype).startswith("int"):
            df["Date"] = pd.to_datetime(df["Date"], unit="ms", errors="coerce")
        else:
            df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
            
    return df
