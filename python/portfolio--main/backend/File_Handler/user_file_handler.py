import pandas as pd
import logging
from io import BytesIO
from File_Handler.utils.Text_Normalisation import TextNormaliser

logger = logging.getLogger(__name__)

class UserFileHandler:
    def __init__(self, file_path_or_buffer):
        self.file = file_path_or_buffer

    def parse_file(self):
        try:
            # 1. Load file (Auto-detect Excel vs CSV)
            if isinstance(self.file, str):
                if self.file.lower().endswith('.csv'):
                    df = pd.read_csv(self.file)
                else:
                    # Read ALL sheets (returns dict of dfs)
                    # CRITICAL: Use dtype=str to prevent pandas from auto-parsing (and corrupting) dates
                    dfs = pd.read_excel(self.file, sheet_name=None, dtype=str)
                    if isinstance(dfs, dict):
                         # Concatenate all sheets
                         df = pd.concat(dfs.values(), ignore_index=True)
                    else:
                         df = dfs
            else:
                self.file.seek(0)
                try:
                    # Read ALL sheets from buffer
                    dfs = pd.read_excel(BytesIO(self.file.read()), sheet_name=None)
                    if isinstance(dfs, dict):
                        df = pd.concat(dfs.values(), ignore_index=True)
                    else:
                        df = dfs
                except:
                    self.file.seek(0)
                    df = pd.read_csv(BytesIO(self.file.read()))

            # 2. Find Header Row
            print(f"DEBUG: Initial DF shape: {df.shape}")
            df = self._find_header_row(df)
            print(f"DEBUG: DF shape after finding header: {df.shape}")

            # 3. Normalize Columns (Handles Tax Breakdown)
            df = self._normalize_columns(df)
            print(f"DEBUG: DF shape after normalizing columns: {df.shape}")

            # 4. Post-Processing Dates
            if "Trade_Date" in df.columns:
                print("DEBUG: Parsing Trade_Date...")
                df["Trade_Date"] = df["Trade_Date"].apply(TextNormaliser.parse_date)
                count_before = len(df)
                df = df.dropna(subset=["Trade_Date"])
                print(f"DEBUG: Rows dropped due to invalid Trade_Date: {count_before - len(df)}")

            print(f"DEBUG: Final DF shape: {df.shape}")
            return df

        except Exception as e:
            print(f"CRITICAL ERROR in parse_file: {str(e)}")
            import traceback
            traceback.print_exc()
            logger.error(f"File parsing failed: {str(e)}")
            return pd.DataFrame()

    def _find_header_row(self, df):
        # Added 'stock name', 'execution date and time' for Groww detection
        keywords = ['scrip', 'symbol', 'isin', 'trade date', 'trd dt', 'quantity', 'qty', 'buy/sell', 'trade type', 'type', 'net amt', 'stock name', 'execution date and time']
        
        # --- PHASE 1: Check if columns are ALREADY the header (Clean File) ---
        # Normalize columns: replace newlines, strip
        current_cols = [str(c).lower().replace('\n', ' ').replace('\r', '').strip() for c in df.columns]
        current_cols = [" ".join(val.split()) for val in current_cols]
        
        match_count_cols = sum(1 for k in keywords if any(k in val for val in current_cols))
        

        if match_count_cols >= 2:
             # Apply the normalized names to the dataframe
             df.columns = current_cols
             
             # --- CLEANUP (Same as Phase 2) ---
             valid_indices = []
             for idx, col in enumerate(df.columns):
                 c_str = str(col).strip().lower()
                 if c_str and c_str != 'nan' and c_str != 'none' and 'unnamed' not in c_str:
                     valid_indices.append(idx)
                     
             df = df.iloc[:, valid_indices]
             print(f"DEBUG: Found header in columns (Clean File). Kept {len(valid_indices)} columns.")
             return df

        # --- PHASE 2: Scan rows for header (file with metadata rows) ---
        for i in range(min(50, len(df))): # Increased search range
            # Normalize whitespace: replace newlines with space, remove extra spaces
            row_values = [
                str(val).lower().replace('\n', ' ').replace('\r', '').strip() 
                for val in df.iloc[i].tolist()
            ]
            # Collapse multiple spaces
            row_values = [" ".join(val.split()) for val in row_values]
            
            # --- DEBUG LOGGING ---
            if i < 5:
                # Log first 5 rows to see what we are scanning
                print(f"DEBUG SCAN Row {i}: {row_values}")

            # Strong signal check for Groww
            if any("execution date and time" in val for val in row_values):
                print(f"Found Groww header at row {i}")
                df.columns = df.iloc[i]
                
                # Cleanup: Drop columns that are NaN, empty, or 'nan'
                valid_indices = []
                for idx, col in enumerate(df.columns):
                    c_str = str(col).strip().lower()
                    if c_str and c_str != 'nan' and c_str != 'none' and 'unnamed' not in c_str:
                        valid_indices.append(idx)
                        
                df = df.iloc[:, valid_indices]
                df = df[i+1:].reset_index(drop=True)
                return df
                
            match_count = sum(1 for k in keywords if any(k in val for val in row_values))
            
            # --- DEBUG LOGGING ---
            if match_count > 0:
                 print(f"DEBUG Row {i} has {match_count} matches.")

            if match_count >= 2:
                print(f"Found Generic header at row {i} with {match_count} matches: {row_values}")
                df.columns = df.iloc[i]
                
                # Cleanup: Drop columns that are NaN, empty, or 'nan'
                # Convert to series to inspect name
                valid_indices = []
                for idx, col in enumerate(df.columns):
                    c_str = str(col).strip().lower()
                    if c_str and c_str not in ['nan', 'none', 'null'] and 'unnamed' not in c_str:
                        valid_indices.append(idx)
                    else:
                        print(f"Dropping invalid column at index {idx}: '{col}'")
                
                df = df.iloc[:, valid_indices]
                df = df[i+1:].reset_index(drop=True)
                return df
        
        print("WARNING: Header row not found!")
        return df

    def _normalize_columns(self, df):
        """
        Maps broker columns to standard names and preserves tax components.
        Handles Axis (Buy/Sell, B/S), Zerodha (Trade Type, buy/sell), and Groww.
        """
        df.columns = df.columns.astype(str).str.strip()
        logger.info(f"Raw Columns Found: {df.columns.tolist()}")

        # --- ROBUST CASE-INSENSITIVE MAPPING ---
        # Create a map of {lower_case_col: actual_col} for safe lookup
        col_map_lower = {c.lower(): c for c in df.columns}
        
        # Helper to rename column if exists (case-insensitive)
        def rename_col_insensitive(target_lower, new_name, df_obj):
            if target_lower in col_map_lower:
                actual_name = col_map_lower[target_lower]
                
                # Check if the NEW name already exists (priority collision)
                if new_name in df_obj.columns:
                     # If the new name exists, we have a collision.
                     # Since we prioritize calls (e.g. Symbol first), we should DROP the lower priority one 
                     # to avoid duplicates.
                     if actual_name != new_name:
                         logger.info(f"Dropping redundant column '{actual_name}' because '{new_name}' already exists.")
                         df_obj.drop(columns=[actual_name], inplace=True)
                         del col_map_lower[target_lower]
                         return True
                
                if actual_name != new_name:
                    df_obj.rename(columns={actual_name: new_name}, inplace=True)
                    # Update local map to reflect change prevents double mapping
                    col_map_lower[new_name.lower()] = new_name 
                    
                    # Remove old key
                    if actual_name.lower() in col_map_lower:
                        del col_map_lower[actual_name.lower()]
                    
                    # Also remove target_lower to prevent re-use
                    if target_lower in col_map_lower:
                        del col_map_lower[target_lower]
                        
                return True
            return False

        # --- PRESERVE AXIS TAX COMPONENTS ---
        # Keys must be lowercase because we now use rename_col_insensitive
        axis_tax_map = {
            'cgst': 'Tax_CGST',
            'integrated gst': 'Tax_IGST',
            'integrated_gst': 'Tax_IGST',
            
            'sgst': 'Tax_SGST',
            'igst': 'Tax_IGST',
            
            'stt': 'Tax_STT',
            'securities transaction tax': 'Tax_STT',
            'securities_transaction_tax': 'Tax_STT',
            
            'stamp duty': 'Tax_Stamp_Duty',
            'stamp_duty': 'Tax_Stamp_Duty',
            
            'sebi turnover tax': 'Tax_Sebi_Turnover',
            'sebi turnover fee': 'Tax_Sebi_Turnover',
            'sebi_turnover_tax': 'Tax_Sebi_Turnover',
            'sebi_turnover_fee': 'Tax_Sebi_Turnover',
            'sebi_tax': 'Tax_Sebi_Turnover', # Axis Indepth
            
            'cgst on transn chrg': 'Tax_CGST_on_Transaction',
            'cgst_on_transn_chrg': 'Tax_CGST_on_Transaction',
            
            'transn chrg': 'Tax_Transaction_Charge',
            'transn_chrg': 'Tax_Transaction_Charge',
            'transn_chgs': 'Tax_Transaction_Charge', # Axis Indepth Typo
            
            'brok amt': 'Brokerage_Amt',
            'brok_amt': 'Brokerage_Amt',
            'brokerage': 'Brokerage_Amt',
            'total taxes': 'Taxes_Old',
            'total_taxes': 'Taxes_Old',
            'total charges': 'Charges_Old',
            'total_charges': 'Charges_Old'
        }
        
        for key_lower, std_name in axis_tax_map.items():
            rename_col_insensitive(key_lower, std_name, df)

        # 1. Handle Scrip_Name Priority: Symbol > Stock name

        # 1. Handle Scrip_Name Priority: Symbol > Stock name
        # Check for 'symbol' first (INDMoney uses 'Scrip Symbol')
        if not rename_col_insensitive('symbol', 'Scrip_Name', df):
            # If not found, try 'stock name' (Groww)
            if not rename_col_insensitive('stock name', 'Scrip_Name', df):
                 # Try 'scrip sym' (INDMoney variant)
                 if not rename_col_insensitive('scrip symbol', 'Scrip_Name', df):
                     pass

        # Fallback for Scrip Name (Zerodha/Axis/Motilal)
        rename_col_insensitive('scrip name', 'Scrip_Name', df)
        # Angel One
        rename_col_insensitive('scrip/contract', 'Scrip_Name', df)

        # --- MOTILAL OSWAL CLEANING ---
        if 'Scrip_Name' in df.columns:
            # Check if we have entries like "ZERODHA AM PVT LTD#ZERODHA MF..."
            # We want to keep everything AFTER the '#'
            def clean_motilal_scrip(val):
                if isinstance(val, str) and '#' in val:
                    parts = val.split('#')
                    if len(parts) > 1:
                        return parts[1].strip()
                return val
            
            # Apply only if we detect this pattern to avoid false positives
            sample_vals = df['Scrip_Name'].head(10).astype(str).tolist()
            if any('#' in v for v in sample_vals):
                logger.info("Detected Motilal Oswal style scrip names with '#'. Cleaning...")
                df['Scrip_Name'] = df['Scrip_Name'].apply(clean_motilal_scrip)

        # --- AXIS SPECIFIC DATE MERGE ---
        # Check for 'Trd Dt' and 'Order Time' and merge them
        if 'trd dt' in col_map_lower and 'order time' in col_map_lower:
             trd_col = col_map_lower['trd dt']
             time_col = col_map_lower['order time']
             logger.info(f"Merging Axis columns: {trd_col} + {time_col}")
             
             # Convert to string
             # PANDAS QUIRK: read_excel(dtype=str) converts timestamps to "YYYY-MM-DD 00:00:00"
             # We need to strip the " 00:00:00" garbage if present, and "1900-01-01 " from time
             
             d_str = df[trd_col].astype(str).str.split(' ').str[0] # Take first part (Date)
             t_str = df[time_col].astype(str).str.split(' ').str[-1] # Take last part (Time)
             
             df['Trade_Date'] = d_str + ' ' + t_str
             
             # Clean up the old columns to prevent confusion
             df.drop(columns=[trd_col, time_col], inplace=True)
             
             # Update maps
             if trd_col.lower() in col_map_lower: del col_map_lower[trd_col.lower()]
             if time_col.lower() in col_map_lower: del col_map_lower[time_col.lower()]

        # 2. Map other columns (Case Insensitive)
        
        # SPECIAL HANDLING FOR ZERODHA:
        # If 'order execution time' exists, it contains the full timestamp.
        # 'Trade Date' only contains the date. We want 'order execution time' to be the definitive 'Trade_Date'.
        if 'order execution time' in col_map_lower:
            target_col = col_map_lower['order execution time']
            logger.info(f"Found definitive Zerodha timestamp column: {target_col}")
            df.rename(columns={target_col: 'Trade_Date'}, inplace=True)
            
            # Remove conflicting 'Trade Date' if it exists to avoid duplicates
            if 'trade date' in col_map_lower:
                old_date_col = col_map_lower['trade date']
                if old_date_col != 'Trade_Date': # Ensure we don't drop what we just renamed
                    logger.info(f"Dropping redundant date column: {old_date_col}")
                    df.drop(columns=[old_date_col], inplace=True)
                    del col_map_lower['trade date']
            
            # Update map to prevent re-mapping
            col_map_lower['trade_date'] = 'Trade_Date'
            del col_map_lower['order execution time']

        # Generic Map: 'key_lower': 'Standard_Name'
        generic_map = {
            'trd dt': 'Trade_Date', 'date': 'Trade_Date', 'trade date': 'Trade_Date',
            'execution date and time': 'Trade_Date', 'trade_date': 'Trade_Date',
            'transaction date': 'Trade_Date', # Motilal
            'execution date': 'Trade_Date', # INDMoney
            
            'buy/sell': 'Order_Type', 'trade type': 'Order_Type', 'type': 'Order_Type',
            'order_type': 'Order_Type', 'transaction type': 'Order_Type', # Motilal
            
            'qty': 'Qty', 'quantity': 'Qty',
            
            'mkt price': 'Mkt_Price', 'rate': 'Mkt_Price', 'price': 'Mkt_Price',
            'mkt_price': 'Mkt_Price', 'transaction price': 'Mkt_Price', # Motilal
            
            'brok amt': 'Brokerage_Amt', 'brokerage': 'Brokerage_Amt', 'brokerage_amt': 'Brokerage_Amt',
            'value': 'Amount', 'net amount': 'Amount', 'amount': 'Amount', 'net amt': 'Amount',
            'net_amount': 'Amount', 'transaction value': 'Amount', # Motilal
            
            'exch': 'Exchange', 'exchange': 'Exchange',
            'isin': 'ISIN'
        }

        for key_lower, std_name in generic_map.items():
            # Skip if std_name already exists (prioritized mapping)
            # But we must be careful not to skip valid mappings. 
            # Actually, just run rename. The first match wins if we iterate? 
            # No, dictionary keys are unique. 
            rename_col_insensitive(key_lower, std_name, df)
            
        # Re-verify columns after mapping
        df.columns = df.columns.astype(str).str.strip()

        # --- NORMALIZE Order_Type VALUES ---
        # Convert all to uppercase single letters (B for buy, S for sell)
        if 'Order_Type' in df.columns:
            # Robust normalization: Look for 'buy' or 'sell' inside the string
            def normalize_side(val):
                s = str(val).lower().strip()
                if 'buy' in s or s == 'b': return 'B'
                if 'sell' in s or s == 's': return 'S'
                return val # Return original if unclear
            
            df['Order_Type'] = df['Order_Type'].apply(normalize_side)
            logger.info(f"Normalized Order_Type values: {df['Order_Type'].unique().tolist()}")

        # --- ANGEL ONE PRICE MERGE & ZERO FILL ---
        # Angel One splits 'Buy Price' and 'Sell Price'. We need one 'Mkt_Price'.
        # We can detect this if 'Mkt_Price' is missing but 'buy price'/'sell price' keys existed in raw lower map
        # But since we normalized to generic names, we need to check raw lower map logic again or better: check current columns
        
        # Check if we have 'Buy Price' or 'Sell Price' columns still lurking (not mapped)
        # Update: We didn't map them in generic_map yet. Let's do it here.
        
        col_map_lower_refresh = {c.lower(): c for c in df.columns}
        
        if 'Mkt_Price' not in df.columns:
             # Logic for Angel One splitting
             b_price = col_map_lower_refresh.get('buy price')
             s_price = col_map_lower_refresh.get('sell price')
             
             if b_price and s_price:
                 logger.info(f"Detected Angel One split prices: {b_price}, {s_price}")
                 # Coalesce: If Order Type is B, use Buy Price, else Sell Price
                 # OR simply: use whichever is non-zero/non-empty since a transaction is usually one-sided
                 
                 # Clean them first
                 for col in [b_price, s_price]:
                     df[col] = pd.to_numeric(
                         df[col].astype(str).str.replace(r'[^\d.]', '', regex=True),
                         errors='coerce'
                     ).fillna(0)
                 
                 df['Mkt_Price'] = df[b_price] + df[s_price]
                 logger.info("Merged Angel One Buy/Sell prices into Mkt_Price")


        # --- CALCULATE Mkt_Price FOR GROWW (If missing) ---
        # Groww gives 'Value' (Net Amount) and 'Quantity'
        if 'Mkt_Price' not in df.columns:
            if 'Amount' in df.columns and 'Qty' in df.columns:
                 # Clean numeric columns first to ensure calculation works
                for col in ['Qty', 'Amount']:
                     df[col] = (
                        df[col].astype(str)
                        .str.replace(r'[^\d.]', '', regex=True)
                        .replace('', '0')
                    )
                     df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
                
                # Avoid division by zero
                df['Mkt_Price'] = df.apply(
                    lambda row: row['Amount'] / row['Qty'] if row['Qty'] != 0 else 0.0, 
                    axis=1
                )
                logger.info("Calculated Mkt_Price from Net_Amount / Qty")
            else:
                 logger.warning("Could not calculate Mkt_Price: Missing Net_Amount or Qty")
                 df['Mkt_Price'] = 0.0

        # --- CLEAN ALL NUMERIC & TAX COLUMNS (Again for safety) ---
        tax_component_cols = [col for col in df.columns if col.startswith('Tax_')]
        numeric_targets = ['Qty', 'Mkt_Price', 'Brokerage_Amt'] + tax_component_cols

        for col in numeric_targets:
            if col in df.columns:
                df[col] = (
                    df[col].astype(str)
                    .str.replace(r'[^\d.]', '', regex=True)
                    .replace('', '0')
                )
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            # Ensure these columns exist (default to 0 if missing, e.g. for Groww)
            if col not in df.columns:
                df[col] = 0.0

        # --- GENERIC TAX MAPPING (Angel One, Motilal, others) ---
        # Map common tax columns to Tax_ prefix so they get summed and included in breakdown
        generic_tax_map = {
            'gst': 'Tax_GST',
            'cgst': 'Tax_CGST',
            'sgst': 'Tax_SGST',
            'igst': 'Tax_IGST',
            'utgst': 'Tax_UTGST',
            'stt': 'Tax_STT',
            'securities transaction tax': 'Tax_STT',
            'stamp duty': 'Tax_Stamp_Duty',
            'sebi tax': 'Tax_SEBI',
            'sebi turnover tax': 'Tax_SEBI',
            'exchange turnover charges': 'Tax_Exchange_Turnover',
            'exchange txn charge': 'Tax_Exchange_Turnover',
            'other charges': 'Tax_Other',
            'other chrg': 'Tax_Other',
            'ipft charges': 'Tax_IPFT',
            'service tax': 'Tax_Service_Tax'
        }
        
        for key_lower, std_name in generic_tax_map.items():
            rename_col_insensitive(key_lower, std_name, df)

        # --- CREATE TOTAL TAXES COLUMN ---
        # Re-identify tax columns after all renaming
        tax_component_cols = [col for col in df.columns if col.startswith('Tax_')]
        
        # Ensure they are numeric
        for col in tax_component_cols:
             if col not in df.columns: continue
             df[col] = pd.to_numeric(
                 df[col].astype(str).str.replace(r'[^\d.]', '', regex=True),
                 errors='coerce'
             ).fillna(0)

        if tax_component_cols:
            df['Taxes'] = df[tax_component_cols].sum(axis=1)
            
            # --- CREATE TAX BREAKDOWN DICTIONARY ---
            # Create a dictionary of {Tax_Name: Value} for non-zero taxes
            # This is required for frontend tooltips
            def create_breakdown(row):
                breakdown = {}
                for col in tax_component_cols:
                    if row[col] > 0:
                        # Clean name: remove Tax_ prefix and underscores
                        clean_name = col.replace('Tax_', '').replace('_', ' ')
                        breakdown[clean_name] = row[col]
                return breakdown
            
            df['Tax_Breakdown'] = df.apply(create_breakdown, axis=1)
            
        else:
            df['Taxes'] = 0.0
            df['Tax_Breakdown'] = df.apply(lambda x: {}, axis=1)

        # --- CRITICAL SAFETY: ENSURE Trade_Date EXISTS ---
        if 'Trade_Date' not in df.columns:
            logger.warning("Trade_Date column missing after normalization. Adding empty column to prevent crash.")
            df['Trade_Date'] = pd.NaT

        logger.info(f"Normalized Columns: {df.columns.tolist()}")
        return df
