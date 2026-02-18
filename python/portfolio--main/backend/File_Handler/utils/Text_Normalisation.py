import re
import numpy as np
import pandas as pd
from dateutil import parser

class TextNormaliser:
    @staticmethod
    def normalize_scrip_name(text: str, keep_nums: bool = True) -> str:
        """
        Clean and normalise a scrip/company name.
        Used for matching upload text -> NSE symbols.
        """
        if not isinstance(text, str):
            text = str(text or "")

        if keep_nums:
            text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
        else:
            text = re.sub(r"[^a-zA-Z\s]", "", text)

        text = text.lower()

        # Common suffixes to remove
        char_to_replace = {
            "ltd": "",
            "limited": "",
            "eng": "",
            "engineering": "",
            "ind": "",
            "industries": "",
        }
        for key, value in char_to_replace.items():
            # Replace full words only to avoid accidental substrings
            text = re.sub(r'\b' + key + r'\b', '', text)

        normalized_text = " ".join(text.split())
        return normalized_text.upper()

    @staticmethod
    def parse_date(date_val):
        """
        Robust date parsing used everywhere.
        """
        if isinstance(date_val, pd.Timestamp):
            return date_val

        # Excel serials / floats
        if isinstance(date_val, (int, float)) and not pd.isna(date_val):
            try:
                # Excel serials are days since 1899-12-30
                return pd.to_datetime("1899-12-30") + pd.to_timedelta(
                    int(date_val), unit="D"
                )
            except Exception:
                pass

        try:
            # Check for ISO format (YYYY-...) to avoid dayfirst ambiguity 
            # e.g. "2025-09-02" with dayfirst=True becomes 2025-02-09 (Feb 9 instead of Sep 2)
            str_val = str(date_val).strip()
            if re.match(r'^\d{4}', str_val):
                 return pd.to_datetime(date_val, dayfirst=False)

            # Pandas is often more robust for specific formats (dd-mm-yyyy)
            # This handles "30-01-2025 11:39 AM" correctly with dayfirst=True
            return pd.to_datetime(date_val, dayfirst=True)
        except Exception:
            try:
                # Fallback to dateutil for weird string formats
                return parser.parse(str(date_val))
            except Exception:
                return pd.NaT

def clean_scrip_names(df: pd.DataFrame) -> pd.DataFrame:
    """
    Takes a dataframe with 'Scrip_Name', cleans it.
    This prepares the names for the DB mapper.
    """
    df_clean = df.copy()
    
    if 'Scrip_Name' in df_clean.columns:
        # Normalize text: removing 'LTD', special chars, extra spaces
        # We keep the original column for display if needed, but usually we overwrite
        df_clean['Scrip_Name'] = df_clean['Scrip_Name'].apply(TextNormaliser.normalize_scrip_name)
        
    return df_clean
