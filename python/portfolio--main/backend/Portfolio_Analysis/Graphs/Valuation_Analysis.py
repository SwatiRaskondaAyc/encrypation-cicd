import logging
import pandas as pd
import plotly.express as px

# Use your centralized cleaner
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.utils import normalise_portfolio_columns

from mtm.repo.accord_fundamentals import Accord

logger = logging.getLogger(__name__)

def generate_combined_bubble_chart(portfolio_df):
    """
    Generates Bubble Chart: PE Ratio vs Book Value.
    Size of bubble = Market Value (better proxy than Qty) or Deployed Amount.
    """
    config = {"displayModeBar": False, "displaylogo": False, "modeBarButtons": [["toImage"]]}
    
    try:
        if portfolio_df.empty:
             return {"error": "Empty portfolio data", "config": config}

        # 1. Normalise & Identify Active Symbols
        df = normalise_portfolio_columns(portfolio_df)
        
        if 'Date' not in df.columns:
             return {"error": "Date column missing in portfolio data", "config": config}

        latest_date = df['Date'].max()
        holdings = df[(df['Date'] == latest_date) & (df.get('Remaining Qty', 0) > 0)].copy()
        
        # Use mapped 'Symbol' preferentially, fallback to 'Scrip' if needed
        symbol_col = 'Symbol' if 'Symbol' in holdings.columns else 'Scrip'
        symbols = holdings[symbol_col].unique().tolist()
        
        if not symbols:
             return {"error": "No active holdings found", "config": config}

        # 2. Fetch Fundamentals (Accord)
        # We catch errors so graph generation doesn't crash entire pipeline
        fund_df = pd.DataFrame()
        ind_df = pd.DataFrame()
        
        try:
            with Accord(symbols=symbols) as accord:
                fund_data = accord.get_company_financial_ratios(fmt="records")
                ind_data = accord.get_company_industry_sector(fmt="records")
            
            if fund_data: fund_df = pd.DataFrame(fund_data)
            if ind_data: ind_df = pd.DataFrame(ind_data)
            
        except Exception as e:
            logger.warning(f"Accord fetch failed in Valuation Analysis: {e}")
            # Proceed with empty fundamentals to show at least the available points (if any logic allowed)
            # But since X/Y axes depend on fundamentals, we might just have to return an error or empty plot.
            pass

        # 3. Merge (LEFT JOIN to keep all holdings)
        # holdings[symbol_col] <-> fund_df['SYMBOL']
        merged = holdings.merge(fund_df, left_on=symbol_col, right_on='SYMBOL', how='left')
        
        if not ind_df.empty:
            merged = merged.merge(ind_df[['SYMBOL', 'IndustryName']], on='SYMBOL', how='left')
        
        # Fill missing Industry
        if 'IndustryName' in merged.columns:
            merged['IndustryName'] = merged['IndustryName'].fillna('Unknown')
        else:
            merged['IndustryName'] = 'Unknown'

        # 4. Handle Missing X/Y Data for Plotting
        # We can't plot bubbles if PE or BV is missing. 
        # Option A: Drop them silently
        # Option B: Fill with 0 (might distort graph)
        # We'll drop rows where BOTH X and Y are NaN, or fill with 0 for visualization?
        # Let's drop NaN only for the plotting columns to avoid plotly errors
        plot_data = merged.dropna(subset=['TTM_PE', 'bookValue']).copy()
        
        if plot_data.empty:
             return {"error": "No fundamental data available for active holdings", "config": config}

        # 5. Create Plot
        # Using Market Value for size is usually more meaningful than Qty across different stock prices
        size_col = 'Market Value' if 'Market Value' in plot_data.columns else 'Remaining Qty'
        
        # Ensure size is positive
        plot_data[size_col] = plot_data[size_col].clip(lower=0)

        fig = px.scatter(
            plot_data,
            x='TTM_PE',
            y='bookValue',
            size=size_col,
            color='IndustryName',
            hover_name=symbol_col,
            hover_data={
                symbol_col: True, 
                'TTM_PE': ':.2f', 
                'bookValue': ':.2f', 
                size_col: ':.0f',
                'IndustryName': True
            },
            title='Portfolio Valuation: PE vs Book Value',
            labels={'TTM_PE': 'PE Ratio', 'bookValue': 'Book Value per Share'},
            template='plotly_white'
        )
        
        fig.update_layout(height=600)
        
        # Use the clean serialization helper
        # Note: We return the dict directly, NOT a JSON string.
        fig_dict = convert_to_serializable(fig.to_dict())
        return {"figure": fig_dict, "config": config}

    except Exception as e:
        logger.error(f"Valuation Bubble Chart Error: {e}")
        return {"error": str(e), "config": config}
