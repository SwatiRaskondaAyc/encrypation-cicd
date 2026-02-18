import pandas as pd
import numpy as np
import plotly.graph_objects as go
import json
import datetime

# Recursively convert non-serializable objects to JSON-compatible types
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

def create_avg_box_plot(json_path):
    try:
        # Attempt to read as NDJSON
        df = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        df = pd.read_json(json_path, lines=False)

    # Ensure 'Date' and 'Close' columns exist
    if 'Date' not in df.columns or 'Close' not in df.columns:
        raise ValueError("The input JSON must contain 'Date' and 'Close' columns.")

    df_copy = df.copy()

    # Ensure 'Date' is in datetime format
    df_copy['Date'] = pd.to_datetime(df_copy['Date'])

    # Create a 'Month' column based on the 'Date' to group by month
    df_copy['Month'] = df_copy['Date'].dt.to_period('M')

    # Aggregate data for each month
    monthly_data = df_copy.groupby('Month').agg({
        'High': 'max',
        'Low': 'min',
        'Close': 'mean',  # Calculate average closing price
    }).reset_index()

    # Prepare data for box plot
    box_data = df_copy.groupby('Month')['Close'].apply(list).reset_index()

    # Create the plot
    fig = go.Figure()

    # Add box plot for the monthly closing prices
    for index, row in box_data.iterrows():
        fig.add_trace(go.Box(
            y=row['Close'],
            name=row['Month'].strftime('%Y-%m'),  # Convert Period to string
            marker_color='#32a1e6',
            showlegend=False
        ))

    # Add scatter plot for average closing price
    fig.add_trace(go.Scatter(
        x=monthly_data['Month'].dt.to_timestamp(),  # Convert Period to Timestamp
        y=monthly_data['Close'],
        mode='lines+markers',
        name='Average Closing Price',
        line=dict(color='orange', width=2, shape='spline'),
        marker=dict(size=5)
    ))

    # Update layout for better aesthetics
    fig.update_layout(
        # title="Monthly Price Ranges with Average Price for TTM",
        # xaxis_title="Month",
        # yaxis_title="Price",
        # template="plotly_white",
        # height=700,
        # width=1500
        xaxis_title={'text':'Month', 'font':{'size':20}},
            yaxis_title={'text':'Price', 'font':{'size':20}},
            template='plotly_white',
            font=dict(size=12, color='black'),
            height=700,
            width=1500,
            xaxis = dict(tickfont=dict(size=17),dtick='M1',tickangle=35),
            yaxis = dict(tickfont=dict(size=17))
    )

    # Dynamic comment based on statistical analysis
    overall_mean = df_copy['Close'].mean()
    overall_std_dev = df_copy['Close'].std()
    latest_month = monthly_data.iloc[-1]['Month'].strftime('%Y-%m')  # Convert Period to string
    latest_avg_price = monthly_data.iloc[-1]['Close']

    comment = (
        f"The monthly price ranges are shown for the trailing twelve months. "
        f"The overall average closing price is {overall_mean:.2f} with a standard deviation of {overall_std_dev:.2f}. "
        f"For the most recent month ({latest_month}), the average closing price is {latest_avg_price:.2f}."
    )

    # Convert the figure to a JSON-compatible format
    fig_dict = fig.to_dict()

    # Recursively convert non-serializable objects to JSON-compatible types
    fig_dict_serializable = convert_serializable(fig_dict)

    # Return JSON response
    return {
        "box_plot_data": fig_dict_serializable['data'],
        "layout": fig_dict_serializable['layout'],
        "overall_mean": overall_mean,
        "overall_std_dev": overall_std_dev,
        "latest_month_avg_price": latest_avg_price,
        "comment": comment
    }

if __name__ == "__main__":
    import sys

    # Read JSON path from command-line arguments
    json_path = sys.argv[1]

    # Generate result
    result = create_avg_box_plot(json_path)

    # Ensure the result is JSON serializable and print
    serializable_result = convert_serializable(result)
    print(json.dumps(serializable_result, indent=4))
