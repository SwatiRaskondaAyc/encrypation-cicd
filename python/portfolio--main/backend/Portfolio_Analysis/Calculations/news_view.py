import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import re

# --- Repo Imports ---
from mtm.repo.price_action import PriceAction
from .news_fetcher import fetch_portfolio_news

logger = logging.getLogger(__name__)

# Keywords (Same as before)
BULLISH_KEYWORDS = {
    'surge', 'jump', 'rally', 'record', 'high', 'profit', 'growth', 'beat', 'outperform',
    'buy', 'upgrade', 'dividend', 'acquisition', 'merger', 'launch', 'approval', 'green',
    'soar', 'gain', 'climb', 'bull', 'optimistic', 'strong', 'revenue up', 'bonus',
    'split', 'deal', 'contract', 'partnership', 'breakout', 'recover', 'positive',
    'win', 'award', 'leader', 'dominance', 'boom', 'skyrocket', 'multibagger'
}

BEARISH_KEYWORDS = {
    'crash', 'slump', 'fall', 'drop', 'loss', 'miss', 'down', 'downgrade', 'sell',
    'debt', 'lawsuit', 'fine', 'penalty', 'ban', 'regulation', 'red', 'plunge',
    'slide', 'weak', 'recession', 'bear', 'pessimistic', 'decline', 'revenue down',
    'layoff', 'fire', 'scam', 'fraud', 'investigation', 'default', 'bankruptcy',
    'insolvency', 'negative', 'fail', 'risk', 'inflation', 'pressure', 'warning'
}

def analyze_sentiment(text: str) -> Optional[str]:
    text_lower = text.lower()
    words = set(re.findall(r'\w+', text_lower))
    bull = sum(1 for w in words if w in BULLISH_KEYWORDS)
    bear = sum(1 for w in words if w in BEARISH_KEYWORDS)
    if bull > 0 and bear == 0: return 'Bullish'
    if bear > 0 and bull == 0: return 'Bearish'
    return None

def parse_article_date(date_str):
    if not date_str: return None
    try:
        now = datetime.now()
        date_lower = str(date_str).lower()
        if "min" in date_lower:
            mins = int(re.search(r'\d+', date_lower).group())
            return now - timedelta(minutes=mins)
        if "hour" in date_lower:
            hours = int(re.search(r'\d+', date_lower).group())
            return now - timedelta(hours=hours)
        if "day" in date_lower:
            days = int(re.search(r'\d+', date_lower).group())
            return now - timedelta(days=days)
        if "yesterday" in date_lower:
            return now - timedelta(days=1)
        for fmt in ['%Y-%m-%d', '%d-%m-%Y', '%b %d, %Y', '%Y-%m-%dT%H:%M:%S']:
            try: return datetime.strptime(date_str, fmt)
            except: continue
        return None
    except:
        return None

def generate_news_view(symbols: List[str], date_filter: Optional[str] = None, max_articles: int = 30 ) -> Dict:
    try:
        # 1. Prices
        price_fetcher = PriceAction(symbols=symbols)
        latest_prices = price_fetcher.Get_Latest_Price(symbols=symbols)
        symbol_prices = {}
        if isinstance(latest_prices, list):
            for item in latest_prices:
                symbol_prices[item.get('Symbol')] = {'current_price': round(item.get('Close', 0), 2)}
        elif isinstance(latest_prices, dict) and latest_prices:
            symbol_prices[latest_prices.get('Symbol')] = {'current_price': round(latest_prices.get('Close', 0), 2)}

        # 2. Fetch News (New logic)
        raw_articles = fetch_portfolio_news(
            symbols=symbols, 
            target_date=date_filter, 
            max_articles_per_batch=15
        )

        enriched_articles = []
        for article in raw_articles:
            full_text = f"{article.get('headline', '')} {article.get('subtitle', '')}"
            sentiment = analyze_sentiment(full_text)
            matched_symbol_str = article.get('_matched_symbol')
            
            unique_matches = {}
            if matched_symbol_str:
                unique_matches[matched_symbol_str] = {
                    'symbol': matched_symbol_str,
                    'current_price': symbol_prices.get(matched_symbol_str, {}).get('current_price', 0)
                }
            
            # Additional fuzzy matches
            text_lower = full_text.lower()
            for sym in symbols:
                if sym != matched_symbol_str and sym.lower() in text_lower:
                     unique_matches[sym] = {
                        'symbol': sym,
                        'current_price': symbol_prices.get(sym, {}).get('current_price', 0)
                    }
            
            article_date = parse_article_date(article.get('date'))

            enriched_articles.append({
                'id': hash(article.get('link', '')),
                'headline': article.get('headline'),
                'subtitle': article.get('subtitle'),
                'source': article.get('source'),
                'published_date': (article_date.strftime('%d %b %Y') if article_date else article.get('date')),
                'published_time': (article_date.strftime('%I:%M %p') if article_date else ''),
                'image_url': article.get('image_url'),
                'article_link': article.get('link'),
                'sentiment': sentiment,
                'matched_symbols': list(unique_matches.values())
            })

        # 3. Sort: Absolute Newest First
        def get_date_sort_key(x):
            try: return datetime.strptime(x['published_date'] + ' ' + x['published_time'], '%d %b %Y %I:%M %p')
            except: 
                try: return datetime.strptime(x['published_date'], '%d %b %Y')
                except: return datetime.min

        enriched_articles.sort(key=get_date_sort_key, reverse=True)

        return {
            'articles': enriched_articles[:max_articles], # Top N newest across ALL stocks
            'metadata': {'date_filter': date_filter or "Last 24 Hours"}
        }

    except Exception as e:
        logger.error(f"News Gen Error: {e}")
        return {'articles': [], 'metadata': {'error': str(e)}}
