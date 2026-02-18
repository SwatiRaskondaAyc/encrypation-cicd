import logging
import pandas as pd
import numpy as np
from File_Handler.utils.JSON_Cleaner import convert_to_serializable

logger = logging.getLogger(__name__)

def top_10_Scrips_combined(portfolio_df: pd.DataFrame) -> dict:
    """
    Analyzes portfolio for Top Performers, Efficiency, and Risk scenarios.
    Input: Cleaned DataFrame from RepeatedCalc/Orchestrator.
    Output: JSON-serializable dict with graph data + deep insights.
    """
    try:
        # 1. SETUP & SNAPSHOT
        # We trust the orchestrator has normalized columns. 
        # However, we need a standard 'Scrip' identifier for the frontend.
        df = portfolio_df.copy()
        
        # Standardize Label: Use Symbol if available (mapped), else Scrip_Name
        if 'Symbol' in df.columns:
            df['Scrip'] = df['Symbol']
        elif 'Scrip_Name' in df.columns:
            df['Scrip'] = df['Scrip_Name']
        else:
            df['Scrip'] = "Unknown"

        # Get Latest Snapshot (Graph shows CURRENT state)
        if 'Date' in df.columns:
            latest_date = df['Date'].max()
            latest_data = df[df['Date'] == latest_date].copy()
        else:
            latest_data = df.copy()

        if latest_data.empty:
            return {"error": "No data available"}

        # Ensure numeric columns for math (just in case)
        calc_cols = ['Brokerage_Amount', 'Realized_PNL', 'Unrealized_PNL', 'Deployed_Amt']
        for c in calc_cols:
            if c in latest_data.columns:
                latest_data[c] = pd.to_numeric(latest_data[c], errors='coerce').fillna(0.0)
            else:
                latest_data[c] = 0.0

        # 2. GRAPH DATA (The "What")
        def get_lists(col, n=10, ascending=False):
            sub = latest_data.sort_values(by=col, ascending=ascending).head(n)
            return {
                "labels": sub['Scrip'].tolist(),
                "values": sub[col].tolist()
            }

        # Frontend expects these exact keys
        graph_data = {
            "unrealized_gainers": get_lists('Unrealized_PNL', 10, False),
            "realized_gainers": get_lists('Realized_PNL', 10, False),
            "unrealized_losers": get_lists('Unrealized_PNL', 10, True),
            "brokerage_highest": get_lists('Brokerage_Amount', 10, False),
            "has_brokerage": (latest_data['Brokerage_Amount'].sum() != 0)
        }

        # 3. INSIGHT ENGINE (The "Why")
        insights = []
        actions = []

        # Pre-calculate Row-wise Metrics
        latest_data['Total_PNL'] = latest_data['Realized_PNL'] + latest_data['Unrealized_PNL']
        total_deployed = latest_data['Deployed_Amt'].sum()
        total_pnl_abs = latest_data['Total_PNL'].abs().sum()

        def add_item(target_list, title, text, reasoning):
            target_list.append({"title": title, "text": text, "reasoning": reasoning})

        # --- Scenario 1.1: Best Overall Performers ---
        top_overall = latest_data.sort_values('Total_PNL', ascending=False).head(3)
        if not top_overall.empty and top_overall['Total_PNL'].iloc[0] > 0:
            names = ", ".join(top_overall['Scrip'].tolist())
            contrib = int((top_overall['Total_PNL'].sum() / max(latest_data[latest_data['Total_PNL']>0]['Total_PNL'].sum(), 1)) * 100)
            add_item(insights, "Powerhouse Stocks", 
                     f"**{names}** are your heavy lifters.",
                     f"These 3 stocks alone generated {contrib}% of your portfolio's total positive gains (Realized + Unrealized).")

        # --- Scenario 1.2: Conviction Plays (Good Trading + Good Holding) ---
        # Intersection of top realized and top unrealized
        realized_set = set(latest_data.nlargest(5, 'Realized_PNL')['Scrip'])
        unrealized_set = set(latest_data.nlargest(5, 'Unrealized_PNL')['Scrip'])
        common = list(realized_set.intersection(unrealized_set))
        if common:
            names = ", ".join(common[:3])
            add_item(insights, "Conviction Plays",
                     f"Strong trading alignment in **{names}**.",
                     f"You have successfully booked profits in these stocks in the past AND currently hold winning positions in them again. This shows a repeatable edge.")

        # --- Scenario 2.2: Capital Trap (Bag Holders) ---
        # High Deployed (>10%) + Deep Loss
        traps = latest_data[
            (latest_data['Deployed_Amt'] > (total_deployed * 0.10)) & 
            (latest_data['Unrealized_PNL'] < 0)
        ]
        if not traps.empty:
            names = ", ".join(traps['Scrip'].tolist())
            loss_pct = int((traps['Unrealized_PNL'].sum() / traps['Deployed_Amt'].sum()) * 100)
            add_item(insights, "Capital Trap Risk",
                     f"Large capital stuck in **{names}**.",
                     f"These positions hold >10% of your total capital but are down {loss_pct}%. This dead capital has a high opportunity cost compared to trending assets.")
            add_item(actions, "Reallocate Capital",
                     f"Consider trimming **{names}**.",
                     "Freeing up this trapped capital allows you to deploy into stocks that are actually working, rather than hoping for a break-even.")

        # --- Scenario 3.1: High Brokerage / Low Returns (Churning) ---
        # Brokerage > 20% of PnL
        inefficient = latest_data[
            (latest_data['Brokerage_Amount'] > 500) & 
            (latest_data['Total_PNL'] > 0) & 
            ((latest_data['Brokerage_Amount'] / latest_data['Total_PNL']) > 0.20)
        ]
        if not inefficient.empty:
            names = ", ".join(inefficient.head(3)['Scrip'].tolist())
            add_item(actions, "Reduce Churn",
                     f"Brokerage is eating profits in **{names}**.",
                     f"For these stocks, you pay >20% of your profits in fees. You are likely over-trading small moves. Try holding longer or trading larger timeframes.")

        # --- Scenario 4.2: Concentration Risk ---
        # Do top 20% stocks hold 80% of profit?
        winners = latest_data[latest_data['Total_PNL'] > 0].sort_values('Total_PNL', ascending=False)
        if not winners.empty:
            total_win = winners['Total_PNL'].sum()
            top_20_idx = int(max(len(winners) * 0.2, 1))
            top_20_val = winners.head(top_20_idx)['Total_PNL'].sum()
            concentration = top_20_val / total_win
            
            if concentration > 0.80:
                add_item(insights, "High Concentration",
                         "Your portfolio gains are very concentrated.",
                         f"Just {top_20_idx} stocks account for {int(concentration*100)}% of your total profits. While this drives alpha, a reversal in these few names will hurt disproportionately.")

        # --- Scenario 5: Zombie Stocks (Dead Money) ---
        # >5% Capital, ROI between -2% and 2%
        zombies = latest_data[
            (latest_data['Deployed_Amt'] > (total_deployed * 0.05)) &
            ((latest_data['Total_PNL'] / latest_data['Deployed_Amt']).between(-0.02, 0.02))
        ]
        if not zombies.empty:
            names = ", ".join(zombies.head(3)['Scrip'].tolist())
            add_item(actions, "Wake Up Dead Money",
                     f"Review **{names}**.",
                     f"These stocks hold significant capital but have barely moved (-2% to +2%). If they aren't paying dividends, inflation is eroding this capital's real value.")

        # Final Response Structure
        response = {
            "graph_data": graph_data,
            "insights": {
                "key_takeaways": insights if insights else [{"title": "Balanced Portfolio", "text": "No extreme outliers detected.", "reasoning": "Metrics are within standard deviations."}],
                "recommendations": actions if actions else [{"title": "Monitor", "text": "Continue regular reviews.", "reasoning": "Portfolio health looks stable."}]
            }
        }

        # 4. SERIALIZE (Use your existing utility to fix numpy issues)
        return convert_to_serializable(response)

    except Exception as e:
        logger.error(f"Top Performing Logic Error: {e}", exc_info=True)
        return {"error": str(e)}
