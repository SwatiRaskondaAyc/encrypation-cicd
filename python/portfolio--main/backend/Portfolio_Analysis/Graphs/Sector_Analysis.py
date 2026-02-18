import pandas as pd
import logging
import plotly.express as px

# --- Local Imports ---
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.utils import normalise_portfolio_columns
from mtm.repo.accord_fundamentals import Accord 

logger = logging.getLogger(__name__)

def create_industry_sunburst(portfolio_df: pd.DataFrame) -> dict:
    """
    Generates a Sunburst Chart of Current Holdings by Sector and Industry.
    The size of each slice represents the current market value of the holding.
    """
    config = {
        "displayModeBar": False,
        "displaylogo": False,
        "modeBarButtons": [["toImage"]]
    }
    
    try:
        # 1. Normalise
        df = normalise_portfolio_columns(portfolio_df)

        if df.empty or 'Date' not in df.columns:
            return {"error": "Input DataFrame is empty or missing 'Date' column.", "config": config}
        
        # 2. Filter for latest holdings
        latest_date = df['Date'].max()
        current_holdings = df[(df['Date'] == latest_date) & (df.get('Remaining Qty', 0) > 0)].copy()
        
        if current_holdings.empty:
            return {"error": "No active holdings found for the latest date.", "config": config}

        # Prefer Symbol over Scrip
        symbol_col = 'Symbol' if 'Symbol' in current_holdings.columns else 'Scrip'
        symbols = current_holdings[symbol_col].unique().tolist()
        
        # 3. Fetch Fundamental Data
        industry_df = pd.DataFrame()
        try:
            with Accord(symbols=symbols) as accord:
                industry_data = accord.get_company_industry_sector(fmt="records")
            
            if industry_data:
                industry_df = pd.DataFrame(industry_data)
                # Normalize DB column SYMBOL -> Symbol to match our preference
                industry_df.rename(columns={'SYMBOL': 'Symbol'}, inplace=True)
            
        except Exception as db_err:
            logger.error(f"Database fetch for industry data failed: {db_err}")
            # Proceed with empty df, fallback logic handles it below

        # 4. Merge (Left Join to keep all holdings)
        # If industry_df is empty or missing Symbol, merge will fail if we don't check
        if not industry_df.empty and 'Symbol' in industry_df.columns:
             # If holdings use 'Scrip' but DB returned 'Symbol', we need to align
             right_on = 'Symbol'
             left_on = symbol_col
             merged_df = pd.merge(current_holdings, industry_df, left_on=left_on, right_on=right_on, how='left')
        else:
             merged_df = current_holdings.copy()
             merged_df['Sector'] = None
             merged_df['IndustryName'] = None

        # Fill missing values
        merged_df[['Sector', 'IndustryName']] = merged_df[['Sector', 'IndustryName']].fillna('Unknown')

        # 5. Prepare data
        merged_df['Market Value'] = pd.to_numeric(merged_df.get('Market Value'), errors='coerce').fillna(0)
        merged_df['Portfolio'] = 'My Portfolio'

        # 6. Create Sunburst
        # Path: Portfolio -> Sector -> Industry -> Symbol
        # Use symbol_col for the leaf node
        fig = px.sunburst(
            merged_df,
            path=['Portfolio', 'Sector', 'IndustryName', symbol_col],
            values='Market Value',
            title="<b>Portfolio Allocation by Sector</b>",
            color='Sector',
            hover_data={'Market Value': ':,.2f'}
        )
        
        fig.update_layout(
            height=700,
            template='plotly_white',
            margin=dict(t=100, l=10, r=10, b=10)
        )
        
        # Use helper
        fig_dict = convert_to_serializable(fig.to_dict())
        
        return {
            "figure": fig_dict,
            "config": config,
            "comment": "Successfully generated sector sunburst."
        }

    except Exception as e:
        logger.error(f"Error in create_industry_sunburst: {e}")
        return {"error": str(e), "config": config}
