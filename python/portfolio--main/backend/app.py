import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse
import os
import logging
from datetime import datetime
from typing import Optional, List
import uuid
from pydantic import BaseModel

import pandas as pd
import shutil

# Import your Logic
from orchestrator import Orchestrator
from orchestrator import Orchestrator
from Portfolio_Analysis.WhatIf.whatif_orchestrator import WhatIfOrchestrator
from Portfolio_Analysis.Calculations.insights import generate_graph_insights
from File_Handler.user_file_handler import UserFileHandler
from Portfolio_Analysis.Calculations.repeated_calc import RepeatedCalc
from Portfolio_Analysis.Graphs import (
    Top_Performing, 
    Sector_Analysis, 
    Risk_Analysis, 
    Trade_Analysis, 
    Rebalancing,
    Turnover_Analysis,
    Probabilistic_Analysis,
    Stock_Deployed,
    Valuation_Analysis,
    Complex_Sunburst,
    Correlation_Plot
)

# --- Configuration ---
app = FastAPI(title="Portfolio Analytics Engine", default_response_class=ORJSONResponse)
logger = logging.getLogger("uvicorn")

# --- Performance Timing Middleware ---
import time
from starlette.middleware.base import BaseHTTPMiddleware

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = time.perf_counter() - start_time
        
        # Log slow requests (>500ms) as warnings, others as info
        log_msg = f"[API TIMING] {request.method} {request.url.path} - Code: {response.status_code} - Took: {process_time:.4f}s"
        if process_time > 0.5:
            logger.info(f"🐢 {log_msg}")
        else:
            logger.info(f"⚡ {log_msg}")
            
        return response

app.add_middleware(TimingMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
ALLOWED_EXTENSIONS = {".csv", ".xls", ".xlsx", ".json"}

def save_upload_file(file: UploadFile) -> str:
    """
    Save an UploadFile to disk and enforce allowed extension + max file size.
    Returns the saved file path.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {ALLOWED_EXTENSIONS}")

    safe_filename = os.path.basename(file.filename)
    timestamp = int(datetime.now().timestamp())
    file_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{safe_filename}")

    try:
        if hasattr(file, "file") and file.file is not None:
            try:
                file.file.seek(0)
            except Exception:
                pass
            with open(file_path, "wb") as buffer:
                chunk = file.file.read(1024 * 1024)
                while chunk:
                    buffer.write(chunk)
                    chunk = file.file.read(1024 * 1024)
        else:
            contents = file.file.read()
            with open(file_path, "wb") as buffer:
                buffer.write(contents)

        size = os.path.getsize(file_path)
        if size > MAX_FILE_SIZE:
            try:
                os.remove(file_path)
            except Exception:
                logger.warning("Failed to remove oversized temp file %s", file_path)
            raise HTTPException(status_code=400, detail=f"File too large. Max allowed size is {MAX_FILE_SIZE} bytes.")

        return file_path

    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                logger.warning("Could not remove temp file after save failure: %s", file_path)
        logger.exception("Failed to save uploaded file")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}

class PortfolioAnalysisRequest(BaseModel):
    transactions: List[dict]
    
    class Config:
        json_schema_extra = {
            "example": {
                "transactions": [
                    {
                        "universal_trade_id": "HIDDEN",
                        "Symbol": "RELIANCE",
                        "Scrip_Name": "RELIANCE INDUSTRIES LTD",
                        "Trade_execution_time": "2024-01-01 10:00:00",
                        "Order_Type": "B",
                        "Qty": 10.0,
                        "Mkt_Price": 2500.0,
                        "Amount": 25000.0,
                        "Exchange": "NSE",
                        "Series": "EQ",
                        "ISIN": "INE002A01018",
                        "Intraday_Flag": False
                    }
                ]
            }
        }

@app.post("/api/portfolio-analysis")
async def analyze_portfolio(payload: PortfolioAnalysisRequest):
    """
    Analyzes portfolio based on provided normalized transaction data (JSON).
    Input must be the output of /api/normalize-portfolio.
    """
    try:
        orc = Orchestrator()
        return orc.process_portfolio(transactions_data=payload.transactions)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in /api/portfolio-analysis: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/normalize-portfolio")
async def normalize_portfolio_endpoint(file: UploadFile = File(...)):
    """
    Endpoint to just normalize a portfolio file and return JSON.
    This JSON can be saved and re-uploaded to /api/portfolio-analysis.
    """
    file_path = None
    try:
        file_path = save_upload_file(file)
        # Use orchestrator to just normalize
        orc = Orchestrator()
        normalized_data = orc.normalize_portfolio(file_path)
        
        # Check for errors
        if isinstance(normalized_data, dict) and "error" in normalized_data:
             raise HTTPException(status_code=500, detail=normalized_data["error"])

        return normalized_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in /api/normalize-portfolio: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass
        try:
            await file.close()
        except Exception:
            pass
class NewsRequest(BaseModel):
    symbols: List[str]
    date: Optional[str] = None
    max_articles: Optional[int] = 12

@app.post("/api/news/portfolio-news")
async def portfolio_news_endpoint(payload: NewsRequest):
    """
    Lightweight endpoint for news fetching.
    Accepts a list of symbols instead of a file.
    """
    try:
        orchestrator = Orchestrator()
        news_data = orchestrator.fetch_news_direct(
            symbols=payload.symbols, 
            date_filter=payload.date, 
            max_articles=payload.max_articles
        )
        
        if isinstance(news_data, dict) and news_data.get("metadata", {}).get("error"):
            raise HTTPException(status_code=500, detail=news_data["metadata"]["error"])
            
        return news_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unhandled error in /api/news/portfolio-news: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

class BetaRequest(BaseModel):
    current_holdings: List[dict]
    benchmark: str = "Nifty 50"

@app.post("/api/calculate-beta")
async def calculate_beta_endpoint(payload: BetaRequest):
    """
    Dedicated endpoint for calculating portfolio beta with custom benchmark.
    Allows dynamic recalculation when user changes benchmark selection.
    """
    try:
        from metrics.beta import BetaCalculator
        
        normalized_portfolio = {
            'current_holdings': payload.current_holdings
        }
        
        # Use 730 days (2 years) for both daily and monthly beta
        beta_calculator = BetaCalculator(benchmark_symbol=payload.benchmark, lookback_days=730)
        beta_results = beta_calculator.calculate_portfolio_beta(normalized_portfolio, benchmark_symbol=payload.benchmark)
        
        return {
            "status": "success",
            "beta_metrics": beta_results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in /api/calculate-beta: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calculate-alpha")
async def calculate_alpha_endpoint(payload: BetaRequest):
    """
    Dedicated endpoint for calculating portfolio alpha with custom benchmark.
    """
    try:
        from metrics.beta import BetaCalculator
        from metrics.alpha import AlphaCalculator
        
        normalized_portfolio = {
            'current_holdings': payload.current_holdings
        }
        
        # 1. Calculate Beta first (Dependence)
        # Use 730 days for robust beta
        beta_calc = BetaCalculator(benchmark_symbol=payload.benchmark, lookback_days=730)
        beta_results = beta_calc.calculate_portfolio_beta(normalized_portfolio, benchmark_symbol=payload.benchmark)
        
        # 2. Calculate Alpha
        alpha_calc = AlphaCalculator(benchmark_symbol=payload.benchmark)
        
        betas = beta_results.get('daily_betas', {}).get('individual', {})
        
        individual_alphas = {}
        weighted_alpha_sum = 0
        total_weight = 0
        
        # Calculate weights based on payload quantities and prices
        # We need to compute total value first
        total_val = 0
        for h in payload.current_holdings:
            qty = float(h.get('quantity', 0))
            price = float(h.get('current_price', 0))
            total_val += qty * price
            
        for h in payload.current_holdings:
            sym = h.get('symbol')
            qty = float(h.get('quantity', 0))
            price = float(h.get('current_price', 0))
            val = qty * price
            weight = val / total_val if total_val > 0 else 0
            
            beta_val = betas.get(sym, {}).get('beta')
            
            if beta_val is not None:
                alpha_res = alpha_calc.calculate_alpha(sym, beta_val)
                individual_alphas[sym] = alpha_res
                
                if alpha_res.get('alpha') is not None:
                    weighted_alpha_sum += alpha_res['alpha'] * weight
                    total_weight += weight
        
        portfolio_alpha = weighted_alpha_sum / total_weight if total_weight > 0 else None
        
        alpha_metrics = {
            'portfolio_alpha': round(portfolio_alpha, 4) if portfolio_alpha is not None else None,
            'individual_alphas': individual_alphas,
            'risk_free_rate': alpha_calc.risk_free_rate,
            'benchmark': payload.benchmark
        }
        
        return {
            "status": "success",
            "alpha_metrics": alpha_metrics
        }
        
    except Exception as e:
        logger.exception("Error in /api/calculate-alpha: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calculate-ratios")
async def calculate_ratios_endpoint(payload: BetaRequest):
    """
    Dedicated endpoint for calculating portfolio risk ratios (Sharpe, Sortino, etc) with custom benchmark.
    """
    try:
        from metrics.ratios import RatioCalculator
        
        normalized_portfolio = {
            'current_holdings': payload.current_holdings
        }
        
        ratio_calc = RatioCalculator(benchmark_symbol=payload.benchmark)
        results = ratio_calc.calculate_ratios(normalized_portfolio)
        
        return {
            "status": "success",
            "ratio_metrics": results
        }
        
    except Exception as e:
        logger.exception("Error in /api/calculate-ratios: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

# --- What-If Simulation Endpoints ---

@app.post("/api/whatif/holdings-with-peers")
async def whatif_holdings_with_peers(payload: dict):
    """
    Get holdings enriched with sector/industry hierarchy and peers.
    """
    try:
        from Portfolio_Analysis.WhatIf.whatif_orchestrator import WhatIfOrchestrator
        current_holdings = payload.get('current_holdings', [])
        orchestrator = WhatIfOrchestrator()
        return orchestrator.get_holdings_with_peers(current_holdings)
    except Exception as e:
        logger.exception("Error in /api/whatif/holdings-with-peers")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/whatif/preview-swap")
async def whatif_preview_swap(payload: dict):
    """
    Get preview of swap mechanics (cost, quantity) without full sim.
    """
    try:
        from Portfolio_Analysis.WhatIf.whatif_orchestrator import WhatIfOrchestrator
        current_holdings = payload.get('current_holdings', [])
        swap_config = payload.get('swap_config', {})
        orchestrator = WhatIfOrchestrator()
        return orchestrator.preview_swap(current_holdings, swap_config)
    except Exception as e:
        logger.exception("Error in /api/whatif/preview-swap")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/whatif/simulate")
async def whatif_simulate(payload: dict):
    """
    Execute full simulation with metric recalculation and insights.
    """
    try:
        from Portfolio_Analysis.WhatIf.whatif_orchestrator import WhatIfOrchestrator
        current_holdings = payload.get('current_holdings', [])
        swap_config = payload.get('swap_config', {})
        orchestrator = WhatIfOrchestrator()
        return orchestrator.execute_simulation(current_holdings, swap_config)
    except Exception as e:
        logger.exception("Error in /api/whatif/simulate")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/whatif/batch-peers")
async def whatif_batch_peers(payload: dict):
    """
    Get flat list of peers for multiple symbols.
    """
    try:
        from Portfolio_Analysis.WhatIf.whatif_orchestrator import WhatIfOrchestrator
        symbols = payload.get('symbols', [])
        orchestrator = WhatIfOrchestrator()
        return orchestrator.get_batch_peers_flat(symbols)
    except Exception as e:
        logger.exception("Error in /api/whatif/batch-peers")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/graph/{graph_id}")
async def get_single_graph(
    graph_id: str,
    file: UploadFile = File(...),
    fd_rate: Optional[str] = Form(None),
    mf_rate: Optional[str] = Form(None),
    inflation_rate: Optional[str] = Form(None),
    target_symbol: Optional[str] = Form(None),
    swap_symbol: Optional[str] = Form(None)
):
    """
    On-demand graph generation endpoint.
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        handler = UserFileHandler(file_path)
        raw_transactions = handler.parse_file()
        
        if raw_transactions.empty:
            raise HTTPException(400, "Empty transaction file")

        from File_Handler.utils.Text_Normalisation import clean_scrip_names
        from File_Handler.utils.symbol_mapper import map_broker_scrips_by_compname
        
        transactions_clean = clean_scrip_names(raw_transactions)
        scrip_names = transactions_clean['Scrip_Name'].tolist()
        name_to_symbol = map_broker_scrips_by_compname(scrip_names)
        
        transactions_clean['Symbol'] = transactions_clean['Scrip_Name'].map(name_to_symbol).fillna(
            transactions_clean['Scrip_Name']
        )
        transactions_clean['Trade_Date'] = pd.to_datetime(transactions_clean['Trade_Date'])
        
        from Portfolio_Analysis.Calculations.repeated_calc import RepeatedCalc
        calculator = RepeatedCalc(transactions_clean)
        portfolio_df = calculator.calculate_results()
        
        # Graph registry
        from Portfolio_Analysis.Graphs import (
            Top_Performing, Probabilistic_Analysis,
            Sector_Analysis, Risk_Analysis,
            Trade_Analysis, Rebalancing, Valuation_Analysis, Complex_Sunburst,
            Stock_Deployed, Turnover_Analysis, Underwater_Analysis,
            Trade_Behavior, Correlation_Plot
        )

        graph_registry = {
            "top_performing": {
                "func": Top_Performing.top_10_Scrips_combined,
                "data_type": "portfolio",
                "title": "Top Performers",
                "description": "Identifies your best and worst performing stocks by absolute and percentage returns"
            },
            "trade_behavior": {
                "func": Trade_Behavior.analyze_trade_behavior,
                "data_type": "transactions",
                "title": "Trade Behavior",
                "description": "Validates your sell decisions and analyzes missed opportunities."
            },
            "portfolio_health": {
                "func": Stock_Deployed.stock_deployed_logic,
                "data_type": "both",
                "title": "Capital Deployment",
                "description": "Analyze pyramiding, timing efficiency, and capital traps over time"
            },
            "best_trade_prob": {
                "func": Probabilistic_Analysis.create_best_trade_plot,
                "data_type": "transactions",
                "title": "Best Trade Probability",
                "description": "Analyzes optimal holding periods based on historical win rates"
            },
            "industry_sunburst": {
                "func": Sector_Analysis.create_industry_sunburst,
                "data_type": "portfolio",
                "title": "Sector Distribution",
                "description": "Visualizes your portfolio's sector and industry allocation"
            },
            "risk_return": {
                "func": Risk_Analysis.classify_stocks_risk_return,
                "data_type": "portfolio",
                "title": "Risk-Return Matrix",
                "description": "Classifies stocks into risk-return quadrants for rebalancing insights"
            },
            "combined_box_plot": {
                "func": Turnover_Analysis.turnover_analysis_logic,
                "data_type": "both",
                "title": "Turnover Analysis",
                "description": "Statistical distribution of your holding periods and turnover patterns"
            },
            "trade_pnl_plot": {
                "func": Trade_Analysis.create_PNL_plot,
                "data_type": "transactions",
                "title": "P&L Timeline",
                "description": "Chronological view of all realized profits and losses"
            },
            "swot_analysis": {
                "func": Rebalancing.create_swot_plot,
                "data_type": "transactions",
                "title": "SWOT Analysis",
                "description": "Strategic analysis of portfolio strengths, weaknesses, opportunities, and threats"
            },
            "valuation_bubble": {
                "func": Valuation_Analysis.generate_combined_bubble_chart,
                "data_type": "portfolio",
                "title": "Valuation Metrics",
                "description": "Bubble chart comparing P/E, P/B, and market cap across holdings"
            },

            "underwater_plot": {
                "func": Underwater_Analysis.create_underwater_plot,
                "data_type": "portfolio",
                "title": "Underwater Plot",
                "description": "Visualizes portfolio drawdown from peaks and identifies major contributors to decline."
            },
            "correlation_plot": {
                "func": Correlation_Plot.create_correlation_heatmap,
                "data_type": "portfolio",
                "title": "Correlation Analysis",
                "description": "Heatmap showing price correlations with benchmarks and inter-stock relationships"
            },

        }

        if graph_id not in graph_registry:
            raise HTTPException(404, f"Graph '{graph_id}' not found")
            
        graph_config = graph_registry[graph_id]
        
        # Parse params
        kwargs = {}
        if graph_id == "swot_analysis":
             if fd_rate: kwargs['fd_rate'] = float(fd_rate)
             if mf_rate: kwargs['mf_rate'] = float(mf_rate)
             if inflation_rate: kwargs['inflation_rate'] = float(inflation_rate)

        
        if graph_config["data_type"] == "portfolio":
            graph_data = graph_config["func"](portfolio_df, **kwargs)
        elif graph_config["data_type"] == "transactions":
            graph_data = graph_config["func"](transactions_clean, **kwargs)
        elif graph_config["data_type"] == "both":
            graph_data = graph_config["func"](portfolio_df, transactions_clean, **kwargs)
            
        # Handle Insights
        insights = {}
        if isinstance(graph_data, dict) and "insights" in graph_data:
            insights = graph_data.pop("insights")
        
        if isinstance(graph_data, dict) and "metadata" in graph_data:
            graph_data.pop("metadata")
        elif not insights:
            insights = generate_graph_insights(graph_id, portfolio_df, transactions_clean)
            
        if os.path.exists(file_path):
            os.remove(file_path)
        await file.close()
        
        return {
            "status": "success",
            "graph_data": graph_data,
            "insights": insights,
            "metadata": {
                "title": graph_config["title"],
                "description": graph_config["description"],
                "generated_at": datetime.now().isoformat()
            }
        }

    except Exception as e:
        logger.error(f"Graph generation error: {str(e)}")
        raise HTTPException(500, str(e))

class WhatIfSimulateRequest(BaseModel):
    current_holdings: List[dict]
    source_symbol: Optional[str] = None
    target_symbol: Optional[str] = None
    action: str
    quantity: Optional[float] = 0.0
    amount: Optional[float] = 0.0
    current_metrics: Optional[dict] = None  # Portfolio metrics from main dashboard

@app.post("/api/what-if/simulate")
async def whatif_simulate(payload: WhatIfSimulateRequest):
    try:
        orc = WhatIfOrchestrator()
        # Convert Pydantic to dict
        swap_config = {
            "source_symbol": payload.source_symbol,
            "target_symbol": payload.target_symbol,
            "action": payload.action,
            "quantity": payload.quantity,
            "amount": payload.amount
        }
        result = orc.execute_simulation(
            payload.current_holdings, 
            swap_config,
            current_metrics=payload.current_metrics
        )
        return result
    except Exception as e:
         logger.exception("Error in /api/what-if/simulate")
         raise HTTPException(500, str(e))

@app.get("/api/what-if/peers/{symbol}")
async def whatif_peers(symbol: str):
    try:
        orc = WhatIfOrchestrator()
        result = orc.get_batch_peers_flat([symbol])
        if symbol in result:
             return result[symbol]
        return {"error": "Symbol not found", "peers": []}
    except Exception as e:
         logger.exception("Error in /api/what-if/peers")
         raise HTTPException(500, str(e))

@app.get("/api/what-if/sector-hierarchy/{symbol}")
async def whatif_hierarchy(symbol: str):
    try:
        orc = WhatIfOrchestrator()
        return orc.get_sector_hierarchy(symbol)
    except Exception as e:
         logger.exception("Error in /api/what-if/sector-hierarchy")
         raise HTTPException(500, str(e))

@app.get("/api/what-if/sectors")
async def whatif_all_sectors():
    try:
        orc = WhatIfOrchestrator()
        return orc.get_all_sectors()
    except Exception as e:
         logger.exception("Error in /api/what-if/sectors")
         raise HTTPException(500, str(e))

@app.get("/api/what-if/hierarchy/sector/{sector_name}")
async def whatif_hierarchy_by_sector(sector_name: str):
    try:
        orc = WhatIfOrchestrator()
        return orc.get_hierarchy_by_sector_name(sector_name)
    except Exception as e:
         logger.exception("Error in /api/what-if/hierarchy/sector")
         raise HTTPException(500, str(e))

@app.post("/api/what-if/enrich-holdings")
async def whatif_enrich_holdings(payload: dict):
    """
    Enrich holdings with sector and industry data from database.
    Expects: { "holdings": [...] }
    Returns: Enriched holdings list with sector/industry fields populated.
    """
    try:
        from Portfolio_Analysis.WhatIf.holdings_enricher import enrich_holdings_with_sector
        holdings = payload.get('holdings', [])
        enriched = enrich_holdings_with_sector(holdings)
        return {"holdings": enriched}
    except Exception as e:
         logger.exception("Error in /api/what-if/enrich-holdings")
         raise HTTPException(500, str(e))

@app.post("/api/whatif/batch-peers")
async def whatif_batch_peers_legacy(payload: NewsRequest): # Reuse NewsRequest for symbols list
     try:
        orc = WhatIfOrchestrator()
        return orc.get_batch_peers_flat(payload.symbols)
     except Exception as e:
         raise HTTPException(500, str(e))


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
