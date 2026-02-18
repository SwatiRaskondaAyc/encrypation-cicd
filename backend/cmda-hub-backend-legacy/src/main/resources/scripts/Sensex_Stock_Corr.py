import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import json
import datetime

def convert_serializable(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.Timestamp):
        return obj.strftime('%Y-%m-%d')  # Convert datetime to string
    elif isinstance(obj, pd.Period):
        return obj.strftime('%Y-%m')  # Convert Period to string
    elif isinstance(obj, datetime.datetime):  # Handle standard datetime objects
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(obj, list):
        return [convert_serializable(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_serializable(value) for key, value in obj.items()}
    else:
        return obj


def sensex_vs_stock_corr(json_path, stock_symbol="UNIVCABLES"):
    try:
        # Attempt to read as NDJSON
        stock_df = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        stock_df = pd.read_json(json_path, lines=False)
    
    #stock_df = pd.read_json(json_path, lines=True)
    nifty_df = pd.read_csv('src/main/resources/data/sensex_data/nifty_50.csv')

    # Convert 'Date' columns to datetime
    stock_df['Date'] = pd.to_datetime(stock_df['Date'])
    nifty_df['Date'] = pd.to_datetime(nifty_df['Date'])

    # Merge the two dataframes on 'Date'
    merged_df = pd.merge(
        stock_df[['Date', 'Close']], nifty_df[['Date', 'Close']],
        on='Date', suffixes=('_Stock', '_Sensex')
    )

    # Standardize prices for comparison
    merged_df['Close_Stock_Std'] = (merged_df['Close_Stock'] - merged_df['Close_Stock'].mean()) / merged_df['Close_Stock'].std()
    merged_df['Close_Sensex_Std'] = (merged_df['Close_Sensex'] - merged_df['Close_Sensex'].mean()) / merged_df['Close_Sensex'].std()

    # Calculate residuals for boxplot
    residuals = merged_df['Close_Stock_Std'] - merged_df['Close_Sensex_Std']

    # Create subplots
    fig = make_subplots(
        rows=1, cols=2, column_widths=[0.7, 0.3],
        subplot_titles=(
            f"{stock_symbol} vs Sensex (Nifty 50) Trends",
            "Dispersion Box Plot"
        )
    )

    # Add standardized trendline scatter plot
    fig.add_trace(go.Scatter(
        x=merged_df['Date'], y=merged_df['Close_Stock_Std'],
        mode='lines', name=stock_symbol, line=dict(color='green')
    ), row=1, col=1)
    fig.add_trace(go.Scatter(
        x=merged_df['Date'], y=merged_df['Close_Sensex_Std'],
        mode='lines', name="Sensex (Nifty 50)", line=dict(color='orange')
    ), row=1, col=1)

    # Add boxplot for residuals
    fig.add_trace(go.Box(
        y=residuals, name="Dispersion", boxmean=True,
        marker_color='#d52787'
    ), row=1, col=2)

    # Update layout
    fig.update_layout(
        title=f"{stock_symbol} vs Sensex Analysis",
        xaxis_title="Date",
        yaxis_title="Standardized Prices",
        template="plotly_white"
    )

    # Generate JSON-compatible response
    comment = (
        f"This graph displays the correlation trends between {stock_symbol} and Sensex (Nifty 50). "
        "The line plot illustrates trends, while the boxplot highlights residual dispersions."
    )
    fig_dict = fig.to_dict()
    fig_dict_serializable = convert_serializable(fig_dict)

    return {
        "scatter_data": fig_dict_serializable['data'],
        "layout": fig_dict_serializable['layout'],
        "comment": comment
    }

if __name__ == "__main__":
    json_path = "src/main/resources/json/data.json"
    stock_symbol = "UNIVCABLES"
    result = sensex_vs_stock_corr(json_path, stock_symbol)
    
    serializable_result = convert_serializable(result)
    print(json.dumps(serializable_result, indent=4))
