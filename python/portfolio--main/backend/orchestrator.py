
import pandas as pd
import json
import logging
import traceback
from datetime import datetime
from typing import Optional
import numpy as np
import time

# --- Local Imports ---
from File_Handler.user_file_handler import UserFileHandler
from File_Handler.utils.Text_Normalisation import clean_scrip_names
from File_Handler.utils.symbol_mapper import map_broker_scrips_by_compname
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.id_generator import generate_universal_trade_id
from File_Handler.utils.intraday_logic import calculate_intraday_flag
from File_Handler.utils.db_enrichment import enrich_trade_data

# --- Calculation Engine ---
from Portfolio_Analysis.Calculations.repeated_calc import RepeatedCalc
# from Portfolio_Analysis.Calculations.portfolio_metrics import PortfolioMetrics  # REMOVED - Starting fresh
from metrics.beta import BetaCalculator

# --- Graph Modules ---
from Portfolio_Analysis.Graphs.Top_Performing import top_10_Scrips_combined
from Portfolio_Analysis.Graphs.Stock_Deployed import stock_deployed_logic
from Portfolio_Analysis.Graphs.Probabilistic_Analysis import create_best_trade_plot
from Portfolio_Analysis.Graphs.Sector_Analysis import create_industry_sunburst
from Portfolio_Analysis.Graphs.Risk_Analysis import classify_stocks_risk_return
from Portfolio_Analysis.Graphs.Turnover_Analysis import turnover_analysis_logic
from Portfolio_Analysis.Graphs.Trade_Analysis import create_PNL_plot
from Portfolio_Analysis.Graphs.Rebalancing import create_swot_plot
from Portfolio_Analysis.Graphs.Valuation_Analysis import generate_combined_bubble_chart
from Portfolio_Analysis.Graphs.Complex_Sunburst import create_user_sunburst_with_dropdown
from Portfolio_Analysis.Graphs.Underwater_Analysis import create_underwater_plot
from Portfolio_Analysis.Graphs.Correlation_Plot import create_correlation_heatmap


# --- Insight Module ---
from Portfolio_Analysis.Calculations.insights import get_portfolio_summary
from Portfolio_Analysis.Calculations.ledger_view import generate_ledger_view
from Portfolio_Analysis.Calculations.news_view import generate_news_view
from Portfolio_Analysis.WhatIf.holdings_enricher import enrich_holdings_with_sector

from concurrent.futures import ThreadPoolExecutor, as_completed
import os

logger = logging.getLogger(__name__)

def normalize_date_to_ddmmyyyy(in_date: Optional[str]) -> Optional[str]:
    """
    Accepts either DD-MM-YYYY or YYYY-MM-DD or None.
    Returns DD-MM-YYYY (string) or None.
    """
    if not in_date:
        return None
    s = in_date.strip()
    try:
        if "-" in s and len(s.split("-")[0]) == 4:
            parsed = datetime.strptime(s, "%Y-%m-%d")
            return parsed.strftime("%d-%m-%Y")
    except Exception:
        pass
    try:
        datetime.strptime(s, "%d-%m-%Y")
        return s
    except Exception:
        logger.warning(f"normalize_date_to_ddmmyyyy: Unrecognized date format '{in_date}', passing as-is.")
        return s

class Orchestrator:
    """
    The central controller that coordinates:
    1. File Parsing (UserFileHandler)
    2. Data Cleaning (Text_Normalisation)
    3. Financial Calculation (RepeatedCalc)
    4. Visualization Generation (Graph Modules)
    5. News Feed Generation (News Module)
    6. Final Response Packaging
    """

    def normalize_portfolio(self, file_path: str):
        """
        Public method execution for the /api/normalize-portfolio endpoint.
        Returns the simplified JSON structure of the parsed file.
        """
        try:
            logger.info(f"Normalizing portfolio file: {file_path}")
            df_normalized = self._get_normalized_dataframe(file_path)
            
            # Convert to list of dicts for JSON response
            # Utilize pandas native to_json which handles NaNs and Dates robustly
            print("Converting dataframe to JSON string (pandas native)...")
            json_str = df_normalized.to_json(orient='records', date_format='iso')
            print("Parsing back to list of dicts...")
            serialized = json.loads(json_str)
            print("Serialization complete.")
            return serialized
            
        except Exception as e:
            logger.error(f"Normalization Error: {str(e)}")
            trace_str = traceback.format_exc()
            logger.error(trace_str)
            print(f"CRITICAL ERROR in normalize_portfolio: {e}")
            print(trace_str)
            return {"error": f"{str(e)}\n\n{trace_str}"}

    def _get_normalized_dataframe(self, file_path: str) -> pd.DataFrame:
        """
        Internal helper to parse, clean, and enrich the raw file into a standardized DataFrame.
        """
        # 1. Parse File
        handler = UserFileHandler(file_path)
        df_raw = handler.parse_file()
        print(f"DEBUG: df_raw columns: {df_raw.columns.tolist()}")
        
        # 2. Text Normalization
        df_clean = clean_scrip_names(df_raw)
        print(f"DEBUG: df_clean columns: {df_clean.columns.tolist()}")
        
        # 3. Symbol Mapping
        if 'Scrip_Name' not in df_clean.columns:
            logger.error(f"Missing 'Scrip_Name' column in normalized data. Columns: {df_clean.columns.tolist()}")
            raise KeyError("Scrip_Name column missing. Please ensure your file contains a scrip/stock name column.")

        # Extract unique scrip names
        scrips = df_clean['Scrip_Name'].unique().tolist()
        mapping = map_broker_scrips_by_compname(scrips)
        
        # Apply mapping
        df_clean['Symbol'] = df_clean['Scrip_Name'].map(mapping).fillna(df_clean['Scrip_Name'])
        
        # 4. Intraday Logic
        df_clean = calculate_intraday_flag(df_clean)
        
        # 5. ID Generation
        df_clean = generate_universal_trade_id(df_clean)
        
        # 6. DB Enrichment (Optional but recommended for Sector/MarketCap)
        # Note: We do NOT filter for 'Active' here, we keep full history for ledger
        try:
             df_clean = enrich_trade_data(df_clean)
        except Exception as e:
             logger.warning(f"Enrichment partial failure or skip: {e}")
             
        # Ensure Trade_Date is datetime for downstream consistency
        if 'Trade_Date' in df_clean.columns:
            df_clean['Trade_Date'] = pd.to_datetime(df_clean['Trade_Date']).dt.normalize()
            
        return df_clean

    def process_portfolio(self, file_path: str = None, graph_types: list = None, transactions_data: list = None):
        """
        Main entry point for portfolio analysis.
        Accepts either a file_path (legacy/full flow) or transactions_data (direct JSON input).
        """
        response = {
            "status": "success",
            "portfolio_summary": {},
            "graphs": {},
            "ledger": {},
            "news": {},
            "errors": []
        }

        try:
            # ---------------------------------------------------------
            # 1. & 2. Ingest, Parse & Clean (Refactored)
            # ---------------------------------------------------------
            t_start_total = time.perf_counter()
            t_start_parse = time.perf_counter()

            if transactions_data:
                logger.info("Processing from provided transaction data (skipping file parsing).")
                transactions_clean = pd.DataFrame(transactions_data)
                
                # Ensure Date columns are actual timestamps
                if 'Trade_Date' in transactions_clean.columns:
                    transactions_clean['Trade_Date'] = pd.to_datetime(transactions_clean['Trade_Date'])
                if 'Trade_execution_time' in transactions_clean.columns:
                    transactions_clean['Trade_execution_time'] = pd.to_datetime(transactions_clean['Trade_execution_time'])
                    # Fallback: If Trade_Date missing, derive from execution time
                    if 'Trade_Date' not in transactions_clean.columns:
                         transactions_clean['Trade_Date'] = transactions_clean['Trade_execution_time']
                
                if 'Trade_Date' in transactions_clean.columns:
                     transactions_clean['Trade_Date'] = pd.to_datetime(transactions_clean['Trade_Date'])

            else:
                if not file_path:
                    raise ValueError("Either file_path or transactions_data must be provided.")
                transactions_clean = self._get_normalized_dataframe(file_path)
            
            # --- CRITICAL: SORT TRANSACTIONS FOR FIFO ---
            # Ensure chronological order (and Buy before Sell for same-day)
            sort_by = ['Trade_Date', 'Order_Type']
            if 'Trade_Date' not in transactions_clean.columns and 'Trade_execution_time' in transactions_clean.columns:
                 # If we still don't have Trade_Date, use execution time
                 transactions_clean['Trade_Date'] = transactions_clean['Trade_execution_time']
            
            if 'Trade_Date' in transactions_clean.columns:
                transactions_clean.sort_values(by=['Trade_Date', 'Order_Type'], ascending=[True, True], inplace=True)
            else:
                # Last resort fallback if neither exists (should not happen due to validation)
                logger.warning("Trade_Date missing for sorting, skipping sort.")
            
            logger.info(f"[TIMING] 📂 Ingest & Parse took: {time.perf_counter() - t_start_parse:.4f}s")


            
            # ---------------------------------------------------------
            # 3. Calculate Portfolio History (The Engine)

            # ---------------------------------------------------------
            logger.info("Running RepeatedCalc engine...")
            t_start_calc = time.perf_counter()
            calculator = RepeatedCalc(transactions_clean)
            
            # Run calculations ONCE
            portfolio_fifo_results_df = calculator.calculate_results()  # Time-series history
            fifo_closed_trades = calculator.get_fifo_table()
            current_holdings_snapshot = calculator.get_current_holdings()

            logger.info(f"[TIMING] 🧮 Calculation Engine took: {time.perf_counter() - t_start_calc:.4f}s")

            # --- ENRICH WITH METRICS (Expanded for Redesign) ---
            # REMOVED - Starting fresh with portfolio metrics implementation
            # try:
            #     # Use current holdings symbols to fetch/calculate metrics
            #     if not current_holdings_snapshot.empty:
            #         symbols = current_holdings_snapshot['Symbol'].unique().tolist()
            #         
            #         # Calculate weights map for aggregation
            #         # Use Market Value from snapshot
            #         weights_map = {}
            #         if 'Current_Value' in current_holdings_snapshot.columns:
            #             total_mv = current_holdings_snapshot['Current_Value'].sum()
            #             if total_mv > 0:
            #                 for _, row in current_holdings_snapshot.iterrows():
            #                     weights_map[row['Symbol']] = row['Current_Value'] / total_mv
            #         
            #         # Calculate Comprehensive Metrics (Tuple Return)
            #         # FAST MODE: Disable Rolling Graphs and Factors for initial load
            #         enriched_df, portfolio_metrics_agg = PortfolioMetrics.calculate_risk_return_metrics_bulk(
            #             symbols, 
            #             include_factors=False,
            #             weights=weights_map,
            #             rolling_metrics=False
            #         )
            #         
            #         # 1. Expose Portfolio Level Metrics (Cubes)
            #         response['portfolio_metrics'] = portfolio_metrics_agg
            #         
            #         if not enriched_df.empty:
            #             # 2. Expose Individual Enriched Holdings (Table)
            #             metrics_reset = enriched_df.reset_index()
            #             if 'Symbol' not in metrics_reset.columns:
            #                 metrics_reset['Symbol'] = metrics_reset.index
            #                 
            #             response['holdings_metrics'] = metrics_reset.to_dict(orient='records')
            #             
            #             # 3. Merge into main DF for legacy graphs validity
            #             # Broadcast match on Symbol
            #             portfolio_fifo_results_df = portfolio_fifo_results_df.merge(
            #                 metrics_reset,
            #                 on='Symbol',
            #                 how='left',
            #                 suffixes=('', '_new')
            #             )
            #             # Resolve overlaps
            #             for col in metrics_reset.columns:
            #                  if col != 'Symbol' and col + '_new' in portfolio_fifo_results_df.columns:
            #                      portfolio_fifo_results_df[col] = portfolio_fifo_results_df[col + '_new'].fillna(portfolio_fifo_results_df[col])
            #                      portfolio_fifo_results_df.drop(columns=[col + '_new'], inplace=True)
            #         else:
            #             response['holdings_metrics'] = []
            #
            # except Exception as metric_e:
            #     logger.error(f"Metrics enrichment failed: {metric_e}")
            #     import traceback
            #     logger.error(traceback.format_exc())
            
            # Placeholder: Portfolio metrics will be reimplemented from scratch
            response['portfolio_metrics'] = {}
            response['holdings_metrics'] = []
            
            # --- PARALLEL METRICS CALCULATION FOR IMPROVED PERFORMANCE ---
            # All metrics calculations will run in parallel to reduce loading time
            def calculate_beta_metrics():
                """Calculate beta metrics in parallel"""
                try:
                    if current_holdings_snapshot.empty:
                        return {
                            'daily_betas': {'individual': {}, 'portfolio_beta': None, 'portfolio_metadata': {}},
                            'monthly_betas': {'individual': {}, 'portfolio_beta': None, 'portfolio_metadata': {}},
                            'benchmark': "Nifty 50"
                        }
                    
                    logger.info(f"Calculating Beta metrics for {len(current_holdings_snapshot)} holdings...")
                    current_holdings_json = [
                        {
                            'symbol': holding.get('Symbol'),
                            'quantity': holding.get('Qty', 0),
                            'current_price': holding.get('Mkt_Price', 0)
                        }
                        for _, holding in current_holdings_snapshot.iterrows()
                    ]
                    
                    normalized_portfolio = {'current_holdings': current_holdings_json}
                    benchmark = "Nifty 50"
                    beta_calculator = BetaCalculator(benchmark_symbol=benchmark, lookback_days=365)
                    beta_results = beta_calculator.calculate_portfolio_beta(normalized_portfolio, benchmark_symbol=benchmark)
                    logger.info(f"Beta calculation complete")
                    return beta_results
                except Exception as e:
                    logger.error(f"Beta calculation failed: {e}")
                    return {
                        'daily_betas': {'individual': {}, 'portfolio_beta': None, 'portfolio_metadata': {}},
                        'monthly_betas': {'individual': {}, 'portfolio_beta': None, 'portfolio_metadata': {}},
                        'benchmark': "Nifty 50"
                    }
            
            def calculate_alpha_metrics(beta_results):
                """Calculate alpha metrics (depends on beta)"""
                try:
                    from metrics.alpha import AlphaCalculator
                    if current_holdings_snapshot.empty or not beta_results:
                        return {}
                    
                    logger.info("Calculating Alpha metrics...")
                    alpha_calc = AlphaCalculator(benchmark_symbol="Nifty 50")
                    betas = beta_results.get('daily_betas', {}).get('individual', {})
                    
                    individual_alphas = {}
                    weighted_alpha_sum = 0
                    total_weight = 0
                    total_val = (current_holdings_snapshot['Mkt_Price'] * current_holdings_snapshot['Qty']).sum()
                    
                    for _, row in current_holdings_snapshot.iterrows():
                        sym = row['Symbol']
                        val = row['Mkt_Price'] * row['Qty']
                        weight = val / total_val if total_val > 0 else 0
                        beta_val = betas.get(sym, {}).get('beta')
                        
                        if beta_val is not None:
                            alpha_res = alpha_calc.calculate_alpha(sym, beta_val)
                            individual_alphas[sym] = alpha_res
                            if alpha_res.get('alpha') is not None:
                                weighted_alpha_sum += alpha_res['alpha'] * weight
                                total_weight += weight
                    
                    portfolio_alpha = weighted_alpha_sum / total_weight if total_weight > 0 else None
                    logger.info(f"Alpha calculation complete")
                    return {
                        'portfolio_alpha': round(portfolio_alpha, 4) if portfolio_alpha is not None else None,
                        'individual_alphas': individual_alphas,
                        'risk_free_rate': alpha_calc.risk_free_rate
                    }
                except Exception as e:
                    logger.error(f"Alpha calculation failed: {e}")
                    return {'error': str(e)}
            
            def calculate_ratio_metrics():
                """Calculate risk ratios in parallel"""
                try:
                    from metrics.ratios import RatioCalculator
                    if current_holdings_snapshot.empty:
                        return {}
                    
                    logger.info("Calculating Portfolio Risk Ratios...")
                    ratio_calc = RatioCalculator(benchmark_symbol="Nifty 50")
                    norm_port = {
                        'current_holdings': [
                            {
                                'symbol': row['Symbol'],
                                'quantity': row['Qty'],
                                'current_price': row['Mkt_Price']
                            }
                            for _, row in current_holdings_snapshot.iterrows()
                        ]
                    }
                    ratio_results = ratio_calc.calculate_ratios(norm_port)
                    logger.info("Ratio calculation complete")
                    return ratio_results
                except Exception as e:
                    logger.error(f"Ratio calculation failed: {e}")
                    return {'error': str(e)}
            
            def calculate_valuation_metrics():
                """Calculate valuation metrics in parallel"""
                try:
                    from metrics.valuation import ValuationCalculator
                    if current_holdings_snapshot.empty:
                        return {}
                    
                    logger.info("Calculating Portfolio Valuation Metrics...")
                    valuation_calc = ValuationCalculator()
                    norm_port = {
                        'current_holdings': [
                            {
                                'symbol': row['Symbol'],
                                'quantity': row['Qty'],
                                'current_price': row['Mkt_Price']
                            }
                            for _, row in current_holdings_snapshot.iterrows()
                        ]
                    }
                    valuation_results = valuation_calc.calculate_portfolio_valuation(norm_port)
                    logger.info("Valuation calculation complete")
                    return valuation_results
                except Exception as e:
                    logger.error(f"Valuation calculation failed: {e}")
                    return {'error': str(e)}
            
            def calculate_dividend_income():
                """Calculate dividend income in parallel"""
                try:
                    from metrics.valuation import ValuationCalculator
                    if current_holdings_snapshot.empty or transactions_clean.empty:
                        return {
                            'total_dividend_earned': 0,
                            'by_stock': {},
                            'by_quarter': {}
                        }
                    
                    logger.info("Calculating Dividend Income...")
                    valuation_calc = ValuationCalculator()
                    dividend_results = valuation_calc.calculate_dividend_income(
                        transactions_clean, 
                        current_holdings_snapshot
                    )
                    logger.info(f"Dividend calculation complete")
                    return dividend_results
                except Exception as e:
                    logger.error(f"Dividend income calculation failed: {e}")
                    return {'error': str(e)}
            
            # Execute metrics calculations in parallel
            logger.info("Starting parallel metrics calculations...")
            t_start_metrics = time.perf_counter()
            logger.info(f"Metrics Input Data Shape - Holdings: {current_holdings_snapshot.shape}, Transactions: {transactions_clean.shape}")
            
            with ThreadPoolExecutor(max_workers=4) as metrics_executor:
                # Submit independent tasks
                beta_future = metrics_executor.submit(calculate_beta_metrics)
                ratio_future = metrics_executor.submit(calculate_ratio_metrics)
                valuation_future = metrics_executor.submit(calculate_valuation_metrics)
                dividend_future = metrics_executor.submit(calculate_dividend_income)
                
                # Wait for beta to complete first (alpha depends on it)
                beta_results = beta_future.result()
                logger.info(f"Beta Results Keys: {list(beta_results.keys()) if isinstance(beta_results, dict) else 'Not Dict'}")
                response['beta_metrics'] = beta_results
                
                # Now calculate alpha using beta results
                alpha_future = metrics_executor.submit(calculate_alpha_metrics, beta_results)
                
                # Collect all remaining results
                response['ratio_metrics'] = ratio_future.result()
                response['valuation_metrics'] = valuation_future.result()
                dividend_results = dividend_future.result()
                response['alpha_metrics'] = alpha_future.result()
                
                # Add dividend to valuation metrics
                if isinstance(response['valuation_metrics'], dict):
                    response['valuation_metrics']['dividend_income'] = dividend_results
                else:
                    response['dividend_income'] = dividend_results
            
            logger.info("All metric calculations complete")
            logger.info(f"[TIMING] 🔢 Parallel Metrics Calculation took: {time.perf_counter() - t_start_metrics:.4f}s")


            # Store current holdings in ledger for frontend
            if not current_holdings_snapshot.empty:
                # Add Current_Price alias for frontend compatibility
                holdings_for_frontend = current_holdings_snapshot.copy()
                holdings_for_frontend['Current_Price'] = holdings_for_frontend['Mkt_Price']
                response['ledger']['holdings'] = holdings_for_frontend.to_dict(orient='records')
            else:
                response['ledger']['holdings'] = []

            GRAPH_MAX_WORKERS = int(os.getenv("GRAPH_MAX_WORKERS", "4"))

            # 4. Generate Insights (Cards) - run in a small threadpool
            try:
                t_start_insights = time.perf_counter()
                logger.info("Generating insights (parallel)...")
                with ThreadPoolExecutor(max_workers=2) as short_ex:
                    futures = {
                        short_ex.submit(get_portfolio_summary, portfolio_fifo_results_df, fifo_closed_trades): "summary"
                    }
                    
                    for fut in as_completed(futures):
                        key = futures[fut]
                        try:
                            if key == "summary":
                                response['portfolio_summary'] = fut.result()
                        except Exception as e:
                            logger.error(f"Insight generation failed: {str(e)}")
                            response['errors'].append(f"Insights Error: {str(e)}")

            except Exception as e:
                logger.error(f"Insight generation outer failed: {str(e)}")
                response['errors'].append(f"Insights Error: {str(e)}")
            
            logger.info(f"[TIMING] 💡 Insights Generation took: {time.perf_counter() - t_start_insights:.4f}s")

            # ---------------------------------------------------------
            # 5. Generate Ledger View
            # ---------------------------------------------------------
            try:
                logger.info("Generating Ledger View...")
                t_start_ledger = time.perf_counter()
                ledger_data = generate_ledger_view(fifo_closed_trades, current_holdings_snapshot)
                
                # --- CLEANUP: Move LTP=0 stocks to Incomplete ---
                # Iterate and filter
                valid_holdings = []
                zero_ltp_holdings = []
                
                for holding in ledger_data.get('current_holdings', []):
                    # Check for 0 price (allow float tolerance)
                    if holding.get('current_price', 0) <= 0.001:
                        zero_ltp_holdings.append(holding)
                    else:
                        valid_holdings.append(holding)
                
                ledger_data['current_holdings'] = valid_holdings
                
                # --- ENRICH WITH SECTOR DATA ---
                # Ensure 'symbol' key exists for enricher (map from 'scrip')
                for h in ledger_data['current_holdings']:
                    if 'symbol' not in h and 'scrip' in h:
                        h['symbol'] = h['scrip']
                
                # Enrich with sector/industry from database
                try:
                    logger.info("Enriching ledger holdings with sector data...")
                    ledger_data['current_holdings'] = enrich_holdings_with_sector(ledger_data['current_holdings'])
                except Exception as e:
                    logger.error(f"Failed to enrich ledger holdings with sector: {e}")
                
                # Add to incomplete positions
                if 'incomplete_positions' not in ledger_data:
                    ledger_data['incomplete_positions'] = []
                    
                for h in zero_ltp_holdings:
                    # Convert date to ISO for consistency if possible, else keep as is
                    trade_date = h.get('date', '-')
                    # Try to convert DD-MM-YYYY to YYYY-MM-DD for JS Date() parsing
                    try:
                        if '-' in trade_date and len(trade_date) == 10:
                            parts = trade_date.split('-') # DD-MM-YYYY
                            if len(parts[0]) == 2: # Confirm DD is first
                                trade_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                    except:
                        pass

                    incomplete_entry = {
                        'Symbol': h.get('scrip', 'Unknown'),
                        'Qty': h.get('qty', 0),
                        'Trade_Date': trade_date,
                        'Amount': (h.get('qty', 0) * h.get('price', 0)), # Invested Amount
                        'Remarks': "Data is not available for this stock",
                        'Transaction_Status': 'Incomplete'
                    }
                    ledger_data['incomplete_positions'].append(incomplete_entry)

                response['ledger'] = ledger_data
                
                # --- VALIDATE TRANSACTIONS FOR DATA GAPS ---
                # Check for Sell orders without corresponding Buy history
                try:
                    from collections import defaultdict
                    validation_qty = defaultdict(float)
                    transactions_clean = transactions_clean.sort_values(['Trade_Date', 'Order_Type'], ascending=[True, True]) 
                    # Note: Sorting Order_Type 'B' (Buy) comes before 'S' (Sell) usually, beneficial for same-day trades
                    
                    status_list = []
                    remarks_list = []
                    
                    for idx, row in transactions_clean.iterrows():
                        sym = row['Symbol']
                        qty = float(row.get('Qty', 0))
                        side = row['Order_Type']
                        
                        if side == 'B':
                            validation_qty[sym] += qty
                            status_list.append("Completed")
                            remarks_list.append("")
                        else: # Sell
                            # Allow small floating point tolerance
                            if validation_qty[sym] < (qty - 1e-5):
                                missing_qty = qty - validation_qty[sym]
                                status_list.append("Incomplete")
                                remarks_list.append(f"Data Gap: Sell of {qty} exceeds available holdings. Missing historical Buy records. Please upload a specific ledger or 'All Time' transaction file.")
                                # Reset to 0 to prevent cascading negatives, assuming this was a 'reset' point or data gap
                                validation_qty[sym] = 0 
                            else:
                                validation_qty[sym] -= qty
                                status_list.append("Completed")
                                remarks_list.append("")
                                
                    transactions_clean['Transaction_Status'] = status_list
                    transactions_clean['Remarks'] = remarks_list
                    
                    # Extract Incomplete for pure frontend display
                    incomplete_df = transactions_clean[transactions_clean['Transaction_Status'] == "Incomplete"]
                    if not incomplete_df.empty:
                        response['ledger']['incomplete_positions'] = incomplete_df.to_dict(orient='records')
                    else:
                        response['ledger']['incomplete_positions'] = []

                except Exception as val_e:
                    logger.error(f"Transaction validation failed: {str(val_e)}")
                    response['ledger']['incomplete_positions'] = []
                
                # Expose raw transactions so frontend can show full history (including unmatched sells)
                response['transactions'] = transactions_clean.to_dict(orient='records')
                
            except Exception as e:
                logger.error(f"Ledger generation failed: {str(e)}")
                response['errors'].append(f"Ledger Error: {str(e)}")
            
            logger.info(f"[TIMING] 📒 Ledger & Validation took: {time.perf_counter() - t_start_ledger:.4f}s")

            # ---------------------------------------------------------
            # 6. Generate News View (New Feature)
            # ---------------------------------------------------------
            try:
                if not current_holdings_snapshot.empty:
                    logger.info("Generating News Feed...")
                    t_start_news = time.perf_counter()
                    symbols = current_holdings_snapshot['Symbol'].unique().tolist()
                    if symbols:
                        news_data = generate_news_view(symbols=symbols, max_articles=12)
                        response['news'] = news_data
                    else:
                        response['news'] = {"message": "No active holdings to fetch news for."}
                else:
                    response['news'] = {"message": "No current holdings found."}
            except Exception as e:
                logger.error(f"News generation failed: {str(e)}")
                response['errors'].append(f"News Error: {str(e)}")

            logger.info(f"[TIMING] 📰 News Generation took: {time.perf_counter() - t_start_news:.4f}s")

            # ---------------------------------------------------------
            # 7. Generate Graphs - run independent graph functions in parallel
            # ---------------------------------------------------------
            # Valuation graphs removed - using info buttons instead
            
            graph_registry = {
                "top_performing": (top_10_Scrips_combined, 'portfolio'),
                "portfolio_health": (stock_deployed_logic, 'both'),
                "best_trade_prob": (create_best_trade_plot, 'transactions'),
                "industry_sunburst": (create_industry_sunburst, 'portfolio'),
                "risk_return": (classify_stocks_risk_return, 'portfolio'),
                "combined_box_plot": (turnover_analysis_logic, 'both'),
                "trade_pnl_plot": (create_PNL_plot, 'transactions'),
                "swot_analysis": (create_swot_plot, 'transactions'),
                "valuation_bubble": (generate_combined_bubble_chart, 'portfolio'),

                "underwater_plot": (create_underwater_plot, 'portfolio'),
                "correlation_plot": (create_correlation_heatmap, 'portfolio'),

            }

            if not graph_types:
                graph_types = list(graph_registry.keys())

            num_workers = max(1, min(len(graph_types), GRAPH_MAX_WORKERS))

            t_start_graphs = time.perf_counter()
            with ThreadPoolExecutor(max_workers=num_workers) as gex:
                future_to_key = {}
                for key in graph_types:
                    if key not in graph_registry:
                        continue
                    
                    func, data_type = graph_registry[key]
                    if data_type == 'portfolio':
                        future = gex.submit(func, portfolio_fifo_results_df)
                    elif data_type == 'transactions':
                        future = gex.submit(func, transactions_clean)
                    elif data_type == 'both':
                        future = gex.submit(func, portfolio_fifo_results_df, transactions_clean)
                    elif data_type == 'valuation':
                        # Pass valuation_metrics data
                        if 'valuation_metrics' in response:
                            future = gex.submit(func, response['valuation_metrics'])
                        else:
                            continue
                    elif data_type == 'dividend':
                        # Pass dividend_income data
                        if 'valuation_metrics' in response and 'dividend_income' in response['valuation_metrics']:
                            future = gex.submit(func, response['valuation_metrics']['dividend_income'])
                        else:
                            continue
                    else:
                        continue
                    
                    future_to_key[future] = key

                for fut in as_completed(future_to_key):
                    key = future_to_key[fut]
                    try:
                        result = fut.result()
                        # Wrap result with status envelope for frontend compatibility
                        if isinstance(result, dict) and 'error' not in result:
                            # Extract the actual graph data
                            # Valuation graphs return {"graph": json_string, "insights": {...}}
                            if 'graph' in result:
                                # Graph is a JSON string from to_json()
                                graph_json = result.get('graph')
                                response['graphs'][key] = {
                                    'status': 'success',
                                    'graph_data': json.loads(graph_json) if isinstance(graph_json, str) else graph_json,
                                    'insights': result.get('insights', {})
                                }
                            elif 'figure' in result:
                                # Standard plotly figure dict
                                response['graphs'][key] = {
                                    'status': 'success',
                                    'graph_data': {'figure': result['figure']},
                                    'insights': result.get('insights', {})
                                }
                            else:
                                # Direct plotly object or unknown format
                                response['graphs'][key] = {
                                    'status': 'success',
                                    'graph_data': result
                                }
                        else:
                            response['graphs'][key] = result
                    except Exception as e:
                        logger.error(f"Graph '{key}' failed: {e}")
                        logger.error(traceback.format_exc())
                        response['graphs'][key] = {"error": str(e)}

            logger.info(f"[TIMING] 📈 Graph Generation took: {time.perf_counter() - t_start_graphs:.4f}s")

            # ---------------------------------------------------------
            # 8. Final Cleanup & Return
            # ---------------------------------------------------------
            final_json = json.loads(json.dumps(response, default=convert_to_serializable))
            
            total_duration = time.perf_counter() - t_start_total
            logger.info(f"[TIMING] 🏁 TOTAL ORCHESTRATOR TIME: {total_duration:.4f}s")
            
            return final_json

        except Exception as e:
            logger.critical(f"Orchestrator Critical Failure: {str(e)}")
            traceback.print_exc()
            return {
                "status": "error",
                "message": str(e),
                "trace": traceback.format_exc()
            }

    def fetch_only_news(self, file_path: str, date_filter: str = None, max_articles: int = 12):
        """
        Dedicated method for the /api/news/portfolio-news endpoint.
        """
        try:
            normalized_date = normalize_date_to_ddmmyyyy(date_filter) if date_filter else None
            
            # 1. Parse
            handler = UserFileHandler(file_path)
            raw_transactions = handler.parse_file()

            # 2. Clean
            transactions_clean = clean_scrip_names(raw_transactions)
            scrip_names = transactions_clean['Scrip_Name'].tolist()
            name_to_symbol = map_broker_scrips_by_compname(scrip_names)
            transactions_clean['Symbol'] = transactions_clean['Scrip_Name'].map(name_to_symbol).fillna(
                transactions_clean['Scrip_Name']
            )

            # 3. Identify Symbols (Active holdings)
            calculator = RepeatedCalc(transactions_clean)
            _ = calculator.calculate_results()
            current_holdings = calculator.get_current_holdings()

            if current_holdings.empty:
                return {
                    "articles": [],
                    "metadata": {
                        "message": "No holdings found",
                        "date_filter": normalized_date
                    }
                }
            
            symbols = current_holdings['Symbol'].unique().tolist()

            # 4. Fetch News
            news_data = generate_news_view(
                symbols=symbols,
                date_filter=normalized_date,
                max_articles=max_articles
            )

            return news_data

        except Exception as e:
            logger.error(f"Dedicated News Fetch failed: {e}")
            return {"articles": [], "metadata": {"error": str(e)}}

    def fetch_news_direct(self, symbols: list, date_filter: str = None, max_articles: int = 12):
        """
        Directly fetch news for a provided list of symbols.
        Bypasses file parsing.
        """
        try:
             normalized_date = normalize_date_to_ddmmyyyy(date_filter) if date_filter else None
             
             if not symbols:
                  return {"articles": [], "metadata": {"message": "No symbols provided"}}
                  
             news_data = generate_news_view(
                symbols=symbols,
                date_filter=normalized_date,
                max_articles=max_articles
            )
             return news_data
             
        except Exception as e:
            logger.error(f"Direct News Fetch failed: {e}")
            return {"articles": [], "metadata": {"error": str(e)}}


    def normalize_portfolio(self, file_path: str):
        """
        Public endpoint to just get the normalized JSON data.
        Returns the STRICT 24-column format.
        """
        try:
            df = self._get_normalized_dataframe(file_path)
            
            # STRICT COLUMN LIST
            required_columns = [
                'universal_trade_id', 'Symbol', 'Scrip_Name', 'Trade_execution_time',
                'Order_Type', 'Qty', 'Mkt_Price', 'Amount', 'Exchange', 'Series',
                'ISIN', 'Intraday_Flag', 'Brokerage', 'STT', 'TransN_Chgs',
                'Stamp_Duty', 'Sebi_Tax', 'CGST', 'CGST_on_Transn_Chrg', 'SGST', 'IGST',
                'GST_Total', 'Total_Taxes', 'Total_Charges'
            ]
            
            # Ensure all exist
            for col in required_columns:
                if col not in df.columns:
                    if col == 'Intraday_Flag':
                        df[col] = False
                    elif col in ['Qty', 'Mkt_Price', 'Amount', 'Brokerage', 'STT', 'TransN_Chgs', 'Stamp_Duty', 'Sebi_Tax', 'CGST', 'CGST_on_Transn_Chrg', 'SGST', 'IGST', 'GST_Total', 'Total_Taxes', 'Total_Charges']:
                        df[col] = 0.0
                    else:
                        df[col] = None

            # Filter
            final_df = df[required_columns].copy()
            
            # Convert dates to strings for JSON
            # Trade_execution_time implies datetime.
            if 'Trade_execution_time' in final_df.columns:
                 final_df['Trade_execution_time'] = final_df['Trade_execution_time'].astype(str).replace('NaT', None)

            return final_df.to_dict(orient='records')
        except Exception as e:
            logger.error(f"Normalization failed: {str(e)}")
            return {"error": str(e)}

    def _get_normalized_dataframe(self, file_path: str) -> pd.DataFrame:
        """
        Internal helper to parse & normalize file (CSV/Excel/JSON) -> DataFrame
        """
        logger.info(f"Ingesting file: {file_path}")
        
        # Check if JSON
        if file_path.lower().endswith('.json'):
            logger.info("Detected JSON input, assuming pre-normalized ledger.")
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                df = pd.DataFrame(data)
                
                # Handle potential date columns
                if 'Trade_Date' in df.columns:
                    df['Trade_Date'] = pd.to_datetime(df['Trade_Date'])
                elif 'Trade_execution_time' in df.columns:
                    # If Trade_Date missing (strict schema), recover it from execution_time
                    df['Trade_Date'] = pd.to_datetime(df['Trade_execution_time'])
                
                return df
            except Exception as e:
                raise ValueError(f"Failed to parse JSON file: {str(e)}")

        # Normal Flow (CSV/Excel)
        handler = UserFileHandler(file_path)
        raw_transactions = handler.parse_file()
        
        if raw_transactions.empty:
            raise ValueError("Parsed transaction file is empty.")

        logger.info("Normalizing scrip names...")
        transactions_clean = clean_scrip_names(raw_transactions)

        # Build mapping inputs
        scrip_names = transactions_clean['Scrip_Name'].tolist()
        logger.info("Mapping broker scrip names to NSE symbols via Company_master...")
        name_to_symbol = map_broker_scrips_by_compname(scrip_names)
        
        transactions_clean['Symbol'] = transactions_clean['Scrip_Name'].map(name_to_symbol).fillna(
            transactions_clean['Scrip_Name']
        )

        # --- NEW ENRICHMENT LOGIC ---
        
        # 0. Enrich from Database (ISIN / Exchange)
        transactions_clean = enrich_trade_data(transactions_clean)

        # 1. Ensure Trade_execution_time exists
        if 'Trade_execution_time' not in transactions_clean.columns:
            if 'Trade_Date' in transactions_clean.columns:
                transactions_clean['Trade_execution_time'] = transactions_clean['Trade_Date']
            else:
                transactions_clean['Trade_execution_time'] = pd.NaT

        # 2. Universal Trade ID
        # Hashing: Trade_Date, Symbol, Order_Type, Qty, Mkt_Price
        # Ensure these are strings
        id_cols = ['Trade_Date', 'Symbol', 'Order_Type', 'Qty', 'Mkt_Price']
        transactions_clean['universal_trade_id'] = generate_universal_trade_id(transactions_clean, id_cols)

        # 2.b Calculate Amount if missing (Req by user)
        # If Amount is 0 or NaN, try to compute as Qty * Mkt_Price
        if 'Amount' not in transactions_clean.columns:
            transactions_clean['Amount'] = 0.0
            
        def calc_missing_amount(row):
            amt = row.get('Amount', 0)
            if pd.isna(amt) or amt == 0:
                q = float(row.get('Qty', 0))
                p = float(row.get('Mkt_Price', 0))
                if q > 0 and p > 0:
                    return q * p
            return amt

        transactions_clean['Amount'] = transactions_clean.apply(calc_missing_amount, axis=1)

        # 2.c AGGREGATE DUPLICATES (User Requirement: Merge rows with same universal_trade_id)
        # This handles cases where file has exact duplicate logic trades (same date, symbol, type, qty, price)
        # The user wants to sum them up.
        if transactions_clean['universal_trade_id'].duplicated().any():
            logger.info("Duplicate universal_trade_ids found. Aggregating rows...")
            
            # Define aggregation rules
            agg_rules = {
                'Qty': 'sum',
                'Amount': 'sum',
                'Brokerage': 'sum', 
                'Brokerage_Amt': 'sum', # Handle both just in case
                'Taxes': 'sum',
                'Total_Taxes': 'sum', # Handle both
                'STT': 'sum',
                'TransN_Chgs': 'sum',
                'Stamp_Duty': 'sum',
                'Sebi_Tax': 'sum',
                'CGST': 'sum',
                'CGST_on_Transn_Chrg': 'sum',
                'SGST': 'sum',
                'IGST': 'sum',
                'GST_Total': 'sum',
                'Total_Charges': 'sum'
            }
            
            # For all other columns, take 'first'
            # We explicitly list common non-numeric ones to be sure, then catch-all?
            # Safer to iterate columns
            final_agg = {}
            for col in transactions_clean.columns:
                if col in agg_rules:
                    # Only apply 'sum' if the column actually exists in this DF
                    final_agg[col] = agg_rules[col]
                elif col != 'universal_trade_id':
                     # Default to first for non-summable
                    final_agg[col] = 'first'
            
            # Perform GroupBy
            transactions_clean = transactions_clean.groupby('universal_trade_id', as_index=False).agg(final_agg)
            
            # Recalculate Mkt_Price to be safe (Weighted Avg effectively, but since price is part of hash, they should be same)
            # But if we summed Qty and Amount, Mkt_Price should remain constant.
            # actually since Mkt_Price IS ID_PART, it must be identical for all grouped rows.
            # So 'first' is correct. 
            
            logger.info(f"Aggregation complete. Row count: {len(transactions_clean)}")

        # 3. Intraday Flag
        # Needs: Trade_Date, Symbol, Order_Type, Qty
        transactions_clean = calculate_intraday_flag(transactions_clean)

        # 4. Map Taxes/Charges to strict schema (Non-destructive for compatibility)
        # We COPY columns to new names instead of renaming, because RepeatedCalc relies on 
        # specific old names (e.g. Brokerage_Amt, Tax_*) and prefix-based discovery.
        
        # Core Financials
        if 'Brokerage_Amt' in transactions_clean.columns:
            transactions_clean['Brokerage'] = transactions_clean['Brokerage_Amt']
        elif 'Brokerage' in transactions_clean.columns:
             transactions_clean['Brokerage_Amt'] = transactions_clean['Brokerage']

        if 'Taxes' in transactions_clean.columns:
            transactions_clean['Total_Taxes'] = transactions_clean['Taxes']
        elif 'Total_Taxes' in transactions_clean.columns:
             transactions_clean['Taxes'] = transactions_clean['Total_Taxes']
             
        # Tax Components Mapping (Old -> New)
        # Old: Tax_STT, Tax_Stamp_Duty, Tax_Transaction_Charge, Tax_Sebi_Turnover, 
        #      Tax_CGST, Tax_SGST, Tax_IGST, Tax_CGST_on_Transaction
        # New: STT, Stamp_Duty, TransN_Chgs, Sebi_Tax, CGST, SGST, IGST, CGST_on_Transn_Chrg
        
        tax_map = {
            'Tax_STT': 'STT',
            'Tax_Transaction_Charge': 'TransN_Chgs',
            'Tax_Stamp_Duty': 'Stamp_Duty',
            'Tax_Sebi_Turnover': 'Sebi_Tax',
            'Tax_CGST': 'CGST',
            'Tax_SGST': 'SGST',
            'Tax_IGST': 'IGST',
            'Tax_CGST_on_Transaction': 'CGST_on_Transn_Chrg'
            # Note: GST_Total is a new requirement, likely sum of CGST+SGST+IGST
        }
        
        for old_col, new_col in tax_map.items():
            if old_col in transactions_clean.columns:
                transactions_clean[new_col] = transactions_clean[old_col]
            # Inverse check if loading from JSON
            elif new_col in transactions_clean.columns:
                transactions_clean[old_col] = transactions_clean[new_col]

        # Calculate GST_Total if not present
        if 'GST_Total' not in transactions_clean.columns:
            gst_cols = ['CGST', 'SGST', 'IGST', 'CGST_on_Transn_Chrg'] # Include tax on trans? Usually yes.
            # Only sum columns that exist
            existing_gst = [c for c in gst_cols if c in transactions_clean.columns]
            if existing_gst:
                transactions_clean['GST_Total'] = transactions_clean[existing_gst].sum(axis=1)
            else:
                transactions_clean['GST_Total'] = 0.0

        # Create Total_Charges = Brokerage + Total_Taxes if not present
        if 'Total_Charges' not in transactions_clean.columns:
            # Safer to sum 0s
            brk = transactions_clean.get('Brokerage', 0)
            tax = transactions_clean.get('Total_Taxes', 0)
            transactions_clean['Total_Charges'] = brk + tax
        
        return transactions_clean
