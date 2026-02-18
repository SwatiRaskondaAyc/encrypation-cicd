import pandas as pd
import logging
import traceback
from sqlalchemy import select, or_

logger = logging.getLogger(__name__)

# --- Database Imports ---
DB_AVAILABLE = False
Company_master = None
get_db_session = None

try:
    from mtm.orm.db_fundamentals.orm_models import Company_master
    from mtm.orm.engine import get_fundamental_db_session
    DB_AVAILABLE = True
    print("DEBUG: db_enrichment - Database components imported successfully.")
except ImportError as e:
    logger.warning(f"Database components could not be imported. Enrichment disabled. Error: {e}")
    print(f"DEBUG: db_enrichment - Database import failed: {e}")
    DB_AVAILABLE = False

def enrich_trade_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Enriches the dataframe with missing ISIN and Exchange information 
    by querying the database (Company_master).
    Lookups are performed by Symbol first, then by Scrip_Name.
    """
    global DB_AVAILABLE
    print(f"DEBUG: enrich_trade_data called. DB_AVAILABLE={DB_AVAILABLE}, df_shape={df.shape}")
    
    if not DB_AVAILABLE:
        logger.warning("Skipping DB enrichment: Database Not Available.")
        print("DEBUG: Skipping enrichment because DB is not available.")
        return df

    if df.empty:
        return df
        
    # helper to check emptiness
    def is_empty(val):
        return pd.isna(val) or str(val).strip() == '' or str(val).lower() == 'nan' or str(val).lower() == 'none'

    # STRICT VALIDATION: Check for Symbol or Scrip_Name columns
    has_symbol = 'Symbol' in df.columns
    has_scrip = 'Scrip_Name' in df.columns

    if not has_symbol and not has_scrip:
        raise ValueError("Invalid transaction sheet: Missing both 'Symbol' and 'Scrip_Name' columns.")

    # Ensure required columns exist
    if 'ISIN' not in df.columns:
        df['ISIN'] = None
    if 'Exchange' not in df.columns:
        df['Exchange'] = None


    session = None
    try:
        session = get_fundamental_db_session()
        
        # Identify rows needing enrichment
        mask_isin = df['ISIN'].apply(is_empty)
        mask_exch = df['Exchange'].apply(is_empty)
        
        rows_to_enrich = df[mask_isin | mask_exch]
        
        if rows_to_enrich.empty:
            logger.info("All rows have ISIN/Exchange. No enrichment needed.")
            return df
            
        unique_symbols = rows_to_enrich['Symbol'].unique().tolist()
        unique_names = []
        if 'Scrip_Name' in df.columns:
            unique_names = rows_to_enrich['Scrip_Name'].unique().tolist()
        
        unique_symbols = [x for x in unique_symbols if not is_empty(x)]
        unique_names = [x for x in unique_names if not is_empty(x)]
        
        if not unique_symbols and not unique_names:
            return df
            
        logger.info(f"Attempting enrichment for {len(unique_symbols)} symbols and {len(unique_names)} scrip names.")

        # Query DB
        conditions = []
        if unique_symbols:
            conditions.append(Company_master.SYMBOL.in_(unique_symbols))
        if unique_names:
            conditions.append(Company_master.SCRIP_NAME.in_(unique_names))
            
        if not conditions:
            return df

        # Note: Exchange column does not exist in Company_master, so we fetch only ISIN
        # and default Exchange to likely 'NSE' if found via Symbol.
        stmt = select(Company_master.SYMBOL, Company_master.ISIN, Company_master.SCRIP_NAME).\
            where(or_(*conditions))
            
        results = session.execute(stmt).all()
        
        # Build Maps
        symbol_map = {} # Symbol -> (ISIN, Exchange)
        name_map = {}   # Scrip_Name -> (ISIN, Exchange)
        
        for row in results:
            # row keys: SYMBOL, ISIN, SCRIP_NAME
            # Default Exchange to NSE
            exch = 'NSE' 
            
            if row.SYMBOL:
                symbol_map[row.SYMBOL] = (row.ISIN, exch)
            if row.SCRIP_NAME:
                name_map[row.SCRIP_NAME] = (row.ISIN, exch)
                
        logger.info(f"DB Lookup: Found {len(symbol_map)} by Symbol, {len(name_map)} by Scrip Name.")
        
        # Apply to DataFrame
        def update_row(row):
            curr_isin = str(row.get('ISIN')) if not is_empty(row.get('ISIN')) else None
            curr_exch = str(row.get('Exchange')) if not is_empty(row.get('Exchange')) else None
            
            found_isin = None
            found_exch = None
            
            # 1. Try Symbol
            sym = row.get('Symbol')
            if not is_empty(sym) and sym in symbol_map:
                found_isin, found_exch = symbol_map[sym]
            
            # 2. Try Scrip_Name if failed
            if not found_isin:
                s_name = row.get('Scrip_Name')
                if not is_empty(s_name) and s_name in name_map:
                    found_isin, found_exch = name_map[s_name]
            
            # Update Row if found
            if found_isin:
                if is_empty(curr_isin):
                    row['ISIN'] = found_isin
                
                # Update exchange if missing
                if is_empty(curr_exch) and found_exch:
                    row['Exchange'] = found_exch
            
            return row

        # Apply
        print(f"DEBUG: Enriched {len(df)} rows. Map sizes: Sym={len(symbol_map)}, Name={len(name_map)}")
        enriched_df = df.apply(update_row, axis=1)
        return enriched_df

    except Exception as e:
        logger.error(f"Error during DB enrichment: {traceback.format_exc()}")
        return df
    finally:
        if session and hasattr(session, 'close'):
            try:
                session.close()
            except:
                pass
