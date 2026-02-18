import logging
import pandas as pd
import numpy as np
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.utils import normalise_portfolio_columns, clean_numeric_columns

logger = logging.getLogger(__name__)

def turnover_analysis_logic(portfolio_df: pd.DataFrame, transaction_df: pd.DataFrame) -> dict:
    """
    Analyzes Monthly Deployed Capital and Transaction Turnover stats with Deep, Descriptive Insights.
    """
    try:
        # 1. SETUP & CLEANING
        # ---------------------------------------------------------
        pf_df = normalise_portfolio_columns(portfolio_df)
        pf_numeric = ['Deployed Amount', 'Market Value', 'Realized PNL']
        pf_df = clean_numeric_columns(pf_df, pf_numeric)
        
        if 'Date' in pf_df.columns:
            pf_df['Date'] = pd.to_datetime(pf_df['Date'], errors='coerce')
        
        txn_df = transaction_df.copy()
        if 'Trade_Date' in txn_df.columns:
            txn_df['Trade_Date'] = pd.to_datetime(txn_df['Trade_Date'], errors='coerce')
        
        if 'Turnover' not in txn_df.columns:
            txn_df['Qty'] = pd.to_numeric(txn_df.get('Qty', 0), errors='coerce').fillna(0)
            txn_df['Mkt_Price'] = pd.to_numeric(txn_df.get('Mkt_Price', 0), errors='coerce').fillna(0)
            txn_df['Turnover'] = txn_df['Qty'] * txn_df['Mkt_Price']

        # 2. DATA TRANSFORMATION
        # ---------------------------------------------------------
        
        # A) Monthly Deployed Amounts
        deployed_monthly = (
            pf_df
            .groupby(pd.Grouper(key='Date', freq='ME'))['Deployed Amount']
            .sum()
            .reset_index(name='MonthlySum')
        )
        
        dep_vals = deployed_monthly['MonthlySum'].tolist()
        deployed_metrics = {
            'min': float(deployed_monthly['MonthlySum'].min() or 0),
            'max': float(deployed_monthly['MonthlySum'].max() or 0),
            'mean': float(deployed_monthly['MonthlySum'].mean() or 0),
            'median': float(deployed_monthly['MonthlySum'].median() or 0),
            'std': float(deployed_monthly['MonthlySum'].std() or 0)
        }

        # B) Monthly Turnover Analysis
        txn_df['Month'] = txn_df['Trade_Date'].dt.to_period('M')
        
        def upper_fence(s: pd.Series) -> float:
            if s.empty: return 0.0
            q1 = s.quantile(0.25)
            q3 = s.quantile(0.75)
            iqr = q3 - q1
            return q3 + 1.5 * iqr

        turnover_by_month = []
        turnover_outliers_count = 0
        
        for month, group in txn_df.groupby('Month'):
            series = group['Turnover']
            if series.empty: continue
            uf = upper_fence(series)
            vals = series.tolist() 
            turnover_outliers_count += series[series > uf].count()
            
            turnover_by_month.append({
                'month': str(month),
                'values': vals
            })

        # C) Turnover Stats
        turnover_stats_df = (
            txn_df
            .groupby('Month')['Turnover']
            .agg(avg='mean', median='median', sum='sum', count='count', std='std')
            .reset_index()
        )
        
        stats = {
            'months': turnover_stats_df['Month'].astype(str).tolist(),
            'avg': turnover_stats_df['avg'].tolist(),
            'median': turnover_stats_df['median'].tolist(),
            'total_volume': turnover_stats_df['sum'].tolist(),
            'trade_count': turnover_stats_df['count'].tolist()
        }

        graph_data = {
            'deployed_amounts': dep_vals,
            'deployed_metrics': deployed_metrics,
            'turnover_by_month': turnover_by_month,
            'turnover_stats': stats,
        }

        # 3. INSIGHT ENGINE (DESCRIPTIVE & SPECIFIC)
        # ---------------------------------------------------------
        insights = []
        actions = []
        
        def add_insight(title, text, reasoning):
            insights.append({"title": title, "text": text, "reasoning": reasoning})
        def add_action(title, text, reasoning):
            actions.append({"title": title, "text": text, "reasoning": reasoning})

        # --- 0. GRAPH GUIDE (How to read this) ---
        add_insight(
            "📖 How to Read This Graph",
            "**Orange Boxes:** Range of your trade sizes. **Blue Line:** Your average trade value. **Grey Bars:** Total number of trades.",
            "Use this to see if you are Overtrading (High Grey Bars) or making erratic decisions (Very Tall Orange Boxes)."
        )

        # Pre-calculations
        mean_dep = deployed_metrics['mean']
        median_dep = deployed_metrics['median']
        max_dep = deployed_metrics['max']
        min_dep = deployed_metrics['min']
        
        # Helper to get formatted month name
        def get_month_name(df_row):
            if hasattr(df_row, 'Date'): return df_row['Date'].strftime('%B %Y') # Deployed df
            if hasattr(df_row, 'Month'): return df_row['Month'].strftime('%B %Y') # Turnover df
            return "Unknown Date"

        # 1. Monthly Investment Volatility
        if deployed_metrics['max'] > (deployed_metrics['min'] * 5) and deployed_metrics['min'] > 0:
             # Find specific months
             max_row = deployed_monthly.loc[deployed_monthly['MonthlySum'].idxmax()]
             min_row = deployed_monthly.loc[deployed_monthly['MonthlySum'].idxmin()]
             
             add_action(
                 "Volatile Deployment", 
                 f"Your investing fluctuated heavily between **{get_month_name(min_row)}** (Low) and **{get_month_name(max_row)}** (High).", 
                 "Inconsistent capital deployment makes it impossible to 'Average Out' market risk. You risk buying too little at bottoms and too much at tops."
             )

        # 2. Peak Deployment Months
        peak_months = deployed_monthly[deployed_monthly['MonthlySum'] > (max_dep * 0.95)]
        if not peak_months.empty:
            m_name = get_month_name(peak_months.iloc[0])
            add_insight(
                "Peak Aggression", 
                f"You went 'All In' during **{m_name}**.", 
                "Check the market index for that month. If the market was at an All-Time High then, you likely chased momentum, which increases your portfolio's break-even point."
            )

        # 3. Investment Pauses
        low_months = deployed_monthly[deployed_monthly['MonthlySum'] < (min_dep * 1.1)]
        if not low_months.empty:
            m_name = get_month_name(low_months.iloc[0])
            add_insight(
                "Investment Freeze", 
                f"You barely invested anything during **{m_name}**.", 
                "If the market was crashing then, you missed a prime buying opportunity due to fear. Consistent SIPs beat timing attempts."
            )

        # 6. Turnover Outliers (Whale Trades)
        if turnover_outliers_count > 3:
            add_action(
                "Erratic Trade Sizes", 
                "We detected months with massive 'Whale Trades' alongside tiny trades.", 
                "This indicates emotional sizing. If you double your bet size to recover losses, a single bad trade can wipe out months of small gains."
            )

        # 7. Passive Holding
        quiet_months = turnover_stats_df[turnover_stats_df['median'] < 1000]
        if len(quiet_months) > 2:
            m_name = get_month_name(quiet_months.iloc[0])
            add_insight(
                "Passive Holding", 
                f"Activity dropped significantly around **{m_name}**.", 
                "This is good! It means you let your winners run without interference. Boredom is often profitable in investing."
            )
        
        # 13. Impulse Trading (High Turnover, Low Asset Change)
        turnover_cv = (turnover_stats_df['sum'].std() / turnover_stats_df['sum'].mean()) if not turnover_stats_df.empty else 0
        deployed_cv = (deployed_metrics['std'] / deployed_metrics['mean']) if deployed_metrics['mean'] > 0 else 0
        
        if turnover_cv > (deployed_cv * 2):
            add_action(
                "Churning Money", 
                "Your trading volume is fluctuating wildy, but your total invested capital is stable.", 
                "You are likely entering and exiting positions too quickly. This 'Churn' eats profits through brokerage fees and taxes without actually growing the portfolio."
            )

        # 15. Concentrated Activity
        max_turnover_month_idx = turnover_stats_df['sum'].idxmax() if not turnover_stats_df.empty else None
        total_turnover_year = turnover_stats_df['sum'].sum() if not turnover_stats_df.empty else 0
        
        if max_turnover_month_idx is not None:
            max_row = turnover_stats_df.iloc[max_turnover_month_idx]
            if total_turnover_year > 0 and (max_row['sum'] / total_turnover_year) > 0.30:
                add_action(
                    "Panic or Euphoria?", 
                    f"**{get_month_name(max_row)}** accounted for >30% of your entire year's trading volume.", 
                    "Concentrating decisions into one month is risky. If that month's thesis was wrong, it impacts your whole year's performance."
                )

        # 17. Trading Fatigue
        if len(turnover_stats_df) > 3:
            last_3 = turnover_stats_df.tail(3)['sum'].tolist()
            if last_3[0] > (last_3[1] * 2) and last_3[1] > (last_3[2] * 2):
                add_action(
                    "Trading Fatigue", 
                    "Your activity has nose-dived over the last 3 months.", 
                    "This often happens after a loss or burnout. Take a break, but ensure you aren't ignoring your portfolio completely."
                )

        # Final Cleanup
        if len(insights) == 1: # Only guide exists
            insights.append({"title": "Steady Ship", "text": "Your turnover and deployment are remarkably consistent.", "reasoning": "Consistency is the hallmark of a mature investor."})

        response = {
            "graph_data": graph_data,
            "insights": {
                "key_takeaways": insights[:6],
                "recommendations": actions[:6]
            }
        }

        return convert_to_serializable(response)

    except Exception as e:
        logger.error(f"Turnover Analysis Logic Error: {e}", exc_info=True)
        return {"error": str(e)}
