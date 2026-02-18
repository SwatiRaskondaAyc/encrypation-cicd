import logging
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# --- Local Imports ---
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.utils import normalise_portfolio_columns
from mtm.repo.accord_fundamentals import Accord

logger = logging.getLogger(__name__)

def create_user_sunburst_with_dropdown(portfolio_df: pd.DataFrame) -> dict:
    """
    Generates a Sunburst chart with a dropdown to switch between metrics:
    - Realized PNL (Profits Only)
    - Brokerage Amount
    - Deployed Amount
    """
    config = {"displayModeBar": False, "displaylogo": False, "modeBarButtons": [["toImage"]]}
    
    try:
        # 1. Normalise
        df = normalise_portfolio_columns(portfolio_df)
        
        if df.empty or 'Date' not in df.columns:
            return {"error": "Invalid or empty portfolio data", "config": config}
        
        # Get latest snapshot
        latest_date = df['Date'].max()
        latest_data = df[df['Date'] == latest_date].copy()
        
        if latest_data.empty:
            return {"error": "No data available for the latest date", "config": config}

        # 2. Fetch Industry Tags
        symbol_col = 'Symbol' if 'Symbol' in latest_data.columns else 'Scrip'
        symbols = latest_data[symbol_col].unique().tolist()
        
        industry_df = pd.DataFrame()
        try:
            with Accord(symbols=symbols) as accord:
                industry_data = accord.get_company_industry_sector(fmt="records")
            if industry_data:
                industry_df = pd.DataFrame(industry_data)
                industry_df.rename(columns={'SYMBOL': 'Symbol'}, inplace=True)
        except Exception as db_err:
            logger.error(f"Complex Sunburst DB fetch failed: {db_err}")

        # 3. Merge (Left Join)
        if not industry_df.empty:
            merged = latest_data.merge(industry_df, left_on=symbol_col, right_on='Symbol', how='left')
        else:
            merged = latest_data
        
        merged['IndustryName'] = merged.get('IndustryName', 'Unknown').fillna('Unknown')
        merged['Sector'] = merged.get('Sector', 'Unknown').fillna('Unknown')

        # 4. Generate Sub-Figures
        figures = {}
        metrics = {
            'Realized PNL (Profits)': 'Realized PNL',
            'Brokerage Amount': 'Brokerage Amount',
            'Deployed Amount': 'Deployed Amount'
        }
        
        for label, col in metrics.items():
            if col not in merged.columns: continue

            subset = merged.copy()
            subset[col] = pd.to_numeric(subset[col], errors='coerce').fillna(0)
            
            # Special logic for Realized PNL: only show positive contributions
            if label == 'Realized PNL (Profits)':
                subset = subset[subset[col] > 0]
            
            if subset[col].sum() <= 0: continue # Skip empty/negative total metrics
            
            fig = px.sunburst(
                subset,
                path=['Sector', 'IndustryName', symbol_col],
                values=col,
                title=f"{label} Distribution" # This title is temporary
            )
            # Store the data part of the figure
            figures[label] = fig.data[0]

        # 5. Combine into One Figure with Dropdown
        if not figures:
            return {"error": "No data available to create sunbursts", "config": config}
            
        data_traces = list(figures.values())
        
        # Set initial visibility
        for i, trace in enumerate(data_traces):
            trace.visible = (i == 0)
            
        buttons = []
        for i, label in enumerate(figures.keys()):
            # Create a visibility mask for each button
            visibility = [False] * len(figures)
            visibility[i] = True
            buttons.append(dict(
                label=label,
                method='update',
                args=[{'visible': visibility}, {'title': f"{label} Distribution"}]
            ))

        layout = go.Layout(
            title_text=f"<b>Portfolio Sunburst Analysis: {list(figures.keys())[0]}</b>",
            updatemenus=[{
                'buttons': buttons,
                'direction': 'down',
                'showactive': True,
                'x': 1.0, 'xanchor': 'right', 'y': 1.15, 'yanchor': 'top',
            }],
            height=700,
            template='plotly_white'
        )
        
        fig = go.Figure(data=data_traces, layout=layout)
        fig_dict = convert_to_serializable(fig.to_dict())
        
        return {"figure": fig_dict, "config": config}

    except Exception as e:
        logger.error(f"Complex Sunburst Error: {e}")
        return {"error": str(e), "config": config}
