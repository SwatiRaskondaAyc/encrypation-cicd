from typing import List, Dict
from sqlalchemy.orm import Session
from mtm.orm.db_fundamentals.orm_models import Company_master
from mtm.orm.engine import get_fundamental_db_session
from mtm.repo.query_executor import QueryExecutor
from File_Handler.utils.Text_Normalisation import TextNormaliser # Re-use your normalizer

# Global Cache
_SYMBOL_LOOKUP_CACHE = None

def _get_symbol_lookup() -> Dict[str, str]:
    """
    Fetch DB records and build lookup dictionary.
    Cached in memory.
    """
    global _SYMBOL_LOOKUP_CACHE
    if _SYMBOL_LOOKUP_CACHE is not None:
        return _SYMBOL_LOOKUP_CACHE
        
    session: Session = next(get_fundamental_db_session())
    try:
        executor = QueryExecutor(session=session, mode="orm")
        
        # Fetch ALL valid symbols and company names
        query = session.query(
            Company_master.SYMBOL,
            Company_master.COMPNAME
        ).filter(
            Company_master.SERIES.in_(['EQ', 'BE', 'BZ', 'SM'])
        )
        db_records = executor.select(query, format="records")
        
        lookup = {}
        for row in db_records:
            if not row['COMPNAME']: continue
            # Normalize Name -> Symbol
            norm_name = TextNormaliser.normalize_scrip_name(row['COMPNAME'])
            lookup[norm_name] = row['SYMBOL']
            
            # Normalize Symbol -> Symbol (e.g. "JINDAL SAW" -> JINDALSAW -> JINDAL SAW)
            norm_sym = TextNormaliser.normalize_scrip_name(row['SYMBOL'])
            lookup[norm_sym] = row['SYMBOL']
            
            # Handle JINDALSAW specific case if needed (spaces removed)
            # If DB has "JINDAL SAW", normalized is "JINDAL SAW"
            # If Input is "JINDALSAW", normalized is "JINDALSAW" -> No match
            # So we add a "no-space" version to the lookup
            no_space_name = norm_name.replace(" ", "")
            if no_space_name != norm_name:
                lookup[no_space_name] = row['SYMBOL']
                
            no_space_sym = norm_sym.replace(" ", "")
            if no_space_sym != norm_sym:
                lookup[no_space_sym] = row['SYMBOL']

        _SYMBOL_LOOKUP_CACHE = lookup
        return lookup
    finally:
        session.close()

def map_broker_scrips_by_compname(scrip_names: List[str]) -> Dict[str, str]:
    """
    Map broker Scrip_Name -> NSE SYMBOL using Company_master.
    Uses cached lookup for speed.
    """
    if not scrip_names:
        return {}

    unique_names = list(set(scrip_names))
    db_lookup = _get_symbol_lookup()
    
    mapping = {}
    
    for raw in unique_names:
        # Normalize input
        norm_input = TextNormaliser.normalize_scrip_name(str(raw))
        
        # 1. Exact match on normalized
        if norm_input in db_lookup:
            mapping[raw] = db_lookup[norm_input]
            continue
            
        # 2. Match on no-space version (JINDALSAW -> JINDAL SAW)
        no_space_input = norm_input.replace(" ", "")
        if no_space_input in db_lookup:
            mapping[raw] = db_lookup[no_space_input]
            continue
        
        # 3. Fuzzy / StartsWith (as fallback)
        match = None
        for db_norm, db_sym in db_lookup.items():
            if norm_input == db_norm: 
                 match = db_sym
                 break
            if db_norm.startswith(norm_input):
                match = db_sym
                break
        
        if match:
            mapping[raw] = match
        else:
            mapping[raw] = raw # Keep original if no match
            
    return mapping
