from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from mtm.orm.db_fundamentals.orm_models import Company_master
from mtm.orm.engine import get_fundamental_db_session
from mtm.repo.query_executor import QueryExecutor

def get_symbol_fincode_mapping(symbols: List[str]) -> Tuple[Dict[str, int], Dict[int, str]]:
    """
    Fetch Fincodes for a list of Symbols from Company_master.
    Returns:
        (symbol_to_fincode, fincode_to_symbol)
    """
    if not symbols:
        return {}, {}
    
    # Normalize symbols to uppercase for querying
    upper_symbols = [s.upper() for s in symbols]
    
    session: Session = next(get_fundamental_db_session())
    try:
        executor = QueryExecutor(session=session, mode="orm")
        
        query = session.query(
            Company_master.SYMBOL,
            Company_master.FINCODE
        ).filter(
            Company_master.SYMBOL.in_(upper_symbols)
        )
        
        results = executor.select(query, format="records")
        
        sym_to_fin = {}
        fin_to_sym = {}
        
        for row in results:
            sym = row['SYMBOL']
            fin = row['FINCODE']
            sym_to_fin[sym] = fin
            fin_to_sym[fin] = sym
            
        return sym_to_fin, fin_to_sym
        
    except Exception as e:
        print(f"Error fetching fincodes: {e}")
        return {}, {}
    finally:
        session.close()
