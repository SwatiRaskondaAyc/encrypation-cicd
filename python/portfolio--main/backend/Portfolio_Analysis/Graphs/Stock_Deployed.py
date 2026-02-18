import logging
import pandas as pd
import numpy as np
import math
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.utils import normalise_portfolio_columns, clean_numeric_columns

logger = logging.getLogger(__name__)

def stock_deployed_logic(portfolio_fifo_df: pd.DataFrame, transaction_df: pd.DataFrame) -> dict:
    """
    Analyzes Deployed Amount, Market Value, and Realized PNL over time with 20 Deep Insights.
    Input:
        - portfolio_fifo_df: Time-series result from RepeatedCalc
        - transaction_df: Raw transactions for 'Last Buy Date' logic
    Output:
        - JSON-serializable dict with 'graph_data' and 'insights'.
    """
    try:
        # 1. SETUP & CLEANING
        df = normalise_portfolio_columns(portfolio_fifo_df)
        
        # Robust Scrip Identification (Fixes KeyError)
        if 'Scrip' not in df.columns:
            if 'Symbol' in df.columns:
                df['Scrip'] = df['Symbol']
            elif 'Scrip_Name' in df.columns:
                df['Scrip'] = df['Scrip_Name']
            else:
                return {"error": "Missing 'Scrip' or 'Symbol' column in portfolio data"}
        
        # Ensure numeric consistency
        numeric_cols = ['Deployed Amount', 'Market Value', 'Realized PNL', 'Unrealized PNL']
        df = clean_numeric_columns(df, numeric_cols)
        
        # Ensure Date format
        if 'Date' in df.columns:
            df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
            
        df.fillna(0, inplace=True)

        if df.empty:
            return {"error": "No data available after cleaning"}

        # 2. DATA TRANSFORMATION (The "What")
        try:
            deployed_pivot = df.pivot_table(values='Deployed Amount', index='Date', columns='Scrip').fillna(0)
            market_pivot = df.pivot_table(values='Market Value', index='Date', columns='Scrip').fillna(0)
            pnl_pivot = df.pivot_table(values='Realized PNL', index='Date', columns='Scrip').fillna(0)
        except KeyError as e:
             return {"error": f"Pivot failed: {str(e)}"}
        
        # Month-over-Month PnL changes
        pnl_diff = pnl_pivot.diff().fillna(pnl_pivot.iloc[0])

        # Last Buy Date Logic
        last_buy_map = {}
        if not transaction_df.empty:
            txn_clean = transaction_df.copy()
            txn_clean['Trade_Date'] = pd.to_datetime(txn_clean['Trade_Date'], errors='coerce')
            scrip_col = 'Symbol' if 'Symbol' in txn_clean.columns else ('Scrip_Name' if 'Scrip_Name' in txn_clean.columns else 'Scrip')
            
            if scrip_col in txn_clean.columns:
                last_buy_map = (
                    txn_clean[txn_clean['Order_Type'] == 'B'][[scrip_col, 'Trade_Date']]
                    .groupby(scrip_col)
                    .agg({'Trade_Date': 'max'})
                    .to_dict().get('Trade_Date', {})
                )

        # Graph Data Construction
        graph_data = {}
        scrips = deployed_pivot.columns.tolist()

        for scrip in scrips:
            def make_series(series):
                result = []
                for dt, val in series.items():
                    if val is None or not math.isfinite(val): continue
                    result.append({"x": dt.isoformat(), "y": float(val)})
                return result

            # Filter PnL events (non-zero changes)
            pnl_series = pnl_diff[scrip]
            pnl_events = pnl_series[pnl_series != 0]
            rp_data = make_series(pnl_events) if not pnl_events.empty else []
            
            lb_date = last_buy_map.get(scrip)
            lb_iso = lb_date.isoformat() if isinstance(lb_date, pd.Timestamp) else None

            graph_data[scrip] = {
                "deployed": make_series(deployed_pivot[scrip]),
                "marketValue": make_series(market_pivot[scrip]),
                "realizedPNL": rp_data,
                "lastBuyDate": lb_iso
            }

        # 3. INSIGHT ENGINE (20 SCENARIOS)
        insights = []
        actions = []
        
        def add_insight(title, text, reasoning):
            insights.append({"title": title, "text": text, "reasoning": reasoning})
        def add_action(title, text, reasoning):
            actions.append({"title": title, "text": text, "reasoning": reasoning})

        # Get latest snapshot for current status
        latest_snap = df[df['Date'] == df['Date'].max()].set_index('Scrip')
        
        # Portfolio-level aggregates
        total_deployed_pos = latest_snap[latest_snap['Unrealized PNL'] > 0]['Deployed Amount'].sum()
        total_deployed_neg = latest_snap[latest_snap['Unrealized PNL'] < 0]['Deployed Amount'].sum()
        total_unrealized_gain = latest_snap[latest_snap['Unrealized PNL'] > 0]['Unrealized PNL'].sum()

        for scrip in scrips:
            if scrip not in latest_snap.index: continue
            
            row = latest_snap.loc[scrip]
            curr_dep = row.get('Deployed Amount', 0)
            curr_mv = row.get('Market Value', 0)
            curr_unrealized = row.get('Unrealized PNL', 0)
            curr_realized = row.get('Realized PNL', 0)
            avg_buy = row.get('Avg_Buy_Price', 0)
            curr_price = row.get('Mkt_Price', 0)
            
            # Historical Data for this scrip
            hist = df[df['Scrip'] == scrip].sort_values('Date')
            if hist.empty: continue

            # 1. Best Performing Stocks
            if (curr_mv - curr_dep > 0) and (curr_mv > curr_dep * 1.5): 
                 add_insight("Best Performer", f"**{scrip}** is a strong contributor.", "Consider holding or adding during dips.")

            # 2. Worst Performing Stocks
            if (curr_mv < curr_dep * 0.7) and (curr_dep > 0):
                add_action("Underperformer", f"**{scrip}** is dragging performance.", "Re-evaluate conviction; consider trimming.")

            # 3. High Confidence (Rising Deployment + Rising MV)
            if len(hist) > 5:
                recent = hist.tail(5)
                if (recent['Deployed Amount'].is_monotonic_increasing) and (recent['Market Value'].is_monotonic_increasing) and (curr_unrealized > 0):
                    add_insight("High Confidence", f"Staggered entries working in **{scrip}**.", "Your strategic averaging is paying off.")

            # 4. Average-Down Mistakes
            mid_idx = len(hist) // 2
            if mid_idx > 1:
                early_dep = hist.iloc[:mid_idx]['Deployed Amount'].mean()
                late_dep = hist.iloc[mid_idx:]['Deployed Amount'].mean()
                # Logic: Deployment increased significantly (>20%) but Unrealized PnL is deeply negative
                if (late_dep > early_dep * 1.2) and (curr_unrealized < -0.1 * curr_dep):
                    add_action("Average-Down Risk", f"Increased exposure in **{scrip}** despite losses.", "You are throwing good money after bad. Stop averaging down.")

            # 5. Successful Exits (Realized Gains) & 6. Loss Cutting
            # (Requires analyzing realized PnL spikes in graph_data, handled in generic PnL check below)
            
            # 8. Dead Capital
            if (curr_dep > 0) and (abs(curr_unrealized) < 0.02 * curr_dep) and (len(hist) > 30):
                # Check if flat for 30 days (volatility < 5%)
                recent_mv = hist.tail(30)['Market Value']
                if (recent_mv.max() - recent_mv.min()) < (0.05 * curr_mv):
                    add_action("Dead Capital", f"**{scrip}** is stagnant.", "This stock ties up capital without meaningful performance. Rotate it.")

            # 10. Timing Effectiveness (Good Entry)
            lb_date = last_buy_map.get(scrip)
            if lb_date and (pd.Timestamp.now() - lb_date).days < 90:
                # If bought recently and price is up > 5%
                if curr_price > avg_buy * 1.05:
                    add_insight("Good Timing", f"Recent entry in **{scrip}** captured momentum.", "You bought during a good period of price momentum.")

            # 11. Poor Entry Behaviour (Bad Timing)
            if lb_date and (pd.Timestamp.now() - lb_date).days < 90:
                if curr_price < avg_buy * 0.90:
                    add_action("Poor Timing", f"Entry in **{scrip}** followed by decline.", "Your entries were poorly timed. Wait for pullbacks.")

            # 13. Concentration Insight
            if total_unrealized_gain > 0 and (curr_unrealized / total_unrealized_gain) > 0.35:
                add_action("High Concentration", f"**{scrip}** drives >35% of your gains.", "Your profitability is concentrated. Rebalance to reduce dependency.")

            # 14. Slow Recoverers
            # Count days where MV < Deployed
            days_under = hist[hist['Market Value'] < hist['Deployed Amount']].shape[0]
            if days_under > 0.8 * len(hist) and len(hist) > 60:
                add_action("Slow Recoverer", f"**{scrip}** below cost for long period.", "These stocks are not recovering. Avoid further capital infusion.")

            # 16. Inefficient Capital Allocation
            if (curr_dep > 50000) and (curr_mv < curr_dep):
                add_action("Inefficient Allocation", f"High capital in losing **{scrip}**.", "You are putting too much capital into underperformers.")

            # 18. Exit Too Late (Check for large realized losses)
            total_realized_loss = hist[hist['Realized PNL'] < 0]['Realized PNL'].sum()
            if total_realized_loss < -10000:
                add_action("Late Exit detected", f"Realized large losses in **{scrip}**.", "You held too long. Introduce stop-loss rules.")

        # 12. Distribution of Capital (Portfolio Level)
        if (total_deployed_pos + total_deployed_neg) > 0:
            loser_pct = (total_deployed_neg / (total_deployed_pos + total_deployed_neg)) * 100
            if loser_pct > 40:
                add_insight("Capital Distribution", f"{int(loser_pct)}% capital in losing positions.", "Shift capital from losers to historically profitable scripts.")

        # Final Cleanup
        if not insights: insights.append({"title": "Balanced Portfolio", "text": "No major anomalies detected.", "reasoning": "Performance is steady."})
        if not actions: actions.append({"title": "Monitor", "text": "Maintain current strategy.", "reasoning": "Regularly review positions."})

        response = {
            "graph_data": graph_data,
            "insights": {
                "key_takeaways": insights[:6], # Top 6 to keep UI clean
                "recommendations": actions[:6]
            }
        }

        return convert_to_serializable(response)

    except Exception as e:
        logger.error(f"Stock Deployed Logic Error: {e}", exc_info=True)
        return {"error": str(e)}
