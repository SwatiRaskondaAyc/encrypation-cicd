import plotly.graph_objects as go
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def create_valuation_summary(valuation_data: dict) -> dict:
    """
    Create a simple valuation summary visualization showing P/E, P/B, P/S metrics.
    
    Args:
        valuation_data: Dict from valuation_metrics in API response
        
    Returns:
        Dict with Plotly figure and insights
    """
    try:
        portfolio_metrics = valuation_data.get('portfolio_metrics', {})
        individual_metrics = valuation_data.get('individual_metrics', {})
        
        if not portfolio_metrics:
            return {"error": "No valuation data available", "graph": None}
        
        # Create bar chart comparing portfolio vs average individual metrics
        metrics = ['P/E', 'P/B']  # Removed P/S due to scale issues
        portfolio_values = [
            portfolio_metrics.get('pe'),
            portfolio_metrics.get('pb')
        ]
        
        # Calculate average for individual stocks
        individual_pe_vals = [m.get('pe') for m in individual_metrics.values() if m.get('pe')]
        individual_pb_vals = [m.get('pb') for m in individual_metrics.values() if m.get('pb')]
        
        avg_pe = sum(individual_pe_vals) / len(individual_pe_vals) if individual_pe_vals else None
        avg_pb = sum(individual_pb_vals) / len(individual_pb_vals) if individual_pb_vals else None
        
        individual_averages = [avg_pe, avg_pb]
        
        fig = go.Figure()
        
        fig.add_trace(go.Bar(
            name='Portfolio (Weighted)',
            x=metrics,
            y=portfolio_values,
            marker_color='rgb(55, 126, 184)',
            text=[f'{v:.2f}' if v else 'N/A' for v in portfolio_values],
            textposition='auto',
        ))
        
        fig.add_trace(go.Bar(
            name='Individual Stocks (Average)',
            x=metrics,
            y=individual_averages,
            marker_color='rgb(255, 127, 0)',
            text=[f'{v:.2f}' if v else 'N/A' for v in individual_averages],
            textposition='auto',
        ))
        
        fig.update_layout(
            title='Portfolio Valuation Metrics',
            xaxis_title='Metric',
            yaxis_title='Value',
            barmode='group',
            template='plotly_white',
            height=400
        )
        
        insights = {
            "key_takeaways": [
                f"Portfolio P/E: {portfolio_values[0]:.2f}" if portfolio_values[0] else "Portfolio P/E: Not Available",
                f"Portfolio P/B: {portfolio_values[1]:.2f}" if portfolio_values[1] else "Portfolio P/B: Not Available",
                f"Dividend Yield: {portfolio_metrics.get('dividend_yield', 0):.2f}%"
            ]
        }
        
        return {
            "graph": fig.to_json(),
            "insights": insights,
            "type": "valuation_summary"
        }
        
    except Exception as e:
        logger.error(f"Error creating valuation summary: {e}")
        return {"error": str(e), "graph": None}


def create_dividend_breakdown(dividend_data: dict) -> dict:
    """
    Create dividend income breakdown showing by stock and by quarter.
    
    Args:
        dividend_data: Dict from dividend_income in valuation_metrics
        
    Returns:
        Dict with Plotly figure and insights
    """
    try:
        total_earned = dividend_data.get('total_dividend_earned', 0)
        by_stock = dividend_data.get('by_stock', {})
        by_quarter = dividend_data.get('by_quarter', {})
        
        if total_earned == 0:
            # Get date range from transaction data if available
            date_msg = "No dividends earned in portfolio history"
            if 'earliest_transaction' in dividend_data:
                start = dividend_data.get('earliest_transaction', '')
                end = dividend_data.get('latest_transaction', '') 
                if start and end:
                    date_msg = f"No dividends earned from {start} to {end}"
            
            return {
                "graph": None,
                "insights": {"key_takeaways": [date_msg]},
                "type": "dividend_breakdown"
            }
        
        # Create figure with subplots
        from plotly.subplots import make_subplots
        
        fig = make_subplots(
            rows=1, cols=2,
            subplot_titles=('Dividends by Stock', 'Dividends by Quarter'),
            specs=[[{"type": "bar"}, {"type": "bar"}]]
        )
        
        # By Stock
        if by_stock:
            stocks = list(by_stock.keys())
            amounts = [by_stock[s]['total'] for s in stocks]
            
            fig.add_trace(
                go.Bar(
                    x=stocks,
                    y=amounts,
                    name='By Stock',
                    marker_color='rgb(77, 175, 74)',
                    text=[f'₹{a:,.0f}' for a in amounts],
                    textposition='auto'
                ),
                row=1, col=1
            )
        
        # By Quarter
        if by_quarter:
            quarters = sorted(by_quarter.keys())
            quarter_amounts = [by_quarter[q] for q in quarters]
            
            # Format quarter labels (YYYYMM -> YYYY-MM)
            quarter_labels = [f"{q[:4]}-{q[4:]}" for q in quarters]
            
            fig.add_trace(
                go.Bar(
                    x=quarter_labels,
                    y=quarter_amounts,
                    name='By Quarter',
                    marker_color='rgb(51, 160, 44)',
                    text=[f'₹{a:,.0f}' for a in quarter_amounts],
                    textposition='auto'
                ),
                row=1, col=2
            )
        
        fig.update_xaxes(title_text="Stock", row=1, col=1)
        fig.update_xaxes(title_text="Quarter", row=1, col=2)
        fig.update_yaxes(title_text="Dividend Amount (₹)", row=1, col=1)
        fig.update_yaxes(title_text="Dividend Amount (₹)", row=1, col=2)
        
        fig.update_layout(
            title=f'Dividend Income Breakdown (Total: ₹{total_earned:,.2f})',
            showlegend=False,
            template='plotly_white',
            height=400
        )
        
        # Generate insights
        top_dividend_stock = max(by_stock.items(), key=lambda x: x[1]['total'])[0] if by_stock else None
        
        insights = {
            "key_takeaways": [
                f"Total Dividends Earned: ₹{total_earned:,.2f}",
                f"Top Dividend Stock: {top_dividend_stock} (₹{by_stock[top_dividend_stock]['total']:,.2f})" if top_dividend_stock else "No dividend data",
                f"Number of Stocks with Dividends: {len(by_stock)}"
            ]
        }
        
        return {
            "graph": fig.to_json(),
            "insights": insights,
            "type": "dividend_breakdown"
        }
        
    except Exception as e:
        logger.error(f"Error creating dividend breakdown: {e}")
        return {"error": str(e), "graph": None}
