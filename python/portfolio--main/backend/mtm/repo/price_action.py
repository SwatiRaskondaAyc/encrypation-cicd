import warnings
import pandas as pd
import datetime as dt
from datetime import datetime, timedelta
from sqlalchemy import desc, case, func, cast, String, literal, NVARCHAR
from sqlalchemy.orm import Session, aliased
from typing import Union, List, Dict

from mtm.orm.db_fundamentals.orm_models import Company_master
from mtm.orm.db_priceaction.orm_models import HistPA
from mtm.orm.engine import get_fundamental_db_session, get_price_db_session
from mtm.repo.query_executor import QueryExecutor

class PriceAction: 
    """
    Class that deal with extraction of information from the price action database
    """
    # ===============================
    #        Setup Methods 
    # ===============================    
    def __init__(self, symbols: Union[str, List[str]]=None, fundamental_session:Session=None, price_session:Session=None):
        """
        Internally manages sessions and loads only what's needed.

        Args:
            symbols (Union[str, List[str]]): A single stock symbol (str) or a list of stock symbols (List[str]).
        """
        self.symbols = []
        if symbols:
            self.symbols = (
                [symbols.upper()] if isinstance(symbols, str)
                else sorted(list(set(s.strip().upper() for s in symbols)))
            )
        self._fundamental_session = fundamental_session or next(get_fundamental_db_session())
        self._price_session = price_session or next(get_price_db_session())

        self._fincode_map: Dict[str, str] = {}
        self._available_fincodes: List[int] = []
        self._available_symbols: List[str] = []
        self._available_price_symbols: List[str] = [] 

        if self.symbols:
            self._resolve_discrepancies()

    def _resolve_discrepancies(self):
        """
        Internal method to map each symbol to its primary FINCODE based on SERIES priority
        and to determine which symbols have associated price action data.
        """
        # Define custom SERIES priority
        series_priority = case(
            (Company_master.SERIES == 'EQ', 1),
            (Company_master.SERIES == 'BE', 2),
            (Company_master.SERIES == 'BZ', 3),
            (Company_master.SERIES == 'BL', 4),
            (Company_master.SERIES == 'SM', 5),
            (Company_master.SERIES == 'ST', 6),
            (Company_master.SERIES == 'SZ', 7),
            else_=8
        )

        # Add row number over partition by SYMBOL
        row_number = func.row_number().over(
            partition_by=Company_master.SYMBOL,
            order_by=series_priority
        ).label("rn")

        # Subquery with row number
        ranked_subq = (
            self._fundamental_session.query(
                Company_master.SYMBOL,
                Company_master.FINCODE,
                Company_master.HistPA_Flag,
                Company_master.SERIES,
                row_number
            )
            .filter(Company_master.SERIES.in_(['EQ', 'BE', 'BZ', 'BL', 'SM', 'ST', 'SZ']))
            .filter(Company_master.SYMBOL.in_(self.symbols))
            .subquery()
        )

        # Outer query: filter only rn = 1 (top priority row per symbol)
        query = (
            self._fundamental_session.query(
                ranked_subq.c.SYMBOL,
                ranked_subq.c.FINCODE,
                ranked_subq.c.HistPA_Flag
            )
            .filter(ranked_subq.c.rn == 1)
        )

        executor = QueryExecutor(session=self._fundamental_session, mode="orm")
        result = executor.select(query, format="records")
                
        available_symbols = set()
        available_price_symbols = set()
        for equity in result:
            symbol = equity["SYMBOL"]
            self._fincode_map[symbol] = equity["FINCODE"]
            available_symbols.add(symbol)
            if equity["HistPA_Flag"] == 1:
                available_price_symbols.add(symbol)

        self._missing_fundamental = sorted(set(self.symbols) - available_symbols)
        self._missing_price_action = sorted(set(self.symbols) - available_price_symbols)

        self._available_fincodes = list(self._fincode_map.values())
        self._available_symbols = list(self._fincode_map.keys())
        self._available_price_symbols = sorted(list(available_price_symbols))

        if self._missing_fundamental:
            warnings.warn(f"Missing fundamental data for symbols: {self._missing_fundamental}")
        if self._missing_price_action:
            warnings.warn(f"Missing price action data for symbols: {self._missing_price_action}")

        self._fincode_resolved = True

    def close_sessions(self):
        """Close internal sessions if they were created by this instance."""
        # In a real app, be careful closing sessions injected from outside.
        # Here we assume we own them if we created them in __init__.
        # Ideally, use context managers or explicit close.
        pass 

    # ===============================
    #    Price Action Methods 
    # ===============================  

    def Get_Latest_Market_Date(self, format="records") -> dt.date:
        """
        Return the latest available market Date from the HistPA (EquityPA) table.
        """
        executor = QueryExecutor(session=self._price_session, mode="orm")
        query = self._price_session.query(HistPA.Date).order_by(desc(HistPA.Date)).limit(1)
        result = executor.select(query, format=format)
        if not result:
            return None
        # result is list of dicts like [{"Date": date(...)}]
        return result[0].get("Date") if result else None

    def Get_Latest_Price(self, symbols: Union[str, List[str]] = None) -> Union[Dict, List[Dict]]:
        """
        Return the most recent prices for the given symbol or list of symbols.
        """
        if symbols is None:
            symbols = self._available_price_symbols

        if isinstance(symbols, str):
            symbols_list = [symbols.strip().upper()]
            single_input = True
        else:
            symbols_list = [s.strip().upper() for s in symbols]
            single_input = False

        latest_date = self.Get_Latest_Market_Date(format='records')
        if latest_date is None:
            return None

        executor = QueryExecutor(session=self._price_session, mode="orm")
        query = (
            self._price_session.query(
                HistPA.Symbol.label("Symbol"),
                HistPA.LastPrice.label("LastPrice"),
                HistPA.Close.label("Close"),
                HistPA.Open.label("Open"),
                HistPA.High.label("High"),
                HistPA.Low.label("Low"),
                HistPA.Date.label("Date")
            )
            .filter(HistPA.Date == latest_date)
            .filter(HistPA.Symbol.in_(symbols_list))
        )

        records = executor.select(query, format="records") # Use 'records' for consistent list-of-dicts

        if single_input:
             return records[0] if records else {}
        return records

    # --- ADDED THIS METHOD TO FIX REPEATEDCALC ERROR ---
    def fetch_historical_data(self, symbols: List[str], start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Fetch historical OHLC data for a list of symbols within a date range.
        Returns a DataFrame with columns: ['Symbol', 'Date', 'Close', 'Open', 'High', 'Low']
        """
        if not symbols:
            return pd.DataFrame()
            
        # Ensure unique symbols and uppercase
        symbols = list(set(s.upper() for s in symbols))
        
        executor = QueryExecutor(session=self._price_session, mode="orm")
        
        query = (
            self._price_session.query(
                HistPA.Symbol.label("Symbol"),
                HistPA.Date.label("Date"),
                HistPA.Close.label("Close"),
                HistPA.Open.label("Open"),
                HistPA.High.label("High"),
                HistPA.Low.label("Low")
            )
            .filter(HistPA.Symbol.in_(symbols))
            .filter(HistPA.Date >= start_date)
            .filter(HistPA.Date <= end_date)
            .filter(HistPA.Series.in_(['EQ', 'BE']))  # Fix: Filter Series to prevent duplicates
            .order_by(HistPA.Date.asc())
        )
        
        results = executor.select(query, format="records")
        
        if not results:
            return pd.DataFrame(columns=['Symbol', 'Date', 'Close', 'Open', 'High', 'Low'])
            
        df = pd.DataFrame(results)
        # Ensure Date is datetime
        df['Date'] = pd.to_datetime(df['Date'])
        return df
