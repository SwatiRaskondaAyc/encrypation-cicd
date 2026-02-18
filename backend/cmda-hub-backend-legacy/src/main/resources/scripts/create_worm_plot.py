import sys
import pandas as pd
import json
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots
from scipy.ndimage import gaussian_filter1d
import datetime

def create_worm_plot(json_path):
    try:
        # Attempt to read as NDJSON
        df = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        df = pd.read_json(json_path, lines=False)

    df_copy = df.copy()
    df_copy['Date'] = pd.to_datetime(df_copy['Date'])

    # Initialize the figure
    fig = make_subplots(
        rows=2,
        cols=1,
        shared_xaxes=True,
        row_heights=[0.7, 0.3],
        vertical_spacing=0
    )

    # Resample data for weekly candlesticks
    df_copy.set_index('Date', inplace=True)
    df_weekly = df_copy.resample('W').agg({
        'Open': 'first',
        'High': 'max',
        'Low': 'min',
        'Close': 'last',
        'TotalTradedQty': 'sum',
        'DeliverableQty': 'sum'
    }).reset_index()

    # Smooth high and low prices
    df_copy['Smoothed_High'] = gaussian_filter1d(df_copy['High'], sigma=2)
    df_copy['Smoothed_Low'] = gaussian_filter1d(df_copy['Low'], sigma=2)
    df_copy['Trend'] = np.where(df_copy['Smoothed_High'].diff() > 0, 'Uptrend', 'Downtrend')

    # Add candlestick chart
    fig.add_trace(go.Candlestick(
        x=df_weekly['Date'],
        open=df_weekly['Open'],
        high=df_weekly['High'],
        low=df_weekly['Low'],
        close=df_weekly['Close'],
        increasing_line_color='green',
        decreasing_line_color='red',
        name="",
        showlegend=False
    ), row=1, col=1)

    df_copy.reset_index(inplace=True)

    # Add ribbon lines
    for i in range(1, len(df)):
        color = 'rgba(158, 240, 158, 0.8)' if df_copy['Trend'].iloc[i] == 'Uptrend' else 'rgba(240, 124, 120, 0.8)'
        fill_color = 'rgba(158, 240, 158, 0.5)' if df_copy['Trend'].iloc[i] == 'Uptrend' else 'rgba(240, 124, 120, 0.5)'
        fig.add_trace(go.Scatter(
            x=df_copy['Date'].iloc[i-1:i+1],
            y=df_copy['Smoothed_High'].iloc[i-1:i+1],
            mode='lines',
            line=dict(color=color, width=2),
            showlegend=False
        ), row=1, col=1)
        fig.add_trace(go.Scatter(
            x=df_copy['Date'].iloc[i-1:i+1],
            y=df_copy['Smoothed_Low'].iloc[i-1:i+1],
            mode='lines',
            fill='tonexty',
            fillcolor=fill_color,
            line=dict(color=color, width=2),
            showlegend=False
        ), row=1, col=1)

    # Add delivery percentage bar plot
    df_copy['Week'] = df_copy['Date'].dt.to_period('W')
    weekly_data = df_copy.groupby('Week').agg(
        Total_Traded_Qty=('TotalTradedQty', 'sum'),
        Deliverable_Qty=('DeliverableQty', 'sum')
    ).reset_index()
    weekly_data['Delivery_Percentage'] = (weekly_data['Deliverable_Qty'] / weekly_data['Total_Traded_Qty']) * 100
    weekly_data['Week'] = weekly_data['Week'].dt.to_timestamp()
    fig.add_trace(go.Bar(
        x=weekly_data['Week'],
        y=weekly_data['Delivery_Percentage'],
        marker_color='green',
        showlegend=False
    ), row=2, col=1)

    # Configure layout
    fig.update_layout(
        yaxis_title='Price',
        xaxis_rangeslider_visible=False,
        height=550,
        plot_bgcolor='white',
        paper_bgcolor='white',
          xaxis=dict(
                showgrid=True,
                gridwidth=1,
                gridcolor='lightgrey',
                dtick='M1'
            ),
            yaxis=dict(
                showgrid=True,
                gridwidth=1,
                gridcolor='lightgrey'
            ),
        xaxis2=dict(  # Enable grid for bar plot's x-axis
            showgrid=True,
            gridwidth=1,
            dtick='M1',
            gridcolor='lightgrey' 
            ),
        yaxis2=dict(title='<br>Weekly<br>Delivery<br>Percentage',
                showgrid=False,        
                gridcolor='lightgrey',
                showline=False,        # Hides the axis line
                showticklabels=False   # Hides the tick labels
            )
    )

    comment = """
        The candlestick chart represents stock trends with ribbons indicating uptrends (green) and downtrends (red). 
        The delivery percentage is shown as green bars below.
    """

    # Serialize the figure and return as JSON
    fig_dict = fig.to_dict()

    # Convert all numpy arrays to lists for JSON serialization
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

    fig_dict_serializable = convert_ndarray(fig_dict)

    return {
        "scatter_data": fig_dict_serializable['data'],
        "layout": fig_dict_serializable['layout'],
        "comment": comment
    }
if __name__ == "__main__":
    json_path = sys.argv[1]
    result = create_worm_plot(json_path)

    # Convert result to a JSON serializable format
    def make_serializable(obj):
        if isinstance(obj, (datetime.datetime, pd.Timestamp)):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, dict):
            return {key: make_serializable(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [make_serializable(item) for item in obj]
        return obj

    serializable_result = make_serializable(result)

    print(json.dumps(serializable_result))

