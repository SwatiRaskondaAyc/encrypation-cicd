import pandas as pd
import numpy as np
import plotly.graph_objects as go
import json
import sys
import datetime

# Move the convert_ndarray function outside the sensex_vs_stock_corr_bar function
def convert_ndarray(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.Timestamp):
        return obj.strftime('%Y-%m-%d')  # Convert datetime to string
    elif isinstance(obj, pd.Period):
        return obj.strftime('%Y-%m')  # Convert Period to string
    elif isinstance(obj, datetime.datetime):  # Handle standard datetime objects
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(obj, list):
        return [convert_ndarray(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_ndarray(value) for key, value in obj.items()}
    else:
        return obj

def sensex_vs_stock_corr_bar(json_path, stock_symbol="UNIVCABLES"):
    try:
        # Attempt to read as NDJSON
        df = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        df = pd.read_json(json_path, lines=False)
        
    df_copy = df.copy()
    df1 = pd.read_csv('src/main/resources/data/sensex_data/nifty_50.csv')

    df_copy['Date'] = pd.to_datetime(df_copy['Date'])
    df1['Date'] = pd.to_datetime(df1['Date'])

    fig = go.Figure()

    # Prepare monthly data for Sensex and stock
    monthly_sensex = df1.groupby(pd.Grouper(key='Date', freq='ME')).agg({'Close': 'mean'}).reset_index()
    monthly_sensex.columns = ['Month', 'AvgSensexClose']

    monthly_stock = df_copy.groupby(pd.Grouper(key='Date', freq='ME')).agg({'Close': 'mean'}).reset_index()
    monthly_stock.columns = ['Month', 'AvgStockClose']

    # Calculate month-over-month percent change for both Sensex and stock
    monthly_sensex['SensexPercentChange'] = monthly_sensex['AvgSensexClose'].pct_change() * 100
    monthly_stock['StockPercentChange'] = monthly_stock['AvgStockClose'].pct_change() * 100

    # Add Stock bars (blue bars inside Sensex bars)
    fig.add_trace(go.Bar(
        x=monthly_stock['Month'],
        y=monthly_stock['StockPercentChange'],
        name=f"{stock_symbol} <br> % Change",
        marker=dict(color='#4d95ec'),
        width=1296000000,
    ))

    # Add Sensex bars (green bars)
    fig.add_trace(go.Bar(
        x=monthly_sensex['Month'],
        y=monthly_sensex['SensexPercentChange'],
        name=f"Sensex % <br> Change Bar",
        marker=dict(color='#94ea26'),
        opacity=0.7,
        width=2092000000,
    ))
    
    # Line plot for Sensex percent change

    fig.add_trace(go.Scatter(
            x=monthly_sensex['Month'],
            y=monthly_sensex['SensexPercentChange'],
            mode='lines+markers',
            name='',
            line=dict(color='#e45f2b', width=2.5,shape='spline'),
            marker=dict(size=5),
            hovertemplate=(
            f"{stock_symbol}"+ "<br>"
            "Month: %{x}" + "<br>"
            'Percent Change: ' + monthly_sensex['SensexPercentChange'].round(2).astype(str) + "%"),
            showlegend=False  # Hide from legend


        ))


        # Line plot for stock percent change
    fig.add_trace(go.Scatter(
            x=monthly_stock['Month'],
            y=monthly_stock['StockPercentChange'],
            mode='lines+markers',
            name="",
            line=dict(color='#f2a51e', width=2.5,shape='spline'),
            marker=dict(size=5),
            hovertemplate=(
            f"{stock_symbol}"+ "<br>"
            "Month: %{x}" + "<br>"
            'Percent Change: ' + monthly_stock['StockPercentChange'].round(2).astype(str) + "%"),
            showlegend=False  # Hide from legend

            
        ))


    fig.update_layout(
        title=f'Monthly Percentage Change for Sensex (Nifty 50) and {stock_symbol} For TTM',
        xaxis_title='Month',
        yaxis_title='Percent Change (%)',
        barmode='overlay',
        template='plotly_white',
    )

    comment = f"This chart shows the monthly percent change in the Sensex and {stock_symbol} over the past year."

    fig_dict = fig.to_dict()
    fig_dict_serializable = convert_ndarray(fig_dict)

    return {
        "scatter_data": fig_dict_serializable['data'],
        "layout": fig_dict_serializable['layout'],
        "comment": comment
    }


if __name__ == "__main__":
    json_path = "src/main/resources/json/data.json"
    stock_symbol = "UNIVCABLES"
    result = sensex_vs_stock_corr_bar(json_path, stock_symbol)
    
    serializable_result = convert_ndarray(result)
    print(json.dumps(serializable_result, indent=4))
