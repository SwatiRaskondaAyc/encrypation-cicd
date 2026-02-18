# Portfolio_Analysis/Calculations/insights.py

import pandas as pd
import logging
from typing import Dict, Tuple, Optional

# Import from utils
from File_Handler.utils.utils import (
    format_inr_currency, 
    clean_numeric_columns, 
    normalise_portfolio_columns
)

logger = logging.getLogger(__name__)

class PortfolioInsightsCalc:
    """
    Pure calculation helpers for portfolio-level insights.
    """
    @staticmethod
    def latest_snapshot(
        portfolio_df: pd.DataFrame,
        filter_positive_qty: bool = False
    ) -> Tuple[pd.DataFrame, Optional[pd.Timestamp]]:
        
        if portfolio_df is None or portfolio_df.empty:
            return pd.DataFrame(), None
        
        df = normalise_portfolio_columns(portfolio_df)
        
        if "Date" not in df.columns:
            return pd.DataFrame(), None
            
        latest_date = df["Date"].max()
        if pd.isna(latest_date):
            return pd.DataFrame(), None
            
        latest_data = df[df["Date"] == latest_date].copy()
        
        if filter_positive_qty and "Remaining Qty" in latest_data.columns:
            latest_data = latest_data[latest_data["Remaining Qty"] > 0].copy()
            
        return latest_data, latest_date

    @staticmethod
    def compute_latest_portfolio_values(portfolio_df: pd.DataFrame) -> Dict:
        """
        High-level wrapper used by the UI.
        """
        latest_data, latest_date = PortfolioInsightsCalc.latest_snapshot(
            portfolio_df, filter_positive_qty=False
        )

        if latest_data.empty or latest_date is None:
            return {}

        numeric_columns = [
            "Deployed Amount",
            "Market Value",
            "Unrealized PNL",
            "Realized PNL",
            "Brokerage Amount",
        ]
        
        # Use the centralized cleaner
        latest_data = clean_numeric_columns(latest_data, numeric_columns)
        
        current_value = float(latest_data["Market Value"].sum(skipna=True) or 0.0)
        deployed_amount = float(latest_data["Deployed Amount"].sum(skipna=True) or 0.0)
        unrealized_pnl = float(latest_data["Unrealized PNL"].sum(skipna=True) or 0.0)
        realized_pnl = float(latest_data["Realized PNL"].sum(skipna=True) or 0.0)
        brokerage_amount = float(latest_data["Brokerage Amount"].sum(skipna=True) or 0.0)
        
        percent_change = 0.0
        if deployed_amount != 0:
            percent_change = (current_value - deployed_amount) / deployed_amount * 100.0
            
        return {
            "latest_date": latest_date.strftime("%Y-%m-%d"),
            "current_value": current_value,
            "deployed_amount": deployed_amount,
            "percent_change": round(percent_change, 2),
            "unrealized_pnl": unrealized_pnl,
            "realized_pnl": realized_pnl,
            "brokerage_amount": brokerage_amount,
            "formatted": {
                 "current_value": format_inr_currency(current_value),
                 "deployed_amount": format_inr_currency(deployed_amount),
                 "unrealized_pnl": format_inr_currency(unrealized_pnl),
                 "realized_pnl": format_inr_currency(realized_pnl)
            }
        }

def get_portfolio_summary(portfolio_df: pd.DataFrame, closed_trades_df: pd.DataFrame = None) -> dict:
    """
    Wrapper that matches the signature expected by Orchestrator.
    Delegates to PortfolioInsightsCalc.
    """
    try:
        data = PortfolioInsightsCalc.compute_latest_portfolio_values(portfolio_df)
        
        if not data: return {}

        # 1. Best/Worst from HOLDINGS (Unrealized)
        latest_data, _ = PortfolioInsightsCalc.latest_snapshot(portfolio_df)
        unrealized_best = (None, -float('inf'))
        unrealized_worst = (None, float('inf'))

        if latest_data is not None and not latest_data.empty:
             latest_data = clean_numeric_columns(latest_data, ["Unrealized PNL"])
             if "Unrealized PNL" in latest_data.columns:
                 latest_data["Unrealized PNL"] = latest_data["Unrealized PNL"].fillna(0)
                 
                 if not latest_data.empty:
                     # Find max
                     best_idx = latest_data["Unrealized PNL"].idxmax()
                     best_row = latest_data.loc[best_idx]
                     best_val = float(best_row["Unrealized PNL"])
                     best_sym = best_row.get("Symbol", best_row.get("Scrip"))
                     unrealized_best = ({"symbol": best_sym, "unrealized_pnl": best_val, "type": "Unrealized"}, best_val)

                     # Find min
                     worst_idx = latest_data["Unrealized PNL"].idxmin()
                     worst_row = latest_data.loc[worst_idx]
                     worst_val = float(worst_row["Unrealized PNL"])
                     worst_sym = worst_row.get("Symbol", worst_row.get("Scrip"))
                     unrealized_worst = ({"symbol": worst_sym, "unrealized_pnl": worst_val, "type": "Unrealized"}, worst_val)

        # 2. Best/Worst from CLOSED TRADES (Realized) - Aggregated by Symbol
        realized_best = (None, -float('inf'))
        realized_worst = (None, float('inf'))

        if closed_trades_df is not None and not closed_trades_df.empty:
            # Group by Symbol to find total realized PnL per stock
            # Or group by (Symbol, Sell_Date) for "Best Single Trade Event"?
            # User likely wants "Best Stock Trade"
            
            # Aggregate by Symbol AND Sell_Date to identify specific "Best Trades"
            # rather than lifetime realized PnL for a stock.
            realized_agg = closed_trades_df.groupby(['Symbol', 'Sell_Date'])['Realized_PnL'].sum()
            
            if not realized_agg.empty:
                # Max Realized
                r_best_idx = realized_agg.idxmax() # (Symbol, Date)
                r_best_val = float(realized_agg.max())
                # Unpack tuple index (Symbol, Date) -> Symbol for display
                r_best_sym = r_best_idx[0] 
                realized_best = ({"symbol": r_best_sym, "unrealized_pnl": r_best_val, "type": "Realized"}, r_best_val)
                
                # Min Realized
                r_worst_idx = realized_agg.idxmin()
                r_worst_val = float(realized_agg.min())
                r_worst_sym = r_worst_idx[0]
                realized_worst = ({"symbol": r_worst_sym, "unrealized_pnl": r_worst_val, "type": "Realized"}, r_worst_val)

        # 3. Compare and Pick Winner/Loser
        # Default to unrealized if no realized, or vice versa
        
        # Best
        final_best = {}
        if unrealized_best[0] and realized_best[0]:
            final_best = unrealized_best[0] if unrealized_best[1] >= realized_best[1] else realized_best[0]
        elif unrealized_best[0]:
            final_best = unrealized_best[0]
        elif realized_best[0]:
            final_best = realized_best[0]
            
        # Worst
        final_worst = {}
        if unrealized_worst[0] and realized_worst[0]:
            final_worst = unrealized_worst[0] if unrealized_worst[1] <= realized_worst[1] else realized_worst[0]
        elif unrealized_worst[0]:
            final_worst = unrealized_worst[0]
        elif realized_worst[0]:
            final_worst = realized_worst[0]

        summary = {
            "latest_date": data.get("latest_date"),
            "total_deployed_amount": data.get("deployed_amount"),
            "current_market_value": data.get("current_value"),
            "overall_pnl": data.get("realized_pnl") + data.get("unrealized_pnl"),
            "overall_return_percentage": data.get("percent_change"),
            "total_realized_pnl": data.get("realized_pnl"),
            "total_unrealized_pnl": data.get("unrealized_pnl"),
            "best_performer": final_best,
            "worst_performer": final_worst
        }
        return summary

    except Exception as e:
        logger.error(f"get_portfolio_summary failed: {e}")
        return {}
    
    
    
def generate_graph_insights(graph_id: str, portfolio_df: pd.DataFrame, transactions_df: pd.DataFrame) -> dict:
    """
    Generates dynamic AI-style insights for each graph type.
    """
    insights = {"key_takeaways": [], "recommendations": []}
    
    try:
        if graph_id == "top_performing":
            # Calculate top/bottom performers
            latest = portfolio_df.sort_values('Date').groupby('Symbol').last()
            latest['pnl_pct'] = ((latest['Current_Value'] - latest['Deployed_Amt']) / latest['Deployed_Amt'] * 100)
            top_3 = latest.nlargest(3, 'pnl_pct')
            bottom_3 = latest.nsmallest(3, 'pnl_pct')
            
            insights["key_takeaways"] = [
                f"Top performer: {top_3.index[0]} with {top_3['pnl_pct'].iloc[0]:.1f}% returns",
                f"Weakest stock: {bottom_3.index[0]} with {bottom_3['pnl_pct'].iloc[0]:.1f}% returns",
                f"Average portfolio return: {latest['pnl_pct'].mean():.1f}%"
            ]
            insights["recommendations"] = [
                "Consider booking profits in top performers if they exceed your target allocation",
                "Review fundamentals of underperforming stocks for hold/sell decision"
            ]
            
        elif graph_id == "portfolio_health":
            total_invested = portfolio_df['Deployed_Amt'].iloc[-1]
            current_value = portfolio_df['Current_Value'].iloc[-1]
            pnl_pct = ((current_value - total_invested) / total_invested * 100)
            
            insights["key_takeaways"] = [
                f"Total capital deployed: ₹{total_invested:,.0f}",
                f"Current portfolio value: ₹{current_value:,.0f}",
                f"Overall return: {pnl_pct:.1f}%"
            ]
            
        elif graph_id == "risk_return":
            # Add risk-specific insights
            insights["key_takeaways"] = [
                "Stocks are classified into 4 quadrants based on volatility and returns",
                "High Return-Low Risk stocks are ideal performers",
                "High Risk-Low Return stocks need immediate review"
            ]
            insights["recommendations"] = [
                "Focus on accumulating High Return-Low Risk stocks",
                "Consider exiting High Risk-Low Return positions"
            ]
            
        # Add more graph-specific insights here...
        else:
            insights["key_takeaways"] = ["Graph generated successfully"]
            
    except Exception as e:
        logger.error(f"Insight generation failed for {graph_id}: {e}")
        insights["key_takeaways"] = ["Unable to generate insights"]
    
    return insights

