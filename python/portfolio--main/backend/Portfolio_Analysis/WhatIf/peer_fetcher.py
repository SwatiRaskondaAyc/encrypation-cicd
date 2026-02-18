import logging
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, desc

# Models
from mtm.orm.db_fundamentals.orm_models import Company_master, Industrymaster_Ex1
from mtm.orm.db_priceaction.orm_models import HistPA  # For Price
from mtm.orm.engine import SessionFundamentals, SessionPriceAction

logger = logging.getLogger(__name__)

class PeerFetcher:
    """
    Fetches peer stocks based on Industry/Sector classification.
    Also fetches current market price for simulation context.
    """

    def get_peer_stocks(self, symbol: str) -> dict:
        """
        Returns a dictionary containing:
        - 'sector': Sector name
        - 'industry': Industry name
        - 'peers': List of peer stocks [{symbol, name, current_price, market_cap}]
        """
        session_fund: Session = SessionFundamentals()
        session_price: Session = SessionPriceAction()
        
        try:
            # 1. Get Source Stock Details (Industry/Sector)
            # Fallback Logic: Try multiple identifiers
            source_stock = None
            
            # 1. Try Exact SYMBOL Match
            stmt = select(
                Company_master.SYMBOL,
                Company_master.SCRIP_NAME,
                Company_master.IND_CODE,
                Industrymaster_Ex1.Industry,
                Industrymaster_Ex1.Sector,
                Industrymaster_Ex1.Sector_code
            ).join(
                Industrymaster_Ex1, 
                Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
            ).where(
                Company_master.SYMBOL == symbol
            )
            source_stock = session_fund.execute(stmt).first()
            
            # 2. Try SCRIPCODE (if digit)
            if not source_stock and str(symbol).isdigit():
                 stmt = select(
                    Company_master.SYMBOL,
                    Company_master.SCRIP_NAME,
                    Company_master.IND_CODE,
                    Industrymaster_Ex1.Industry,
                    Industrymaster_Ex1.Sector,
                    Industrymaster_Ex1.Sector_code
                ).join(
                    Industrymaster_Ex1, 
                    Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
                ).where(
                    Company_master.SCRIPCODE == int(symbol)
                )
                 source_stock = session_fund.execute(stmt).first()

            # 3. Try Exact SCRIP_NAME or Partial Match
            if not source_stock:
                 stmt = select(
                    Company_master.SYMBOL,
                    Company_master.SCRIP_NAME,
                    Company_master.IND_CODE,
                    Industrymaster_Ex1.Industry,
                    Industrymaster_Ex1.Sector,
                    Industrymaster_Ex1.Sector_code
                ).join(
                    Industrymaster_Ex1, 
                    Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
                ).where(
                    Company_master.SCRIP_NAME == symbol
                )
                 source_stock = session_fund.execute(stmt).first()

            # 4. Try Partial Matches (Symbol or Name)
            if not source_stock:
                 stmt = select(
                    Company_master.SYMBOL,
                    Company_master.SCRIP_NAME,
                    Company_master.IND_CODE,
                    Industrymaster_Ex1.Industry,
                    Industrymaster_Ex1.Sector,
                    Industrymaster_Ex1.Sector_code
                ).join(
                    Industrymaster_Ex1, 
                    Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
                ).where(
                    (Company_master.SYMBOL.ilike(f"{symbol}%")) |
                    (Company_master.SCRIP_NAME.ilike(f"%{symbol}%"))
                ).limit(1)
                 source_stock = session_fund.execute(stmt).first()
            
            if not source_stock:
                return {"error": f"Stock {symbol} not found in master database."}
            
            ind_code = source_stock.IND_CODE
            sector = source_stock.Sector
            industry = source_stock.Industry
            
            # 2. Fetch Peers (Same Industry)
            # Limit to top 50 to avoid overwhelming UI
            peers_stmt = select(
                Company_master.SYMBOL,
                Company_master.SCRIP_NAME
            ).where(
                and_(
                    Company_master.IND_CODE == ind_code,
                    Company_master.SYMBOL != symbol, # Exclude self
                    Company_master.SERIES.in_(['EQ', 'BE']) # Only equity
                )
            ).limit(100)
            
            peers_result = session_fund.execute(peers_stmt).all()
            
            peer_symbols = [row.SYMBOL for row in peers_result]
            
            # 3. Fetch Prices for Peers (Batch)
            # Find latest date in HistPA first
            latest_date_stmt = select(HistPA.Date).order_by(desc(HistPA.Date)).limit(1)
            latest_date = session_price.execute(latest_date_stmt).scalar()
            
            prices_map = {}
            if latest_date:
                price_stmt = select(HistPA.Symbol, HistPA.Close).where(
                    and_(
                        HistPA.Date == latest_date,
                        HistPA.Symbol.in_(peer_symbols)
                    )
                )
                prices_res = session_price.execute(price_stmt).all()
                prices_map = {row.Symbol: row.Close for row in prices_res}
                
            # 4. Construct Result
            peers_list = []
            for row in peers_result:
                close_price = prices_map.get(row.SYMBOL, 0)
                # Filter out stocks with no recent trading data (price=0)
                if close_price > 0:
                    peers_list.append({
                        "symbol": row.SYMBOL,
                        "name": row.SCRIP_NAME,
                        "industry": industry, # Redundant but specified in req
                        "current_price": close_price
                    })
            
            # Sort alpha
            peers_list.sort(key=lambda x: x['symbol'])
            
            return {
                "source_symbol": symbol,
                "sector": sector,
                "industry": industry,
                "peers": peers_list
            }
            
        except Exception as e:
            logger.error(f"Error fetching peers for {symbol}: {e}")
            return {"error": str(e)}
        finally:
            if session_fund: session_fund.close()
            if session_price: session_price.close()

    def get_peers_by_sector_hierarchy(self, symbol: str) -> dict:
        """
        Returns peers organized by sector hierarchy.
        Structure: Sector -> Industries -> Stocks
        """
        session_fund: Session = SessionFundamentals()
        session_price: Session = SessionPriceAction()
        
        try:
            # 1. Get source stock details
            # 1. Get source stock details using reusable logic (copy-paste for now or refactor)
            # Re-implementing robustness here:
            
            source_stock = None
            
            # 1. Try Exact SYMBOL Match
            stmt = select(
                Company_master.SYMBOL,
                Company_master.IND_CODE,
                Industrymaster_Ex1.Industry,
                Industrymaster_Ex1.Sector,
                Industrymaster_Ex1.Sector_code
            ).join(
                Industrymaster_Ex1,
                Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
            ).where(
                Company_master.SYMBOL == symbol
            )
            source_stock = session_fund.execute(stmt).first()

            # 2. Try SCRIPCODE
            if not source_stock and str(symbol).isdigit():
                stmt = select(
                    Company_master.SYMBOL,
                    Company_master.IND_CODE,
                    Industrymaster_Ex1.Industry,
                    Industrymaster_Ex1.Sector,
                    Industrymaster_Ex1.Sector_code
                ).join(
                    Industrymaster_Ex1,
                    Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
                ).where(
                    Company_master.SCRIPCODE == int(symbol)
                )
                source_stock = session_fund.execute(stmt).first()

             # 3. Try SCRIP_NAME
            if not source_stock:
                stmt = select(
                    Company_master.SYMBOL,
                    Company_master.IND_CODE,
                    Industrymaster_Ex1.Industry,
                    Industrymaster_Ex1.Sector,
                    Industrymaster_Ex1.Sector_code
                ).join(
                    Industrymaster_Ex1,
                    Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
                ).where(
                    Company_master.SCRIP_NAME == symbol
                )
                source_stock = session_fund.execute(stmt).first()

            # 4. Partial
            if not source_stock:
                 stmt = select(
                    Company_master.SYMBOL,
                    Company_master.IND_CODE,
                    Industrymaster_Ex1.Industry,
                    Industrymaster_Ex1.Sector,
                    Industrymaster_Ex1.Sector_code
                ).join(
                    Industrymaster_Ex1, 
                    Company_master.IND_CODE == Industrymaster_Ex1.Ind_code
                ).where(
                    (Company_master.SYMBOL.ilike(f"{symbol}%")) |
                    (Company_master.SCRIP_NAME.ilike(f"%{symbol}%"))
                ).limit(1)
                 source_stock = session_fund.execute(stmt).first()
            if not source_stock:
                return {"error": f"Stock {symbol} not found"}
            
            sector_code = source_stock.Sector_code
            source_sector = source_stock.Sector
            source_industry = source_stock.Industry
            
            # 2. Get all industries in the same sector
            industries_stmt = select(
                Industrymaster_Ex1.Ind_code,
                Industrymaster_Ex1.Industry
            ).where(
                Industrymaster_Ex1.Sector_code == sector_code
            ).distinct()
            
            industries = session_fund.execute(industries_stmt).all()
            
            # 3. Get latest price date
            latest_date_stmt = select(HistPA.Date).order_by(desc(HistPA.Date)).limit(1)
            latest_date = session_price.execute(latest_date_stmt).scalar()
            
            # 4. Build hierarchy
            hierarchy = {
                "source_symbol": symbol,
                "sector": source_sector,
                "industry": source_industry,
                "peers_by_sector": {}
            }
            
            for ind_code, industry_name in industries:
                # Get stocks in this industry
                stocks_stmt = select(
                    Company_master.SYMBOL,
                    Company_master.SCRIP_NAME
                ).where(
                    and_(
                        Company_master.IND_CODE == ind_code,
                        # Company_master.SYMBOL != symbol, # Include self so it appears in list
                        Company_master.SERIES.in_(['EQ']) # User preference
                    )
                ).order_by(Company_master.SYMBOL).limit(200)
                
                stocks = session_fund.execute(stocks_stmt).all()
                stock_symbols = [s.SYMBOL for s in stocks]
                
                # Get prices
                prices_map = {}
                if latest_date and stock_symbols:
                    price_stmt = select(HistPA.Symbol, HistPA.Close).where(
                        and_(
                            HistPA.Date == latest_date,
                            HistPA.Symbol.in_(stock_symbols)
                        )
                    )
                    prices_res = session_price.execute(price_stmt).all()
                    prices_map = {row.Symbol: row.Close for row in prices_res}
                
                # Build stock list
                stock_list = []
                for stock in stocks:
                    price = prices_map.get(stock.SYMBOL, 0)
                    if price > 0:
                        stock_list.append({
                            "symbol": stock.SYMBOL,
                            "name": stock.SCRIP_NAME,
                            "current_price": price
                        })
                
                if stock_list:
                    if source_sector not in hierarchy["peers_by_sector"]:
                        hierarchy["peers_by_sector"][source_sector] = {}
                    hierarchy["peers_by_sector"][source_sector][industry_name] = stock_list
            
            return hierarchy
            
        except Exception as e:
            logger.error(f"Error fetching sector hierarchy for {symbol}: {e}")
            return {"error": str(e)}
        finally:
            if session_fund: session_fund.close()
            if session_price: session_price.close()
    
    def get_batch_peers(self, symbols: list) -> dict:
        """
        Fetch peers for multiple symbols at once.
        Returns a map of symbol -> peer data.
        """
        result = {}
        for symbol in symbols:
            peer_data = self.get_peer_stocks(symbol)
            if "error" not in peer_data:
                result[symbol] = peer_data
        return result

    def get_all_sectors(self) -> list:
        """Fetch all unique sectors from the database."""
        session_fund: Session = SessionFundamentals()
        try:
            stmt = select(Industrymaster_Ex1.Sector).distinct().order_by(Industrymaster_Ex1.Sector)
            sectors = session_fund.execute(stmt).scalars().all()
            return [s for s in sectors if s]
        except Exception as e:
            logger.error(f"Error fetching all sectors: {e}")
            return []
        finally:
            if session_fund: session_fund.close()

    def get_hierarchy_by_sector(self, sector_name: str) -> dict:
        """
        Returns hierarchy for a specific sector.
        Structure: Sector -> Industries -> Stocks
        """
        session_fund: Session = SessionFundamentals()
        session_price: Session = SessionPriceAction()
        try:
            # 1. Get Sector Code (any matching)
            # Actually we can just query by Sector name directly
            
            # 2. Get industries in this sector
            industries_stmt = select(
                Industrymaster_Ex1.Ind_code,
                Industrymaster_Ex1.Industry
            ).where(
                Industrymaster_Ex1.Sector == sector_name
            ).distinct()
            
            industries = session_fund.execute(industries_stmt).all()
            
            # 3. Get latest price date
            latest_date_stmt = select(HistPA.Date).order_by(desc(HistPA.Date)).limit(1)
            latest_date = session_price.execute(latest_date_stmt).scalar()
            
            hierarchy = {
                "source_symbol": None, # No source symbol when browsing by sector
                "sector": sector_name,
                "peers_by_sector": {sector_name: {}}
            }
            
            for ind_code, industry_name in industries:
                # Get stocks
                stocks_stmt = select(
                    Company_master.SYMBOL,
                    Company_master.SCRIP_NAME
                ).where(
                    and_(
                        Company_master.IND_CODE == ind_code,
                        Company_master.SERIES.in_(['EQ'])
                    )
                ).order_by(Company_master.SYMBOL).limit(200)
                
                stocks = session_fund.execute(stocks_stmt).all()
                stock_symbols = [s.SYMBOL for s in stocks]
                
                # Get prices
                prices_map = {}
                if latest_date and stock_symbols:
                    price_stmt = select(HistPA.Symbol, HistPA.Close).where(
                        and_(
                            HistPA.Date == latest_date,
                            HistPA.Symbol.in_(stock_symbols)
                        )
                    )
                    prices_res = session_price.execute(price_stmt).all()
                    prices_map = {row.Symbol: row.Close for row in prices_res}
                
                stock_list = []
                for stock in stocks:
                    price = prices_map.get(stock.SYMBOL, 0)
                    if price > 0:
                        stock_list.append({
                            "symbol": stock.SYMBOL,
                            "name": stock.SCRIP_NAME,
                            "current_price": price
                        })
                
                if stock_list:
                    hierarchy["peers_by_sector"][sector_name][industry_name] = stock_list
            
            return hierarchy
        except Exception as e:
            logger.error(f"Error fetching hierarchy for sector {sector_name}: {e}")
            return {"error": str(e)}
        finally:
            if session_fund: session_fund.close()
            if session_price: session_price.close()
