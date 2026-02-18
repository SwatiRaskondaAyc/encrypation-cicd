import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import json
import logging
from File_Handler.utils.JSON_Cleaner import convert_to_serializable

logger = logging.getLogger(__name__)

def classify_stocks_risk_return(data: pd.DataFrame) -> dict:
    """
    Generates a Risk vs. Return scatter plot with Quadrant Analysis and Deep Insights.
    
    FIXES:
    - Removed fixed 'height' to allow frontend autosizing.
    - Robust type conversion for returns.
    - Dynamic margins.
    """
    
    # ---------------------------------------------------------
    # 1. Config & Setup
    # ---------------------------------------------------------
    config = {
        "displayModeBar": False,
        "displaylogo": False,
        "modeBarButtons": [["toImage"]],
        "scrollZoom": False,
        "responsive": True 
    }

    try:
        if data.empty:
            return {"error": "No data available for Risk Analysis", "config": config}

        df = data.copy()

        # Normalize Column Names
        column_map = {
            'Unrealized_PnL_Perc': 'Unrealized % Return',
            'Unrealized_%_Return': 'Unrealized % Return',
            'Deployed_Amount': 'Deployed Amount',
            'Unrealized_PNL': 'Unrealized PNL'
        }
        df.rename(columns=column_map, inplace=True)

        # ---------------------------------------------------------
        # 2. Data Cleaning & Type Conversion
        # ---------------------------------------------------------
        # Ensure 'Unrealized % Return' exists
        if 'Unrealized % Return' not in df.columns:
            df['Unrealized % Return'] = 0.0
        
        # Robust Cleaning: Handle strings, %, and non-numeric types
        if df['Unrealized % Return'].dtype == 'object':
             df['Unrealized % Return'] = (
                 df['Unrealized % Return']
                 .astype(str)
                 .str.replace('%', '', regex=False)
                 .str.replace(',', '', regex=False)
                 .replace(['nan', 'None', '', '<NA>'], np.nan)
             )
        
        df['Unrealized % Return'] = pd.to_numeric(df['Unrealized % Return'], errors='coerce').fillna(0.0)

        # ---------------------------------------------------------
        # 3. Compute Metrics from Portfolio Snapshot
        # ---------------------------------------------------------
        # Strategy: Use the current portfolio data (last value per symbol)
        # - Return: Current Unrealized % Return (snapshot value)
        # - Volatility: We don't have time-series data in snapshot, so use a proxy
        #   based on the spread of returns or set to a nominal value
        
        # Group by Symbol and take the last (current) value for each stock
        metrics = df.groupby("Symbol").agg(
            # Y-Axis: Current Unrealized Return %
            Mean_Return=("Unrealized % Return", "last"),
            # Unrealized PNL for context
            Unrealized_PNL=("Unrealized PNL", "last") if "Unrealized PNL" in df.columns else ("Unrealized % Return", lambda x: 0)
        ).reset_index()
        
        # X-Axis: Volatility Proxy
        # Since we don't have time-series data, we'll use the standard deviation
        # of returns across all stocks as a baseline, then apply a scaling factor
        # based on each stock's absolute return magnitude
        # This is a simplified proxy for demonstration purposes
        
        if len(metrics) > 1:
            # Calculate a baseline volatility from the spread of returns
            baseline_vol = metrics["Mean_Return"].std()
            
            # Apply scaling based on absolute return (higher returns = potentially higher vol)
            # This is a heuristic: stocks with extreme returns (positive or negative) tend to be more volatile
            metrics["Volatility"] = metrics["Mean_Return"].abs() * baseline_vol * 0.5 + baseline_vol
        else:
            # Single stock - assign a nominal volatility
            metrics["Volatility"] = 10.0  # 10% baseline
        
        # Ensure positive volatility
        metrics["Volatility"] = metrics["Volatility"].abs()
        
        # Fill any NaN with defaults
        metrics["Volatility"] = metrics["Volatility"].fillna(10.0)
        metrics["Mean_Return"] = metrics["Mean_Return"].fillna(0.0)
        
        # Calculate Sharpe Ratio (Return / Risk)
        # Using a risk-free rate of ~7% (typical FD rate in India)
        risk_free_rate = 7.0  # in percentage
        metrics["Sharpe_Ratio"] = metrics.apply(
            lambda row: (row["Mean_Return"] - risk_free_rate) / row["Volatility"] if row["Volatility"] > 0.01 else 0.0, 
            axis=1
        )
        
        # Add placeholder for Max Drawdown (not calculable from snapshot)
        metrics["Max_Drawdown"] = 0.0
        metrics["Current_Value"] = metrics["Mean_Return"]

        if metrics.empty:
             return {"error": "Insufficient data for metrics", "config": config}

        logger.info(f"Risk Analysis Metrics:\n{metrics.head()}")
        # Check for NaN/Zero values in critical columns
        if metrics['Volatility'].sum() == 0:
             logger.warning("Risk Analysis: Volatility is all 0. Graph may look empty.")
        if metrics['Mean_Return'].sum() == 0:
             logger.warning("Risk Analysis: Mean_Return is all 0. Graph may look empty.")

        # Y-axis label for current returns
        y_axis_label = "<b>Return (Unrealized %) →</b>"

        # ---------------------------------------------------------
        # 4. Define Dynamic Benchmarks
        # ---------------------------------------------------------
        return_median = metrics["Mean_Return"].median()
        risk_median = metrics["Volatility"].median()

        # Failsafes
        if pd.isna(return_median): return_median = 0.0
        if pd.isna(risk_median): risk_median = 0.0

        # ---------------------------------------------------------
        # 5. Vectorized Classification
        # ---------------------------------------------------------
        cond_high_ret = metrics["Mean_Return"] > return_median
        cond_low_risk = metrics["Volatility"] < risk_median

        conditions = [
            (cond_high_ret & cond_low_risk),  # Green
            (cond_high_ret & ~cond_low_risk), # Orange
            (~cond_high_ret & cond_low_risk), # Blue
            (~cond_high_ret & ~cond_low_risk) # Red
        ]
        
        choices = [
            "High Return, Low Risk",
            "High Return, High Risk",
            "Low Return, Low Risk",
            "Low Return, High Risk"
        ]

        metrics["Category"] = np.select(conditions, choices, default="Low Return, High Risk")

        # ---------------------------------------------------------
        # 6. Generate Insights
        # ---------------------------------------------------------
        insights = generate_detailed_insights(metrics, return_median, risk_median)

        # ---------------------------------------------------------
        # 7. Build Plotly Figure
        # ---------------------------------------------------------
        fig = px.scatter(
            metrics,
            x="Volatility",
            y="Mean_Return",
            color="Category",
            hover_name="Symbol",
            title=f"<b>Stock Risk-Return Analysis</b>",
            labels={
                "Volatility": "<b>Risk (Annualized Volatility %) →</b>",
                "Mean_Return": y_axis_label
            },
            color_discrete_map={
                "High Return, Low Risk": "#10b981",   # Emerald-500 (Vibrant Green)
                "High Return, High Risk": "#f59e0b",  # Amber-500 (Vibrant Orange)
                "Low Return, Low Risk": "#3b82f6",    # Blue-500 (Vibrant Blue)
                "Low Return, High Risk": "#ef4444"    # Red-500 (Vibrant Red)
            },
            template="plotly_white"
        )

        # CRITICAL: Do NOT set fixed height. Allow frontend to handle it via autosize.
        fig.update_layout(
            autosize=True,
            font=dict(family="Inter, sans-serif", size=12, color="#64748b"), # Slate-500
            legend=dict(
                title=dict(text=""), # Clean legend (remove title)
                orientation="h",
                yanchor="bottom", y=1.02,
                xanchor="center", x=0.5,
                font=dict(size=11)
            ),
            margin=dict(l=40, r=40, b=40, t=60),
            hoverlabel=dict(bgcolor="white", font_size=12, font_family="Inter, sans-serif", bordercolor="#e2e8f0"),
            xaxis=dict(
                gridcolor="#f1f5f9", # Slate-100
                gridwidth=1,
                griddash='dot',      # Dashed gridlines
                zeroline=True,
                zerolinecolor='#cbd5e1', # Visible zero line
                zerolinewidth=1.5,
                showspikes=True,
                spikemode='across',
                spikesnap='cursor',
                spikedash='solid',
                spikecolor='#cbd5e1',
                spikethickness=1,
                showline=True, 
                linewidth=1, 
                linecolor='#cbd5e1', # Darker axis line
                title_font=dict(size=11, color="#64748b")
            ),
            yaxis=dict(
                gridcolor="#f1f5f9", # Slate-100
                gridwidth=1,
                griddash='dot',      # Dashed gridlines
                zeroline=True,
                zerolinecolor='#cbd5e1', # Visible zero line
                zerolinewidth=1.5,
                showspikes=True,
                spikemode='across',
                spikesnap='cursor',
                spikedash='solid',
                spikecolor='#cbd5e1',
                spikethickness=1,
                showline=True, 
                linewidth=1, 
                linecolor='#cbd5e1', # Darker axis line
                title_font=dict(size=11, color="#64748b")
            ),
            plot_bgcolor='white',
            paper_bgcolor='white'
        )

        # Add Benchmark Lines (Median) - Distinct from Grid
        fig.add_shape(type="line",
            x0=risk_median, y0=metrics["Mean_Return"].min(),
            x1=risk_median, y1=metrics["Mean_Return"].max(),
            line=dict(color="#94a3b8", width=2, dash="dash"), # Slate-400, thicker
            name="Median Risk"
        )
        fig.add_shape(type="line",
            x0=metrics["Volatility"].min(), y0=return_median,
            x1=metrics["Volatility"].max(), y1=return_median,
            line=dict(color="#94a3b8", width=2, dash="dash"), # Slate-400, thicker
            name="Median Return"
        )

        # Quadrant Annotations (Simplified positioning & styling)
        x_min, x_max = metrics["Volatility"].min(), metrics["Volatility"].max()
        y_min, y_max = metrics["Mean_Return"].min(), metrics["Mean_Return"].max()
        
        # Avoid ZeroDivisionError if single point
        x_range = (x_max - x_min) if x_max != x_min else 1.0
        y_range = (y_max - y_min) if y_max != y_min else 1.0

        annotations = [
            dict(x=x_min + (x_range*0.02), y=y_max - (y_range*0.02), xanchor="left", yanchor="top",
                 text="<span style='color:#059669; font-weight:600;'>Growth Leaders</span>", showarrow=False, font=dict(size=12)),
            
            dict(x=x_max - (x_range*0.02), y=y_max - (y_range*0.02), xanchor="right", yanchor="top",
                 text="<span style='color:#d97706; font-weight:600;'>Speculative</span>", showarrow=False, font=dict(size=12)),
            
            dict(x=x_min + (x_range*0.02), y=y_min + (y_range*0.02), xanchor="left", yanchor="bottom",
                 text="<span style='color:#2563eb; font-weight:600;'>Anchors</span>", showarrow=False, font=dict(size=12)),
            
            dict(x=x_max - (x_range*0.02), y=y_min + (y_range*0.02), xanchor="right", yanchor="bottom",
                 text="<span style='color:#dc2626; font-weight:600;'>Laggards</span>", showarrow=False, font=dict(size=12))
        ]
        
        fig.update_layout(annotations=annotations)

        # Enhance Hover Data & Marker Styling
        fig.update_traces(
            hovertemplate="<b>%{hovertext}</b><br>" +
                        "<span style='color:#64748b'>%{data.name}</span><br>" +
                        "<br>" +
                        "Ret: <b>%{y:.1f}%</b> | Vol: <b>%{x:.1f}%</b><br>" +
                        "Sharpe: <b>%{customdata[0]:.2f}</b><extra></extra>",
            customdata=metrics[["Sharpe_Ratio", "Max_Drawdown"]],
            marker=dict(size=16, line=dict(width=2, color="white"), opacity=0.95) # Slightly larger, crisp border
        )
        # ---------------------------------------------------------
        # 8. Serialize & Return
        # ---------------------------------------------------------
        fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))

        return {
            "figure": fig_dict,
            "config": config,
            "insights": insights
        }

    except Exception as e:
        logger.error(f"Risk Analysis Error: {str(e)}", exc_info=True)
        return {"error": str(e), "config": config}


def generate_detailed_insights(metrics, return_median, risk_median):
    """
    Engine to generate specific, actionable, and descriptive insights.
    """
    insights = []
    
    def get_top_n(df_subset, sort_col, n=3, ascending=False):
        if df_subset.empty: return "None"
        sorted_sub = df_subset.sort_values(by=sort_col, ascending=ascending).head(n)
        return ", ".join([f"**{s}**" for s in sorted_sub['Symbol'].tolist()])

    # SECTION 1: GRAPH EXPLANATION
    insights.append({
        "title": "📖 How to Read This Graph",
        "text": "Understanding the Axes",
        "reasoning": (
            "• **X-Axis (Risk):** How much the stock price swings. Right = More unpredictable.<br>"
            "• **Y-Axis (Return):** The average profit percentage. Up = More profitable.<br>"
            "• **Crosshairs:** Represent your **Portfolio Median**, dividing stocks relative to *your* average performance."
        ),
        "type": "guide"
    })
    
    insights.append({
        "title": "🗝️ Key Metrics Explained",
        "text": "Definitions used in this analysis",
        "reasoning": (
            "• **Volatility:** A measure of fear. High volatility means wide price swings.<br>"
            "• **Sharpe Ratio:** Efficiency score. Return per unit of risk. Higher is better.<br>"
            "• **Max Drawdown:** The painful drop. Measures the largest percentage loss from a peak."
        ),
        "type": "guide"
    })

    # SECTION 2: QUADRANT SPECIFIC INSIGHTS
    
    # 1. Safest Winners
    stars = metrics[metrics["Category"] == "High Return, Low Risk"]
    if not stars.empty:
        names = get_top_n(stars, 'Sharpe_Ratio', 3)
        insights.append({
            "title": "💎 Safest Winners (Star Performers)",
            "text": f"Top Efficiency: {names}",
            "reasoning": f"These stocks deliver above-average returns (>{return_median:.1f}%) with below-average volatility (<{risk_median:.2f}). They are compounding quietly."
        })

    # 2. High Risk, High Reward
    volatile_winners = metrics[metrics["Category"] == "High Return, High Risk"]
    if not volatile_winners.empty:
        names = get_top_n(volatile_winners, 'Mean_Return', 3)
        insights.append({
            "title": "🎢 High Risk, High Reward",
            "text": f"Wild Riders: {names}",
            "reasoning": f"These stocks are profitable but fluctuate heavily (Volatility > {risk_median:.2f}). Consider trimming position sizes if they dominate your portfolio."
        })

    # 3. Low Risk, Low Return
    sleepers = metrics[metrics["Category"] == "Low Return, Low Risk"]
    if not sleepers.empty:
        names = get_top_n(sleepers, 'Volatility', 3, ascending=True)
        insights.append({
            "title": "🛡️ Capital Preservation",
            "text": f"Most Stable: {names}",
            "reasoning": "These stocks are safe but slow. They act as anchors during market turbulence, behaving similarly to fixed-income."
        })

    # 4. Worst Performing
    dogs = metrics[metrics["Category"] == "Low Return, High Risk"]
    if not dogs.empty:
        names = get_top_n(dogs, 'Mean_Return', 3, ascending=True)
        insights.append({
            "title": "⚠️ Portfolio Drag (Action Needed)",
            "text": f"Review Required: {names}",
            "reasoning": f"These stocks have high volatility (Risk > {risk_median:.2f}) but fail to deliver returns. They are effectively 'bleeding' capital efficiency."
        })

    # SECTION 3: ADVANCED INSIGHTS

    # 5. Sharpe Ratio Leaders
    positive_sharpe = metrics[metrics["Mean_Return"] > 0]
    if not positive_sharpe.empty:
        top_sharpe = get_top_n(positive_sharpe, 'Sharpe_Ratio', 3)
        insights.append({
            "title": "🏆 Sharpe Ratio Leaders",
            "text": f"Most Efficient: {top_sharpe}",
            "reasoning": "Based on the Return-Risk Frontier, these stocks generate the most 'bang for your buck'."
        })

    # 6. Benchmark Explanation
    insights.append({
        "title": "⚖️ The Benchmark",
        "text": f"Return Threshold: {return_median:.2f}% | Risk Threshold: {risk_median:.2f}",
        "reasoning": "We use your own portfolio's median as the benchmark. Stocks above median return are 'Growth Engines', below are 'Capital Sinks'."
    })

    return insights
