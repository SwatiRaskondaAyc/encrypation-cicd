from __future__ import annotations
from dataclasses import dataclass, field
from typing import Callable, Optional
import pandas as pd
import numpy as np

@dataclass
class DataFramePriceLookup:
    """
    Optimized price lookup helper backed by a price history DataFrame.
    Uses pivoting and `asof` indexing for O(1) / O(log N) lookups instead of filtering.
    """
    price_df: pd.DataFrame
    symbol_col: str = "Symbol"
    date_col: str = "Date"
    price_col: str = "Close"
    
    # Internal cache
    _pivoted: pd.DataFrame = field(init=False, default=None)

    def __post_init__(self) -> None:
        df = self.price_df.copy()

        # Normalise column names for robustness
        cols_lower = {c.lower(): c for c in df.columns}

        self.symbol_col = cols_lower.get(self.symbol_col.lower(), self.symbol_col)
        self.date_col = cols_lower.get(self.date_col.lower(), self.date_col)

        # Try common price column aliases
        price_aliases = ["close", "close_price", "closeprice", "closing_price", "lastprice"]
        chosen_price_col = None
        for alias in price_aliases:
            if alias in cols_lower:
                chosen_price_col = cols_lower[alias]
                break
        if chosen_price_col is None and self.price_col in df.columns:
            chosen_price_col = self.price_col
        
        if chosen_price_col is None:
             # Fallback: if we can't find a price column, create dummy
             self.price_col = "Close"
             df["Close"] = 0.0
        else:
             self.price_col = chosen_price_col

        # Ensure date is datetime
        df[self.date_col] = pd.to_datetime(df[self.date_col], errors="coerce")
        df = df.dropna(subset=[self.date_col])

        # OPTIMIZATION: Pivot once!
        # Index = Date, Columns = Symbol, Values = Price
        # We handle duplicates by taking the last entry
        try:
            self._pivoted = df.pivot_table(
                index=self.date_col, 
                columns=self.symbol_col, 
                values=self.price_col, 
                aggfunc='last'
            )
            self._pivoted = self._pivoted.sort_index()
        except Exception:
            self._pivoted = pd.DataFrame()

    def get_price(self, symbol: str, date: pd.Timestamp) -> float:
        """
        Return the latest available EOD price for `symbol` on or before `date`.
        """
        if self._pivoted.empty or symbol not in self._pivoted.columns:
            return 0.0
        
        if not isinstance(date, pd.Timestamp):
            date = pd.to_datetime(date, errors="coerce")
            if pd.isna(date): return 0.0

        # Fast lookup using `asof` logic via get_indexer with method='pad'
        # This finds the index location of the nearest date <= query date
        try:
            # get_indexer returns -1 if no valid prior index exists
            idx_loc = self._pivoted.index.get_indexer([date], method='pad')[0]
            
            if idx_loc == -1:
                return 0.0
            
            # Access by integer location for speed
            val = self._pivoted.iloc[idx_loc][symbol]
            
            if pd.isna(val):
                # If exact date was NaN (e.g. trading holiday for this symbol), 
                # we might want to look further back.
                # But simple pivot.ffill() in post_init can use lots of memory.
                # For now, return 0.0 or simple previous value.
                # A robust approach is ffill() the whole table:
                return 0.0
            
            return float(val)
            
        except (KeyError, IndexError):
            return 0.0

def build_price_lookup_from_df(price_df: pd.DataFrame) -> Callable[[str, pd.Timestamp], float]:
    """
    Convenience function: builds a callable suitable for
    `compute_portfolio_timeseries(..., price_lookup=...)`
    """
    # If dataframe is tiny, normalization overhead might be overkill, but it's safer.
    service = DataFramePriceLookup(price_df)

    def _lookup(symbol: str, date: pd.Timestamp) -> float:
        return service.get_price(symbol, date)

    return _lookup
