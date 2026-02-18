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

def create_macd_plot(json_path):
    try:
        # Attempt to read as NDJSON
        df = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        df = pd.read_json(json_path, lines=False)

    # Ensure 'Date' and 'Close' columns exist
    if 'Date' not in df.columns or 'Close' not in df.columns:
        raise ValueError("The input JSON must contain 'Date' and 'Close' columns.")

    # Ensure 'Date' is in datetime format
    df['Date'] = pd.to_datetime(df['Date'])

    # Calculate the 12-day and 26-day EMAs
    df['EMA_12'] = df['Close'].ewm(span=12, adjust=False).mean()
    df['EMA_26'] = df['Close'].ewm(span=26, adjust=False).mean()

    # Calculate MACD and Signal Line
    df['MACD'] = df['EMA_12'] - df['EMA_26']
    df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()

    # Calculate Divergence
    df['Divergence'] = (df['MACD'] - df['Signal_Line']).abs()
    
     # Identify crossovers
    bullish_crossovers = df[(df['MACD'] > df['Signal_Line']) & (df['MACD'].shift(1) <= df['Signal_Line'])]
    bearish_crossovers = df[(df['MACD'] < df['Signal_Line']) & (df['MACD'].shift(1) >= df['Signal_Line'])]

    # Threshold calculations
    continuous_divergence = df['Divergence'][df['MACD'] > df['Signal_Line']]
    reversal_divergence = df['Divergence'][df['MACD'] <= df['Signal_Line']]
    threshold = continuous_divergence.mean() + continuous_divergence.std()
    
 # calulating thresholds

    lookback = 5
    
    # Step 2: Identify crossover points as trend reversals
    df['Trend_Reversal'] = np.where((df['MACD'] > df['Signal_Line']) & (df['MACD'].shift(1) <= df['Signal_Line']) |
                                    (df['MACD'] < df['Signal_Line']) & (df['MACD'].shift(1) >= df['Signal_Line']),
                                    True, False)
    
    # Step 3: Mark periods of continuous trend (not near crossover)
    df['Continuous_Trend'] = ~df['Trend_Reversal'].rolling(window=lookback, center=True).max().fillna(0).astype(bool)
    
    # Step 4: Calculate mean divergence for continuous trends and trend reversals
    continuous_divergence = df[df['Continuous_Trend']]['Divergence']
    reversal_divergence = df[df['Trend_Reversal']]['Divergence']
    
    # Step 5: Define a threshold value that separates high divergence (continuous trend)
    threshold = continuous_divergence.mean() + continuous_divergence.std()
    

    Continuous_Trend_Mean_Divergence = continuous_divergence.mean()
    Reversal_Mean_Divergence = reversal_divergence.mean()
    Threshold_Divergence = threshold


    # Create the plot
    fig = go.Figure()

    # Divergence area
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['Divergence'],
        fill='tozeroy',
        mode='none',
        fillcolor='rgba(50, 205, 50, 0.7)',
        name='Divergence'
    ))

    # MACD and Signal Line
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['MACD'],
        mode='lines',
        name='MACD',
        line=dict(color='orange')
    ))
    fig.add_trace(go.Scatter(
        x=df['Date'],
        y=df['Signal_Line'],
        mode='lines',
        name='Signal Line',
        line=dict(color='blue')
    ))
    
     # Add bullish crossover points (MACD crossing Signal Line from below)
    fig.add_trace(go.Scatter(
        x=bullish_crossovers['Date'], y=bullish_crossovers['MACD'],
        mode='markers', name='Bullish Crossover', marker=dict(color='green', size=8),
        hovertemplate='Date: %{x|%Y-%m-%d}<br>MACD: %{y:.2f}<extra></extra>'
    ))

    # Add bearish crossover points (MACD crossing Signal Line from above)
    fig.add_trace(go.Scatter(
        x=bearish_crossovers['Date'], y=bearish_crossovers['MACD'],
        mode='markers', name='Bearish Crossover', marker=dict(color='red', size=8),
        hovertemplate='Date: %{x|%Y-%m-%d}<br>MACD: %{y:.2f}<extra></extra>'
    ))

    # Horizontal line for Continuous_Trend_Mean_Divergence
    fig.add_trace(go.Scatter(
        x=[df['Date'].min(), df['Date'].max()],
        y=[Continuous_Trend_Mean_Divergence, Continuous_Trend_Mean_Divergence],
        mode="lines",
        line=dict(color="purple", width=1.5, dash="dash"),
        name="Continuous Trend Mean Divergence"  # This will show up in the legend
    ))


    # Horizontal line for Reversal_Mean_Divergence
    fig.add_trace(go.Scatter(
        x=[df['Date'].min(), df['Date'].max()],
        y=[Reversal_Mean_Divergence, Reversal_Mean_Divergence],
        mode="lines",
        line=dict(color="red", width=1.5, dash="dash"),
        name="Reversal Mean Divergence"  # This will show up in the legend
    ))


    # Update layout
    fig.update_layout(
        title="MACD Chart with Divergence",
        xaxis_title="Date",
        yaxis_title="Value",
        template="plotly_white",
        height=700,
        width=1500
    )

    # Generate comments based on the data
    overall_mean_macd = df['MACD'].mean()
    overall_mean_signal = df['Signal_Line'].mean()
    latest_date = df.iloc[-1]['Date'].strftime('%Y-%m-%d')
    latest_macd = df.iloc[-1]['MACD']
    latest_signal = df.iloc[-1]['Signal_Line']

    comment = (
        f"The MACD chart shows the momentum of price movements over time. "
        f"The overall average MACD value is {overall_mean_macd:.2f}, while the average Signal Line value is {overall_mean_signal:.2f}. "
        f"As of the latest date ({latest_date}), the MACD value is {latest_macd:.2f} and the Signal Line value is {latest_signal:.2f}."
    )

    # Convert the figure to a JSON-compatible format
    fig_dict = fig.to_dict()
    fig_dict_serializable = convert_serializable(fig_dict)

    # Return JSON response
    return {
        "macd_plot_data": fig_dict_serializable['data'],
        "layout": fig_dict_serializable['layout'],
        "overall_mean_macd": overall_mean_macd,
        "overall_mean_signal": overall_mean_signal,
        "latest_date": latest_date,
        "latest_macd": latest_macd,
        "latest_signal": latest_signal,
        "comment": comment
    }

if __name__ == "__main__":
    import sys

    # Read JSON path from command-line arguments
    json_path = sys.argv[1]

    # Generate result
    result = create_macd_plot(json_path)

    # Ensure the result is JSON serializable and print
    serializable_result = convert_serializable(result)
    print(json.dumps(serializable_result, indent=4))

