import hashlib
import pandas as pd
from typing import List

def generate_universal_trade_id(df: pd.DataFrame, cols: List[str]) -> pd.Series:
    """
    Generates a SHA256 hash from specified columns.
    Returns a Series of hash strings.
    """
    if df.empty:
        return pd.Series(dtype=str)
        
    def get_hash(row):
        # Concatenate string representations of selected columns
        # Use .get() to handle missing columns gracefully, though they should exist
        raw_str = "".join([str(row.get(c, '')) for c in cols])
        return hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

    return df.apply(get_hash, axis=1)
