# mtm/api/news_fetcher.py

import requests
import os
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, Optional
import re

# --- DB Imports (Using your repo structure) ---
from sqlalchemy.orm import Session
from mtm.orm.db_fundamentals.orm_models import Company_master
from mtm.orm.engine import get_fundamental_db_session
from mtm.repo.query_executor import QueryExecutor

# Setup Logging
log_file_path = os.path.join(os.path.dirname(__file__), 'news_fetcher.log')
logging.basicConfig(
    filename=log_file_path,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()
API_KEY = os.getenv("News_API_1")

if not API_KEY:
    logger.warning("Warning: News_API_1 not found in environment variables.")

# Global Cache for Company Names
_SYMBOL_TO_NAME_CACHE: Dict[str, str] = {}

def load_company_names_cache():
    """
    Loads SYMBOL -> COMPNAME mapping from Company_master DB into memory.
    """
    global _SYMBOL_TO_NAME_CACHE
    if _SYMBOL_TO_NAME_CACHE:
        return

    session: Session = None
    try:
        session_gen = get_fundamental_db_session()
        session = next(session_gen)
        
        executor = QueryExecutor(session=session, mode="orm")

        # Fetch only valid equity symbols
        query = session.query(
            Company_master.SYMBOL,
            Company_master.COMPNAME
        ).filter(
            Company_master.SERIES.in_(['EQ', 'BE', 'BZ', 'SM'])
        )
        
        records = executor.select(query, format="records")
        
        # Populate Cache
        for row in records:
            sym = row.get('SYMBOL')
            name = row.get('COMPNAME')
            if sym and name:
                _SYMBOL_TO_NAME_CACHE[sym.upper()] = name
        
        logger.info(f"Loaded {len(_SYMBOL_TO_NAME_CACHE)} company names into cache.")
        
    except Exception as e:
        logger.error(f"Failed to load company names from DB: {e}")
    finally:
        if session:
            session.close()

def get_clean_company_name(full_name: str) -> str:
    """
    Removes suffixes like 'Limited', 'Ltd', 'Ltd.', 'Limited.' from company name
    to allow for broader but safe matching (e.g. 'Reliance Industries' matches 'Reliance Industries Ltd')
    """
    if not full_name:
        return ""
    
    # Remove common legal suffixes (case insensitive)
    # \b ensures we match whole words
    clean = re.sub(r'\b(limited|ltd\.?|pvt\.?|private|inc\.?|corp\.?|corporation)\b', '', full_name, flags=re.IGNORECASE)
    
    # Remove extra spaces
    clean = " ".join(clean.split())
    return clean

def get_company_full_name(symbol: str) -> str:
    """
    Returns the full company name for a given NSE symbol using the DB cache.
    """
    if not _SYMBOL_TO_NAME_CACHE:
        load_company_names_cache()
    
    clean_sym = symbol.replace('.NS', '').replace('.BO', '').upper()
    return _SYMBOL_TO_NAME_CACHE.get(clean_sym, clean_sym)

def get_date_query_params(target_date_str=None):
    if target_date_str:
        try:
            for fmt in ('%d-%m-%Y', '%Y-%m-%d'):
                try:
                    dt = datetime.strptime(target_date_str, fmt)
                    break
                except ValueError:
                    continue
            start_date = (dt - timedelta(days=1)).strftime('%Y-%m-%d')
            end_date = (dt + timedelta(days=1)).strftime('%Y-%m-%d')
            return f" after:{start_date} before:{end_date}"
        except Exception:
            return ""
    else:
        return " when:1d"

def fetch_single_stock_news(symbol, date_filter_suffix, max_results=5):
    """
    Fetches news for a SINGLE stock AND performs STRICT validation.
    """
    if not symbol:
        return []

    company_name_full = get_company_full_name(symbol)
    company_name_clean = get_clean_company_name(company_name_full)
    
    # 1. Construct Query
    # We use the CLEAN name in the query to cast a wider net initially
    query = f"({symbol} OR \"{company_name_clean}\") AND (NSE OR BSE OR Sensex OR Nifty OR \"stock price\"){date_filter_suffix}"
    
    url = "https://api.scrapingdog.com/google_news/v2"
    
    params = {
        "api_key": API_KEY,
        "query": query,
        "country": "in",
        "safe": "active",
        "results": max_results, # Fetch a few more to allow for filtering
        "tbs": "sbd:1"
    }

    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        raw_articles = data.get("news_results", [])
        valid_articles = []
        
        # 2. STRICT POST-FETCH FILTERING
        for art in raw_articles:
            headline = (art.get("title") or "").lower()
            snippet = (art.get("snippet") or "").lower()
            full_text = f"{headline} {snippet}"
            
            # Check 1: Symbol Match (Exact word match to avoid substrings)
            # e.g. "ITC" matches "ITC" but not "SWITCH"
            symbol_match = False
            if re.search(r'\b' + re.escape(symbol.lower()) + r'\b', full_text):
                symbol_match = True
            
            # Check 2: Company Name Match (Substring match is okay for multi-word names)
            # e.g. "Reliance Industries" in "Reliance Industries reports profit"
            # We use the CLEAN name (no "Ltd")
            name_match = False
            if company_name_clean.lower() in full_text:
                name_match = True
                
            # STRICT CONDITION: Must match either Symbol OR Clean Name
            if symbol_match or name_match:
                art['_matched_symbol'] = symbol
                valid_articles.append(art)
            else:
                # Debug log (optional)
                # logger.info(f"Rejected article for {symbol}: {headline} (No strict match)")
                pass
            
        return valid_articles

    except Exception as e:
        logger.error(f"Fetch failed for {symbol}: {e}")
        return []

def fetch_portfolio_news(symbols, target_date=None, max_articles_per_batch=10):
    """
    Main function: Fetches news for EACH symbol separately.
    """
    if not API_KEY:
        return []

    load_company_names_cache()
    date_query_suffix = get_date_query_params(target_date)
    
    all_articles = []
    mode = "Historical" if target_date else "Latest 24h"
    logger.info(f"Fetching {mode} news for {len(symbols)} symbols (Strict Mode).")

    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_symbol = {
            executor.submit(fetch_single_stock_news, sym, date_query_suffix, 8): sym 
            for sym in symbols
        }
        
        for future in as_completed(future_to_symbol):
            try:
                articles = future.result()
                if articles:
                    all_articles.extend(articles)
            except Exception as e:
                logger.error(f"Worker failed: {e}")

    # Deduplicate & Format
    seen_links = set()
    formatted_results = []
    
    for article in all_articles:
        link = article.get('link')
        if link not in seen_links:
            seen_links.add(link)
            
            # Stale check
            is_stale = False
            if not target_date and article.get('date'):
                d_str = article.get('date', '').lower()
                if 'day' in d_str and ('2' in d_str or '3' in d_str or '4' in d_str):
                    is_stale = True
            
            if not is_stale:
                formatted_results.append({
                    "headline": article.get("title", ""),
                    "subtitle": article.get("snippet", article.get("title", "")),
                    "date": article.get("date", ""),
                    "image_url": article.get("thumbnail", ""),
                    "link": link,
                    "source": article.get("source", "Unknown"),
                    "_matched_symbol": article.get('_matched_symbol') 
                })

    logger.info(f"Total unique strict articles: {len(formatted_results)}")
    return formatted_results
