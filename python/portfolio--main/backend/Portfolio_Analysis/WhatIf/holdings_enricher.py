"""
Utility to enrich holdings with sector and industry data from fundamentals database.
"""
import logging
from typing import List, Dict
from sqlalchemy import func
from mtm.orm.engine import SessionFundamentals
from mtm.orm.db_fundamentals.orm_models import Company_master, Industrymaster_Ex1

logger = logging.getLogger(__name__)


def enrich_holdings_with_sector(holdings: List[Dict]) -> List[Dict]:
    """
    Enrich holdings list with Sector and Industry fields from Industrymaster_Ex1.
    Uses the exact same approach as Accord.get_company_industry_sector.
    
    Args:
        holdings: List of dicts with at least 'symbol' field
    
    Returns:
        List of holdings enriched with 'sector', 'Sector', 'industry', 'Industry' fields
    """
    session = SessionFundamentals()
    enriched = []
    
    try:
        for holding in holdings:
            symbol = holding.get('symbol')
            if not symbol:
                # No symbol, can't look up
                enriched.append(holding)
                continue
            
            # Use exact same query as Accord (lines 132-150 of accord_fundamentals.py)
            try:
                result = session.query(
                    Company_master.SYMBOL,
                    Industrymaster_Ex1.Sector,
                    Industrymaster_Ex1.Industry
                ).outerjoin(
                    Industrymaster_Ex1,
                    Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
                ).filter(
                    func.upper(Company_master.SYMBOL) == symbol.upper()
                ).first()
                
                if result:
                    _, db_sector, db_industry = result
                    sector = db_sector if db_sector else 'Other'
                    industry = db_industry if db_industry else 'Other'
                    logger.info(f"✅ Found sector for {symbol}: {sector} / {industry}")
                else:
                    # Fallback: Try PeerFetcher
                    logger.warning(f"⚠️ Stock {symbol} not found in Company_master. Attempting PeerFetcher fallback.")
                    try:
                        from Portfolio_Analysis.WhatIf.peer_fetcher import PeerFetcher
                        pf = PeerFetcher()
                        res = pf.get_peer_stocks(symbol) 
                        if "error" not in res:
                            sector = res.get('sector', 'Other')
                            industry = res.get('industry', 'Other')
                            logger.info(f"✅ Fallback successful for {symbol}: {sector}")
                        else:
                            logger.error(f"❌ PeerFetcher also failed for {symbol}: {res.get('error')}")
                            sector = 'Other'
                            industry = 'Other'
                    except Exception as e_fallback:
                        logger.error(f"❌ Fallback exception for {symbol}: {e_fallback}")
                        sector = 'Other'
                        industry = 'Other'

            except Exception as e:
                logger.error(f"❌ Error fetching sector for {symbol}: {e}")
                sector = 'Other'
                industry = 'Other'
            
            # Add sector fields to holding (both casings for compatibility)
            enriched_holding = {
                **holding,
                'sector': sector,
                'Sector': sector,
                'industry': industry,
                'Industry': industry
            }
            enriched.append(enriched_holding)
        
        logger.info(f"Enriched {len(enriched)} holdings with sector data")
        return enriched
        
    finally:
        session.close()
