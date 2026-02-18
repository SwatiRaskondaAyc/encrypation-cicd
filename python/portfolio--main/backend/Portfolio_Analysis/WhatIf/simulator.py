import logging
import copy
import math
import pandas as pd
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor

from sqlalchemy import select, desc
from sqlalchemy.orm import Session
from mtm.orm.engine import SessionPriceAction, SessionFundamentals
from mtm.orm.db_priceaction.orm_models import HistPA

# Metric Calculators
from metrics.beta import BetaCalculator
from metrics.alpha import AlphaCalculator
from metrics.ratios import RatioCalculator
from metrics.valuation import ValuationCalculator

logger = logging.getLogger(__name__)

class PortfolioSimulator:
    """
    Simulates portfolio changes (What-If Analysis) and calculates impact on key metrics.
    """
    
    
    def __init__(self):
        self.beta_calc = BetaCalculator(lookback_days=365)  # Match orchestrator (line 286)
        self.alpha_calc = AlphaCalculator()
        self.ratio_calc = RatioCalculator()
        self.val_calc = ValuationCalculator()

    def simulate_swap(self, 
                      current_holdings: List[Dict], 
                      swap_config: Dict,
                      current_metrics: Optional[Dict] = None) -> Dict:
        """
        Executes the simulation pipeline.
        
        Args:
            current_holdings: List of dicts {symbol, quantity, current_price, ...}
            swap_config: Dict with:
                - target_symbol: str
                - action: 'SWAP_ALL' | 'SWAP_QTY' | 'ADD_FUNDS' | 'REPLACE_SHARES'
                - source_symbol: str (Required for SWAP actions)
                - quantity: float (Optional)
                - amount: float (Optional)
            current_metrics: Optional pre-calculated metrics to use as baseline
        """
        try:
            # 1. Prepare Data
            original_portfolio = {'current_holdings': copy.deepcopy(current_holdings)}
            target_symbol = swap_config.get('target_symbol')
            
            # Fetch target stock price
            if target_symbol == "CASH":
                target_price = 1.0
            else:
                target_price = self._get_latest_price(target_symbol)
            
            if not target_price or target_price <= 0:
                logger.error(f"Price not found or zero for {target_symbol}")
                return {"error": f"Could not fetch price for target stock {target_symbol}"}
                
            # 2. Modify Portfolio
            new_holdings_list = self._apply_swap(
                current_holdings, 
                swap_config, 
                target_price
            )
            
            # Enrich new holdings with sector data before calculating metrics
            from Portfolio_Analysis.WhatIf.holdings_enricher import enrich_holdings_with_sector
            new_holdings_list = enrich_holdings_with_sector(new_holdings_list)
            
            new_portfolio = {'current_holdings': new_holdings_list}
            
            # 3. Calculate Metrics (Original vs New)
            # Use provided current_metrics if available, otherwise calculate
            # CHANGED: Removed ThreadPoolExecutor to prevent DB locking/context issues with SQLite
            if current_metrics:
                logger.info("Using provided current metrics from dashboard")
                metrics_orig = current_metrics
            else:
                logger.info("Calculating original portfolio metrics (no current_metrics provided)")
                metrics_orig = self._calculate_all_metrics(original_portfolio)
            
            # Always calculate NEW portfolio metrics
            metrics_new = self._calculate_all_metrics(new_portfolio)

            # 4. Generate Comparison & Insights
            comparison = self._compare_metrics(metrics_orig, metrics_new)
            
            # 5. Generate Conclusion
            conclusion = self._generate_conclusion(comparison, swap_config)
            
            return {
                "original_metrics": metrics_orig,
                "new_metrics": metrics_new,
                "comparison": comparison,
                "conclusion": conclusion,
                "modified_holdings": new_holdings_list,
                "modified_portfolio_summary": {
                    "total_value": sum(float(h.get('quantity', 0)) * float(h.get('current_price', 0)) for h in new_holdings_list),
                    "holdings_count": len(new_holdings_list)
                }
            }
            
        except Exception as e:
            logger.error(f"Simulation Error: {e}", exc_info=True)
            return {"error": str(e)}

    def _get_latest_price(self, symbol: str) -> float:
        session = SessionPriceAction()
        try:
            # Get latest date first
            date_stmt = select(HistPA.Date).order_by(desc(HistPA.Date)).limit(1)
            latest_date = session.execute(date_stmt).scalar()
            
            # Try exact match first
            stmt = select(HistPA.Close).where(
                HistPA.Symbol == symbol,
                HistPA.Date == latest_date
            )
            price = session.execute(stmt).scalar()
            
            # If not found, try UPPER case
            if price is None:
                stmt = select(HistPA.Close).where(
                    HistPA.Symbol == symbol.upper(),
                    HistPA.Date == latest_date
                )
                price = session.execute(stmt).scalar()
                
            return float(price) if price else 0.0
        finally:
            session.close()

    def _apply_swap(self, holdings: List[Dict], config: Dict, target_price: float) -> List[Dict]:
        new_list = copy.deepcopy(holdings)
        action = config.get('action')
        source_sym = config.get('source_symbol')
        target_sym = config.get('target_symbol')
        
        # Ensure symbols are string and uppercase for comparison
        if source_sym: source_sym = str(source_sym).upper()
        if target_sym: target_sym = str(target_sym).upper()

        # Find source holding if exists
        source_idx = -1
        for i, h in enumerate(new_list):
            h_sym = str(h.get('symbol', '')).upper()
            # Normalize holding symbol in place if needed, but safer to just compare
            if h_sym == source_sym:
                source_idx = i
                break
        
        # Helper to add/merge target
        def add_target(qty, value):
            # Check if target already exists
            for h in new_list:
                if str(h.get('symbol', '')).upper() == target_sym:
                    h['quantity'] = float(h.get('quantity', 0)) + qty
                    # Update average price logic if we had buy price, but here we only have current holdings
                    # So we just update quantity.
                    return
            
            # Not found, add new - fetch sector data from database
            from mtm.orm.engine import SessionFundamentals
            from mtm.orm.db_fundamentals.orm_models import Company_master
            from sqlalchemy import func
            
            session_fund = SessionFundamentals()
            sector = 'Other'
            industry = 'Other'
            try:
                # Try case-insensitive search
                comp = session_fund.query(Company_master).filter(
                    (func.upper(Company_master.SYMBOL) == target_sym) |
                    (func.upper(Company_master.SCRIPCODE) == target_sym) |
                    (func.upper(Company_master.SCRIP_NAME) == target_sym)
                ).first()
                
                if comp:
                    sector = comp.Sector if comp.Sector else 'Other'
                    industry = comp.Industry if comp.Industry else 'Other'
                    logger.info(f"WhatIf: Found {target_sym} -> Sector={sector}, Industry={industry}")
                else:
                    logger.warning(f"WhatIf: Stock {target_sym} NOT FOUND in Company_master!")
            except Exception as e:
                logger.error(f"WhatIf: Error fetching sector for {target_sym}: {e}")
            finally:
                session_fund.close()
            
            new_list.append({
                'symbol': target_sym, # Use the casing provided (usually UPPER from above)
                'quantity': qty,
                'current_price': target_price,
                'average_price': target_price,
                'value': value,
                'sector': sector,
                'Sector': sector,
                'industry': industry,
                'Industry': industry
            })

        if action == 'SWAP_ALL':
            if source_idx == -1: raise ValueError(f"Source stock {source_sym} not found")
            
            # Calculate value to swap
            source_h = new_list[source_idx]
            swap_value = float(source_h['quantity']) * float(source_h['current_price'])
            
            # Remove source
            new_list.pop(source_idx)
            
            # Add target (floored to whole shares)
            if target_price > 0:
                new_qty = math.floor(swap_value / target_price)
                add_target(new_qty, new_qty * target_price)

        elif action == 'SWAP_QTY':
             if source_idx == -1: raise ValueError(f"Source stock {source_sym} not found")
             qty_to_swap = float(config.get('quantity', 0))
             source_h = new_list[source_idx]
             
             current_qty = float(source_h['quantity'])
             if qty_to_swap > current_qty:
                 qty_to_swap = current_qty # Cap at max
                 
             # Reduce source
             source_h['quantity'] = current_qty - qty_to_swap
             if source_h['quantity'] <= 0:
                 new_list.pop(source_idx)
                 
             # Add target (floored to whole shares)
             if target_price > 0:
                 swap_value = qty_to_swap * float(source_h['current_price'])
                 new_qty = math.floor(swap_value / target_price)
                 add_target(new_qty, new_qty * target_price)
             
        elif action == 'REPLACE_SHARES':
            # Buy EXACT same number of shares of Target as Source (Value changes)
            if source_idx == -1: raise ValueError(f"Source stock {source_sym} not found")
            source_h = new_list[source_idx]
            qty_to_swap = float(source_h['quantity']) # All shares
            
            # Remove source
            new_list.pop(source_idx)
            
            # Add target (Same Qty)
            add_target(qty_to_swap, qty_to_swap * target_price)

        elif action == 'ADD_FUNDS':
            amount = float(config.get('amount', 0))
            if target_price > 0:
                new_qty = math.floor(amount / target_price)
                add_target(new_qty, new_qty * target_price)
            
        return new_list

    def _calculate_all_metrics(self, portfolio: Dict) -> Dict:
        """
        Runs all existing calculator classes on the portfolio.
        """
        try:
            current_holdings = portfolio.get('current_holdings', [])
            
            # Calculate deployed capital correctly
            deployed_capital = sum(
                float(h.get('quantity', 0)) * float(h.get('current_price', 0))
                for h in current_holdings
            )
            
            # 1. Ratios (Sharpe, Treynor, Sortino, Omega, HHI)
            # Note: Ratios internal logic manages its own session/data fetching
            ratios = self.ratio_calc.calculate_ratios(portfolio)
            
            # 2. Beta (Daily and Monthly)
            # Matching app.py: Let BetaCalculator manage its own session
            beta_res = self.beta_calc.calculate_portfolio_beta(portfolio)
            
            # 3. Jensen's Alpha (Proper calculation)
            # Calculate weighted alpha using individual stock alphas
            individual_alphas = {}
            weighted_alpha_sum = 0
            total_weight = 0
            
            # Get betas for alpha calculation
            daily_betas = beta_res.get('daily_betas', {}).get('individual', {})
            
            for holding in current_holdings:
                symbol = holding.get('symbol')
                qty = float(holding.get('quantity', 0))
                price = float(holding.get('current_price', 0))
                value = qty * price
                weight = value / deployed_capital if deployed_capital > 0 else 0
                
                # Get beta for this stock
                beta_data = daily_betas.get(symbol, {})
                beta_val = beta_data.get('beta')
                
                if beta_val is not None:
                    # Calculate alpha for this stock
                    # AlphaCalculator manages its own session if needed
                    alpha_result = self.alpha_calc.calculate_alpha(symbol, beta_val)
                    individual_alphas[symbol] = alpha_result
                    
                    if alpha_result.get('alpha') is not None:
                        weighted_alpha_sum += alpha_result['alpha'] * weight
                        total_weight += weight
            
            jensens_alpha = weighted_alpha_sum / total_weight if total_weight > 0 else None
            
            # 4. Valuation (PE, PB, Div Yield)
            # Let ValuationCalculator manage its own session
            val_res = self.val_calc.calculate_portfolio_valuation(portfolio)
            
            # Consolidate
            pm = ratios.get('portfolio_metrics', {})
            val_pm = val_res.get('portfolio_metrics', {})
            
            # Extract beta values
            portfolio_beta_daily = beta_res.get('daily_betas', {}).get('portfolio_beta')
            portfolio_beta_monthly = beta_res.get('monthly_betas', {}).get('portfolio_beta')
            
            return {
                "deployed_capital": round(deployed_capital, 2),
                "jensens_alpha": round(jensens_alpha, 4) if jensens_alpha is not None else None,
                "beta_daily": round(portfolio_beta_daily, 4) if portfolio_beta_daily is not None else None,
                "beta_monthly": round(portfolio_beta_monthly, 4) if portfolio_beta_monthly is not None else None,
                "sharpe_ratio": pm.get('sharpe_ratio'),
                "sortino_ratio": pm.get('sortino_ratio'),
                "treynor_ratio": pm.get('treynor_ratio'),
                "omega_ratio": pm.get('omega_ratio'),
                "information_ratio": pm.get('information_ratio'),
                "hhi": pm.get('hhi'),
                "pe": val_pm.get('pe'),
                "pb": val_pm.get('pb'),
                "dividend_yield": val_pm.get('dividend_yield')
            }
            
        except Exception as e:
            logger.error(f"Error calculating metrics: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {}

    def _compare_metrics(self, old: Dict, new: Dict) -> Dict:
        diff = {}
        for k, v_old in old.items():
            if v_old is None: v_old = 0
            v_new = new.get(k)
            if v_new is None: v_new = 0
            
            delta = v_new - v_old
            pct_change = (delta / v_old) if v_old != 0 else 0
            
            diff[k] = {
                "old": v_old,
                "new": v_new,
                "delta": round(delta, 4),
                "pct_change": round(pct_change, 2)
            }
        return diff

    def _generate_conclusion(self, comparison: Dict, config: Dict) -> Dict:
        """
        Generates simplified, layman-friendly insights.
        """
        SIGNIFICANT_THRESHOLD = 0.10
        insights = []
        
        # Extract stock names from config
        source_symbol = config.get('source_symbol', 'Portfolio')
        target_symbol = config.get('target_symbol', 'New Position')

        # Helper formatting functions
        def fmt_pct(val):
            return f"{val*100:.1f}%" if val is not None else "N/A"
        
        def fmt_num(val, decimals=2):
            return f"{val:.{decimals}f}" if val is not None else "N/A"

        # Extract deltas and calculate significance
        def get_metric(key):
            m = comparison.get(key, {})
            delta = m.get('delta', 0)
            before = m.get('old')
            after = m.get('new')
            pct_change = m.get('pct_change')
            
            # Calculate pct_change if not provided
            if pct_change is None and before is not None and before != 0:
                pct_change = delta / abs(before)
            
            is_significant = abs(pct_change) >= SIGNIFICANT_THRESHOLD if pct_change is not None else False
            return delta, before, after, pct_change, is_significant
        
        # Get all metrics
        sharpe_d, sharpe_b, sharpe_a, sharpe_pct, sharpe_sig = get_metric('sharpe_ratio')
        sortino_d, sortino_b, sortino_a, sortino_pct, sortino_sig = get_metric('sortino_ratio')
        alpha_d, alpha_b, alpha_a, alpha_pct, alpha_sig = get_metric('jensens_alpha')
        beta_d, beta_b, beta_a, beta_pct, beta_sig = get_metric('beta_daily')
        beta_m_d, beta_m_b, beta_m_a, beta_m_pct, beta_m_sig = get_metric('beta_monthly')
        treynor_d, treynor_b, treynor_a, treynor_pct, treynor_sig = get_metric('treynor_ratio')
        omega_d, omega_b, omega_a, omega_pct, omega_sig = get_metric('omega_ratio')
        info_d, info_b, info_a, info_pct, info_sig = get_metric('information_ratio')
        capital_d, capital_b, capital_a, capital_pct, capital_sig = get_metric('deployed_capital')
        pe_d, pe_b, pe_a, pe_pct, pe_sig = get_metric('pe')
        pb_d, pb_b, pb_a, pb_pct, pb_sig = get_metric('pb')
        div_d, div_b, div_a, div_pct, div_sig = get_metric('dividend_yield')
        hhi_d, hhi_b, hhi_a, hhi_pct, hhi_sig = get_metric('hhi')
        
        # === CROSS-METRIC INSIGHTS (HIGHEST PRIORITY) ===
        
        # Beta ↑ but Sharpe ↓
        if beta_d > 0 and sharpe_d < 0 and beta_sig:
            insights.append({
                "type": "cross_metric",
                "confidence": "very_high",
                "insight": f"Risk vs Return Mismatch: You are taking on {fmt_pct(beta_pct)} more market risk, but your efficiency is dropping by {fmt_pct(abs(sharpe_pct))}. Essentially, you're paying more 'risk tax' for less reward."
            })
        
        # Alpha ↓ but Beta ↓
        if alpha_d < 0 and beta_d < 0 and (alpha_sig or beta_sig):
            insights.append({
                "type": "cross_metric",
                "confidence": "high",
                "insight": f"Defensive but Costly: This move makes your portfolio safer (Risk down {fmt_pct(abs(beta_pct))}), but you lose {fmt_num(abs(alpha_d), 4)} points of 'market-beating' performance. Expect slower growth in bull markets."
            })
        
        # P/E ↑ but Alpha ↓
        if pe_d > 0 and alpha_d < 0 and (pe_sig or alpha_sig):
            insights.append({
                "type": "cross_metric",
                "confidence": "high",
                "insight": f"Overpaying for Growth? You're paying a {fmt_pct(pe_pct)} higher price (P/E) for a portfolio that generates less excess return ({fmt_pct(alpha_pct)} Alpha). Ensure {target_symbol}'s future growth justifies this premium."
            })
        
        # Dividend ↑ but Omega ↓
        if div_d > 0 and omega_d < 0 and (div_sig or omega_sig):
            insights.append({
                "type": "cross_metric",
                "confidence": "medium",
                "insight": f"Income vs Stability: You gain {fmt_num(div_d, 2)}bps in Dividend Yield, but your overall win-loss probability (Omega) drops by {fmt_pct(abs(omega_pct))}. You get cash now, but potentially more volatile price swings."
            })
        
        # === METRIC-LEVEL INSIGHTS (ONLY IF SIGNIFICANT) ===
        
        # Sharpe Ratio (Efficiency)
        if sharpe_sig:
            if sharpe_d < 0:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Efficiency Drop: Your Risk-Reward score (Sharpe) fell by {fmt_pct(abs(sharpe_pct))}. The new portfolio generates less return for every unit of risk taken."
                })
            else:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Efficiency Boost: Your Risk-Reward score (Sharpe) improved by {fmt_pct(sharpe_pct)}. You are getting more 'bang for your buck' on every unit of risk."
                })
        
        # Sortino Ratio (Downside Safety)
        if sortino_sig:
            if sortino_d < 0:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Safety Alert: Your protection against bad market days (Sortino) dropped by {fmt_pct(abs(sortino_pct))}. You may feel market crashes more intensely."
                })
            else:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Safety Upgrade: Your protection against bad market days (Sortino) improved by {fmt_pct(sortino_pct)}. This portfolio handles crashes better."
                })
        
        # Jensen's Alpha (Outperformance)
        if alpha_sig:
            if alpha_a and alpha_a < 0 and alpha_d < 0:
                insights.append({
                    "type": "return",
                    "confidence": "high",
                    "insight": f"Underperformance Warning: Your portfolio is trailing the market benchmark even more (Alpha down {fmt_num(abs(alpha_d), 4)}). Passive investing might beat this strategy."
                })
            elif alpha_d > 0:
                insights.append({
                    "type": "return",
                    "confidence": "high",
                    "insight": f"Skill Edge: Your ability to beat the market benchmark (Alpha) improved by {fmt_pct(alpha_pct)}. This selection adds real value beyond just riding the market wave."
                })
        
        # Beta (Market Sensitivity)
        if beta_sig:
            if beta_d > 0:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Higher Volatility: Your portfolio is now {fmt_pct(beta_pct)} more sensitive to the Nifty 50. If the market drops 1%, expect your portfolio to drop more than before."
                })
            else:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Lower Volatility: Your portfolio is {fmt_pct(abs(beta_pct))} less sensitive to daily market swings. Use this if you want a smoother ride."
                })
        
        # HHI (Diversification)
        if hhi_sig:
            if hhi_d > 0:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Concentration Risk: You are Putting more eggs in one basket. Diversification Score worsened by {fmt_pct(hhi_pct)}."
                })
            elif hhi_d < 0:
                insights.append({
                    "type": "risk",
                    "confidence": "high",
                    "insight": f"Better Diversification: You successfully spread your bets. Distrubution improved by {fmt_pct(abs(hhi_pct))}."
                })

        # Valuation (P/E & P/B)
        if pe_sig and pe_d > 0:
             insights.append({
                "type": "valuation",
                "confidence": "medium",
                "insight": f"More Expensive: Portfolio P/E rose by {fmt_pct(pe_pct)}. You are paying more for each Rupee of earnings."
             })
        elif pe_sig and pe_d < 0:
             insights.append({
                "type": "valuation",
                "confidence": "medium",
                "insight": f"Better Value: Portfolio P/E dropped by {fmt_pct(abs(pe_pct))}. You are buying earnings at a cheaper price."
             })
             
        # Sort insights by priority
        priority_order = {"cross_metric": 0, "risk": 1, "return": 2, "capital": 3, "valuation": 4}
        insights.sort(key=lambda x: priority_order.get(x["type"], 99))
        
        # Insights sorted by priority
        # insights = insights[:5] # REMOVED LIMIT per user request
        
        # Determine verdict
        has_negative_cross = any(i["type"] == "cross_metric" and ("Mismatch" in i["insight"] or "Costly" in i["insight"]) for i in insights)
        
        if sharpe_d > 0.05 and not has_negative_cross:
            verdict = "POSITIVE"
            recommendation = "PROCEED"
            summary = f"This trade boosts your efficiency by {fmt_pct(sharpe_pct)}. It's a solid upgrade for your portfolio."
        elif sharpe_d < -0.1 or has_negative_cross:
            verdict = "NEGATIVE"
            recommendation = "RECONSIDER"
            summary = f"Caveat Emptor: This trade hurts your Efficiency (-{fmt_pct(abs(sharpe_pct))}). Ensure you have a strong reason to accept the higher risk."
        else:
            verdict = "NEUTRAL"
            recommendation = "REVIEW_CAREFULLY"
            summary = f"Mixed Bag: This trade changes your profile (+{len(insights)} factors) but the net efficiency change is minor. Review the trade-offs below."
        
        return {
            "verdict": verdict,
            "summary": summary,
            "insights": insights,
            "recommendation": recommendation
        }

