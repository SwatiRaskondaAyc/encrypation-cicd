
import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

def create_underwater_plot(portfolio_df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
    """
    Generates data for the Underwater Plot (Drawdown Analysis).
    """
    try:
        if portfolio_df.empty:
            return {"error": "Portfolio history is empty"}

        daily_df = portfolio_df.groupby('Date').agg({
            'Deployed_Amount': 'sum',
            'Market_Value': 'sum'
        }).reset_index().sort_values('Date')

        daily_df['Date_Str'] = daily_df['Date'].dt.strftime('%Y-%m-%d')
        daily_df['Peak_Value'] = daily_df['Market_Value'].cummax()
        
        # Calculate Drawdown
        # Formula: (Current - Peak) / Peak
        daily_df['Drawdown_Pct'] = np.where(
            daily_df['Peak_Value'] > 0,
            (daily_df['Market_Value'] - daily_df['Peak_Value']) / daily_df['Peak_Value'] * 100,
            0.0
        )
        
        # ------------------------------------------------------------------
        # Advanced Insight Generation
        # ------------------------------------------------------------------
        insights = _generate_advanced_insights(daily_df, portfolio_df)

        return {
            "graph_data": {
                "dates": daily_df['Date_Str'].tolist(),
                "invested_value": daily_df['Deployed_Amount'].round(2).tolist(),
                "portfolio_value": daily_df['Market_Value'].round(2).tolist(),
                "drawdown_pct": daily_df['Drawdown_Pct'].round(2).tolist(),
                "colors": {
                    "invested": "#6A5ACD",    
                    "portfolio": "#00C49F",   
                    "drawdown": "#FF8042"     
                }
            },
            "insights": {
                "key_takeaways": insights
            }
        }

    except Exception as e:
        logger.error(f"Underwater Analysis Failed: {str(e)}")
        return {"error": str(e)}

def _generate_advanced_insights(daily_df: pd.DataFrame, full_df: pd.DataFrame) -> List[Dict[str, str]]:
    insights = []

    # 1. Guide / Explanation (First Item)
    insights.append({
        "type": "guide",
        "title": "Understanding this Graph",
        "text": "**Drawdown** measures the decline from a historical peak. "
                "**Invested Capital** (Dashed) is your cost basis. "
                "**Portfolio Value** (Solid) is the current market value. "
                "The **Red Area** shows the depth of the drop.",
        "reasoning": "This graph highlights downside volatility and capital preservation."
    })
    
    # --- Helper Data Prep ---
    dd_series = daily_df['Drawdown_Pct'].values
    dates = daily_df['Date'].values
    
    # Identify Episodes: Continuous periods where DD < 0
    episodes = []
    current_episode = None
    
    for i, dd in enumerate(dd_series):
        if dd < -0.01: # Threshold for "underwater" (negligible noise ignored)
            if current_episode is None:
                current_episode = {'start_idx': i, 'min_dd': dd, 'min_idx': i}
            else:
                if dd < current_episode['min_dd']:
                    current_episode['min_dd'] = dd
                    current_episode['min_idx'] = i
        else:
            if current_episode:
                current_episode['end_idx'] = i
                episodes.append(current_episode)
                current_episode = None
                
    if current_episode: # ongoing episode
        current_episode['end_idx'] = len(dd_series) - 1
        episodes.append(current_episode)

    # --- 1. Maximum Drawdown (Worst Pain Point) ---
    max_dd_row = daily_df.loc[daily_df['Drawdown_Pct'].idxmin()]
    max_dd_val = max_dd_row['Drawdown_Pct']
    max_dd_date = max_dd_row['Date']
    
    insights.append({
        "title": "Maximum Drawdown (Severe Pain Point)",
        "text": f"Your worst loss from peak was **{max_dd_val:.2f}%**, hitting bottom on **{max_dd_date.strftime('%d-%b-%Y')}**.",
        "reasoning": "This defines your historical worst-case scenario. Assessing how you felt during this drop reveals your true risk tolerance."
    })

    # --- 2. Current Drawdown Status ---
    current_dd = dd_series[-1]
    last_date = daily_df.iloc[-1]['Date']
    status_text = "at an All-Time High!" if current_dd > -0.5 else f"**{abs(current_dd):.2f}%** below your peak."
    
    insights.append({
        "title": "Current Status",
        "text": f"As of {last_date.strftime('%d-%b-%Y')}, you are {status_text}",
        "reasoning": "Distance from peak indicates how much recovery is needed to break even."
    })

    # --- 3. Recovery Time Analysis ---
    if episodes:
        # Calculate lengths
        for ep in episodes:
            ep['duration_days'] = (dates[ep['end_idx']] - dates[ep['start_idx']]).astype('timedelta64[D]').astype(int)
        
        longest_episode = max(episodes, key=lambda x: x['duration_days'])
        
        insights.append({
            "title": "Longest Time Underwater",
            "text": f"Your longest continuous underwater stretch lasted **{longest_episode['duration_days']} days** "
                    f"(from {pd.to_datetime(dates[longest_episode['start_idx']]).strftime('%b %Y')} "
                    f"to {pd.to_datetime(dates[longest_episode['end_idx']]).strftime('%b %Y')}).",
            "reasoning": "Long recovery periods test patience more than sharp drops."
        })
        
        # Avg Recovery
        avg_recovery = np.mean([e['duration_days'] for e in episodes])
        insights.append({
            "title": "Average Stagnation Period",
            "text": f"On average, once your portfolio goes underwater, it stays there for about **{int(avg_recovery)} days**.",
            "reasoning": "This sets a realistic expectation for waiting out downtrends."
        })

    # --- 4. Drawdown Zones (Time Spent) ---
    total_days = len(daily_df)
    mild_days = len(daily_df[(daily_df['Drawdown_Pct'] < 0) & (daily_df['Drawdown_Pct'] >= -5)])
    severe_days = len(daily_df[daily_df['Drawdown_Pct'] < -15])
    
    mild_pct = (mild_days / total_days) * 100
    severe_pct = (severe_days / total_days) * 100
    
    insights.append({
        "title": "Time in Drawdown Zones",
        "text": f"You spent **{mild_pct:.0f}%** of the time in mild drawdowns (<5%) and **{severe_pct:.0f}%** in severe drawdowns (>15%).",
        "reasoning": "A high % in severe drawdowns indicates a highly volatile or risky portfolio strategy."
    })

    # --- 5. Volatility / Jumpy Drawdowns ---
    # Std dev of drawdown pct
    dd_volatility = np.std(dd_series)
    vol_desc = "Stable" if dd_volatility < 5 else "Volatile"
    
    insights.append({
        "title": "Drawdown Volatility",
        "text": f"Your drawdown curve volatility is **{dd_volatility:.2f}%**. This is considered **{vol_desc}**.",
        "reasoning": "Lower volatility implies smoother rides, even if returns are lower."
    })

    # --- 6. Return / Pain Ratio ---
    # Simple CAGR estimate: (End / Start)^(365/days) - 1
    # Note: Requires > 1 year for accuracy, but we'll approximate
    start_val = daily_df.iloc[0]['Market_Value']
    end_val = daily_df.iloc[-1]['Market_Value']
    days_total = (daily_df.iloc[-1]['Date'] - daily_df.iloc[0]['Date']).days
    
    if days_total > 30 and start_val > 0 and abs(max_dd_val) > 0:
        cagr = (end_val / start_val) ** (365 / days_total) - 1
        pain_ratio = (cagr * 100) / abs(max_dd_val)
        
        # Interpret
        quality = "Excellent" if pain_ratio > 1 else ("Good" if pain_ratio > 0.5 else "Poor")
        
        insights.append({
            "title": "Return-to-Pain Ratio",
            "text": f"Your Score is **{pain_ratio:.2f}** ({quality}). (CAGR: {cagr*100:.1f}% / Max DD: {abs(max_dd_val):.1f}%)",
            "reasoning": "Indicates how much return you are extracting for every unit of max downside risk."
        })

    # --- 7. Largest Drop Contributor (Culprit Analysis) ---
    # Find the single day with biggest negative DD change
    daily_df['DD_Change'] = daily_df['Drawdown_Pct'].diff()
    worst_day_row = daily_df.loc[daily_df['DD_Change'].idxmin()]
    
    # Re-run granular check for just this ONE worst day to be specific
    w_date = worst_day_row['Date']
    w_dd_change = worst_day_row['DD_Change']
    
    # Get that day's data
    day_holdings = full_df[full_df['Date'] == w_date]
    prev_idx_loc = daily_df.index.get_loc(worst_day_row.name) - 1
    if prev_idx_loc >= 0:
        prev_date = daily_df.iloc[prev_idx_loc]['Date']
        prev_holdings = full_df[full_df['Date'] == prev_date].set_index('Symbol')
        
        culprit = None
        max_val_loss = 0
        
        for _, stock in day_holdings.iterrows():
            sym = stock['Symbol']
            if sym in prev_holdings.index:
                val_loss = prev_holdings.loc[sym]['Market_Value'] - stock['Market_Value']
                if val_loss > max_val_loss:
                    max_val_loss = val_loss
                    culprit = sym
        
        if culprit:
            insights.append({
                "title": "Single Worst Day Driver",
                "text": f"On **{w_date.strftime('%d-%b-%Y')}**, drawdown deepened by **{abs(w_dd_change):.2f}%**. **{culprit}** was the primary drag.",
                "reasoning": "Understanding if one stock caused your worst day helps in diversification."
            })

    # --- 8. Recent Trend ---
    # Check last 30 days trend
    if len(daily_df) > 30:
        dd_30_ago = daily_df.iloc[-30]['Drawdown_Pct']
        curr = daily_df.iloc[-1]['Drawdown_Pct']
        diff = curr - dd_30_ago
        trend = "Improving" if diff > 0 else "Worsening"
        
        insights.append({
            "title": "Recent 30-Day Trend",
            "text": f"Your drawdown status is **{trend}** (moved from {dd_30_ago:.2f}% to {curr:.2f}%).",
            "reasoning": "Short-term momentum check."
        })

    return insights
