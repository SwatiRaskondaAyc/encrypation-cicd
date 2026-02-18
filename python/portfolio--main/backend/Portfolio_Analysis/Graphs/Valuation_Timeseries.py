import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def create_valuation_timeseries(valuation_data: dict, mode: str = 'current') -> dict:
    """
    Create time series visualization for valuation metrics (P/E, P/B, Dividend Yield).
    
    Note: This is a simplified version showing current portfolio composition.
    For full historical replay, use mode='overall' (future implementation).
    
    Args:
        valuation_data: Dict containing timeseries_data from valuation metrics
        mode: 'current' or 'overall' (overall not yet implemented)
        
    Returns:
        Dict with Plotly figure and insights
    """
    try:
        timeseries = valuation_data.get('timeseries', [])
        
        if not timeseries:
            return {
                "error": "No time series data available", 
                "graph": None,
                "type": "valuation_timeseries"
            }
        
        # Convert to DataFrame for easier manipulation
        df = pd.DataFrame(timeseries)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Create subplot figure
        fig = make_subplots(
            rows=3, cols=1,
            subplot_titles=('Portfolio P/E Over Time', 
                          'Portfolio P/B Over Time',
                          'Dividend Yield Over Time'),
            vertical_spacing=0.1,
            specs=[[{"secondary_y": False}],
                   [{"secondary_y": False}],
                   [{"secondary_y": False}]]
        )
        
        # P/E Ratio
        fig.add_trace(
            go.Scatter(
                x=df['date'],
                y=df['pe'],
                name='P/E Ratio',
                line=dict(color='rgb(55, 126, 184)', width=2),
                mode='lines+markers'
            ),
            row=1, col=1
        )
        
        # P/B Ratio
        fig.add_trace(
            go.Scatter(
                x=df['date'],
                y=df['pb'],
                name='P/B Ratio',
                line=dict(color='rgb(77, 175, 74)', width=2),
                mode='lines+markers'
            ),
            row=2, col=1
        )
        
        # Dividend Yield
        fig.add_trace(
            go.Scatter(
                x=df['date'],
                y=df['dividend_yield'],
                name='Dividend Yield (%)',
                line=dict(color='rgb(152, 78, 163)', width=2),
                mode='lines+markers',
                fill='tozeroy',
                fillcolor='rgba(152, 78, 163, 0.1)'
            ),
            row=3, col=1
        )
        
        # Update axes
        fig.update_xaxes(title_text="Date", row=3, col=1)
        fig.update_yaxes(title_text="P/E", row=1, col=1)
        fig.update_yaxes(title_text="P/B", row=2, col=1)
        fig.update_yaxes(title_text="Yield (%)", row=3, col=1)
        
        fig.update_layout(
            title=f'Portfolio Valuation Metrics Over Time ({mode.capitalize()} Mode)',
            showlegend=False,
            template='plotly_white',
            height=800
        )
        
        # Calculate insights
        latest_pe = df['pe'].iloc[-1] if not df['pe'].isna().all() else None
        avg_pe = df['pe'].mean() if not df['pe'].isna().all() else None
        
        insights = {
            "key_takeaways": [
                f"Current P/E: {latest_pe:.2f}" if latest_pe else "P/E data not available",
                f"Average P/E (1Y): {avg_pe:.2f}" if avg_pe else "Average P/E not available",
                f"Mode: {mode.capitalize()} holdings composition"
            ]
        }
        
        return {
            "graph": fig.to_json(),
            "insights": insights,
            "type": "valuation_timeseries"
        }
        
    except Exception as e:
        logger.error(f"Error creating valuation timeseries: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return {"error": str(e), "graph": None}
