import sys
import pandas as pd
import json
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
import datetime
from numpy import shape

# Recursively convert objects to JSON-serializable formats
def convert_to_serializable(obj):
    if isinstance(obj, (np.ndarray, pd.Series)):
        return obj.tolist()
    elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime.datetime, datetime.date)):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    else:
        return obj

def candle_breach_analysis(json_path):
    try:
        # Attempt to read as NDJSON
        df = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        df = pd.read_json(json_path, lines=False)

    print(type(df))
    # Ensure necessary columns exist
    required_columns = {'Date', 'Open', 'High', 'Low', 'Close'}
    if not required_columns.issubset(df.columns):
        raise ValueError(f"The input JSON must contain columns: {', '.join(required_columns)}")

    # Ensure 'Date' is in datetime format
    df['Date'] = pd.to_datetime(df['Date'])

    # Create a 'Month' column based on the 'Date' to group by month
    df['Month'] = df['Date'].dt.to_period('M')

    # Group by month to get the highest high and lowest low for the previous month
    monthly_data = df.groupby('Month').agg({
        'High': 'max', 
        'Low': 'min', 
        'Close': 'last'
    }).reset_index()

    # Shift to get previous month's values
    monthly_data['Prev_High'] = monthly_data['High'].shift(1)
    monthly_data['Prev_Low'] = monthly_data['Low'].shift(1)

    # Merge back with the original DataFrame to align closing prices
    df = df.merge(monthly_data[['Month', 'Prev_High', 'Prev_Low']], on='Month', how='left')

    # Calculate breaches
    df['Strong_High_Breach'] = (df['Close'] > df['Prev_High']).astype(int)
    df['Wick_High_Breach'] = ((df['Close'] < df['Prev_High']) & (df['High'] > df['Prev_High'])).astype(int)
    df['Strong_Low_Breach'] = (df['Close'] < df['Prev_Low']).astype(int)
    df['Wick_Low_Breach'] = ((df['Close'] > df['Prev_Low']) & (df['Low'] < df['Prev_Low'])).astype(int)

    # Aggregate breach counts by month
    monthly_breach_counts = df.groupby('Month').agg({
        'Strong_High_Breach': 'sum',
        'Wick_High_Breach': 'sum',
        'Strong_Low_Breach': 'sum',
        'Wick_Low_Breach': 'sum'
    }).reset_index()

    # Ensure all months are represented even if counts are zero
    all_months = pd.date_range(start=df['Date'].min(), end=df['Date'].max(), freq='MS')
    monthly_breach_counts = monthly_breach_counts.set_index('Month').reindex(all_months.to_period('M')).fillna(0).reset_index()

    # Convert the 'Month' back to a timestamp for plotting
    monthly_breach_counts['Month'] = monthly_breach_counts['index'].dt.to_timestamp()
    monthly_breach_counts = monthly_breach_counts.drop(columns='index')

    # Create a subplot for the analysis
    fig = make_subplots(rows=2, cols=1, shared_xaxes=True, row_heights=[0.7, 0.3], vertical_spacing=0.1)

    # Add the candlestick plot
    fig.add_trace(go.Candlestick(
        x=df['Date'],
        open=df['Open'],
        high=df['High'],
        low=df['Low'],
        close=df['Close'],
        name='Candlestick'
    ), row=1, col=1)

    # Add breach traces
    fig.add_trace(go.Scatter(
        x=monthly_data['Month'].dt.to_timestamp(),
        y=monthly_data['Prev_High'],
        mode='lines',
        name='Previous Month High',
        line=dict(color='green', width=2, shape = 'hv')
    ), row=1, col=1)

    fig.add_trace(go.Scatter(
        x=monthly_data['Month'].dt.to_timestamp(),
        y=monthly_data['Prev_Low'],
        mode='lines',
        name='Previous Month Low',
        line=dict(color='red', width=2, shape = 'hv')
    ), row=1, col=1)
    
    # Add bar traces to the second row
    fig.add_trace(go.Bar(
        x=monthly_breach_counts['Month'],
        y=monthly_breach_counts['Strong_High_Breach'],
        name='Strong High Breach',
        marker_color='darkgreen',
        text=monthly_breach_counts['Strong_High_Breach'].astype(int).astype(str),  # Show count as text
        textposition='outside'
    ), row=2, col=1)

    fig.add_trace(go.Bar(
        x=monthly_breach_counts['Month'],
        y=monthly_breach_counts['Wick_High_Breach'],
        name='Wick High Breach',
        marker_color='lightgreen',
        text=monthly_breach_counts['Wick_High_Breach'].astype(int).astype(str),  # Show count as text
        textposition='outside'
    ), row=2, col=1)

    fig.add_trace(go.Bar(
        x=monthly_breach_counts['Month'],
        y=monthly_breach_counts['Strong_Low_Breach'],
        name='Strong Low Breach',
        marker_color='tomato',
        text=monthly_breach_counts['Strong_Low_Breach'].astype(int).astype(str),  # Show count as text
        textposition='outside'
    ), row=2, col=1)

    fig.add_trace(go.Bar(
        x=monthly_breach_counts['Month'],
        y=monthly_breach_counts['Wick_Low_Breach'],
        name='Wick Low Breach',
        marker_color='orange',
        text=monthly_breach_counts['Wick_Low_Breach'].astype(int).astype(str),  # Show count as text
        textposition='outside'
    ), row=2, col=1)


    # # Add breach bar traces
    # for breach_type, color in [
    #     ('Strong_High_Breach', 'darkgreen'), 
    #     ('Wick_High_Breach', 'lightgreen'), 
    #     ('Strong_Low_Breach', 'tomato'), 
    #     ('Wick_Low_Breach', 'orange')
    # ]:
    #     fig.add_trace(go.Bar(
    #         x=monthly_breach_counts['Month'],
    #         y=monthly_breach_counts[breach_type],
    #         name=breach_type,
    #         marker_color=color
    #     ), row=2, col=1)

    # Update layout for better aesthetics
    fig.update_layout(
        barmode='group',
        legend_title='Breach Type',
        template='plotly_white',
        hovermode='x unified',
        xaxis=dict(
            tickformat="%b-%Y",     # Format to show month and year
            tickmode='linear',      # Ensure linear spacing of ticks
            dtick="M1",             # Ensure a tick for every month
            tick0=df['Date'].min(), # Start ticks from the first available date
            tickangle=-45,          # Tilt the ticks for better readability
            rangeslider={'visible': False},  # Disable the range slider
            rangeselector=dict(visible=False)  # Disable the range selector
        ),
        yaxis=dict(
            title="Stock Prices",   # Title for the main y-axis
            # tickmode='linear'
            # dtick=100
        ),
        yaxis2=dict(
            title="Breach Count",         # Title for the secondary axis
            tickmode='linear',
            dtick=50,                    # Set the step size to 50 for breach count
        ),
        height=900,  # Adjust height for better spacing
        width=1470
    )
    # Update the x-axis of the bar traces specifically
    fig.update_xaxes(
        # title_text='Month',
        tickformat="%b-%Y",   # Format for bar chart x-axis
        tickmode='linear',     # Ensure linear spacing
        dtick="M1",            # Set to show every month (1 month interval)
        tickangle=45          # Tilt for better readability
    )

    # Convert figure to dictionary
    fig_dict = fig.to_dict()

    fig_dict_serializable = convert_to_serializable(fig_dict)

    # Return JSON response
    return {"figure": fig_dict_serializable}

if __name__ == "__main__":
    json_path = sys.argv[1]
    try:
        result = candle_breach_analysis(json_path)
        
        serializable_result = convert_to_serializable(result)
        
        
        print(json.dumps(serializable_result))
    except TypeError as e:
        print(f"Serialization error: {e}")
