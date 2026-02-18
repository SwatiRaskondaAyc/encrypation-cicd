import sys
import pandas as pd
import json
import plotly.graph_objects as go
import plotly.express as px
import numpy as np
from fsspec.implementations import data

def last_traded_price_box_plot(json_path):
    def calculate_swing_pivot_points(df):
        pivot_points = []
        resistance_levels = {1: [], 2: []}
        support_levels = {1: [], 2: []}

        for i in range(len(df)):
            H = df['High'].max()
            L = df['Low'].min()
            C = df['Close'].iloc[i]

            pivot = (H + C + L) / 3
            R1 = 2 * pivot - L
            S1 = 2 * pivot - H

            pivot_points.append(pivot)
            resistance_levels[1].append(R1)
            support_levels[1].append(S1)

        df['Pivot_Point'] = pivot_points
        df['Resistance_1'] = resistance_levels[1]
        df['Support_1'] = support_levels[1]

        return df

    try:
        data = pd.read_json(json_path, lines=True)
    except ValueError:
        data = pd.read_json(json_path, lines=False)

    if 'LastPrice' not in data.columns:
        raise ValueError("The input JSON must contain a 'LastPrice' column.")

    data = calculate_swing_pivot_points(data)

    data['Period'] = '1 Year'
    last_record = data.iloc[[-1]]
    #last_record['Period'] = 'Previous Day'
    #combined_df = pd.concat([data, last_record])
    combined_df = data

    color_map = {'1 Year': '#0080d3', 'Previous Day': 'red'}
    fig = px.strip(
        combined_df,
        y="LastPrice",
        color="Period",
        stripmode="overlay",
        color_discrete_map=color_map
    )

    # Update strip plot
    fig.update_traces(marker=dict(size=7), selector=dict(name='1W'))  # Adjust marker size for past period
    fig.update_traces(marker=dict(color=color_map['1 Year'], opacity=0.7), selector=dict(name='1 Year'))  # Reduce opacity for the 1 Year data pts to highlight selected period
    fig.update_traces(showlegend=False)  # Remove legend from strip plot

    fig.add_trace(go.Box(
        y=data['LastPrice'],
        marker=dict(color=color_map['1 Year']),
        name='1 Year'
    ))
    fig.add_trace(go.Box(
        y=last_record['LastPrice'],
        marker=dict(color=color_map['Previous Day']),
        name='Previous Day'
    ))

    for line_type, color, name in zip(['Pivot_Point', 'Resistance_1', 'Support_1'],
                                      ['#FFA500', '#FF0000', '#008000'],
                                      ['Pivot Point', 'Resistance', 'Support']):
        if line_type in data.columns:
            y_val = data[line_type].iloc[-1]
            fig.add_shape(type="line",
                          x0=-0.5, x1=0.5,
                          y0=y_val, y1=y_val,
                          line=dict(color=color, width=2, dash="dash"),
                          layer="below")
            fig.add_annotation(x=0, y=y_val, text=f'{name}: {y_val:.2f}', showarrow=False, font=dict(color=color), yshift=10)
            fig.add_trace(go.Scatter(x=[0], y=[y_val], mode='lines', name=f'{name}', line=dict(color=color, width=2, dash="dash")))

    fig.update_layout(
        title="Last Traded Price Box and Strip Plot",
        yaxis=dict(title="Last Traded Price"),
        hovermode='x',
        font=dict(family='Arial', size=12, color='black'),
        showlegend=True
    )

    fig_dict = fig.to_dict()

    def convert_ndarray(obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, list):
            return [convert_ndarray(item) for item in obj]
        elif isinstance(obj, dict):
            return {key: convert_ndarray(value) for key, value in obj.items()}
        else:
            return obj

    fig_dict_serializable = convert_ndarray(fig_dict)

    return {
        "scatter_data": fig_dict_serializable['data'],
        "layout": fig_dict_serializable['layout']
    }

if __name__ == "__main__":
    json_path = sys.argv[1]
    result = last_traded_price_box_plot(json_path)
    print(json.dumps(result))
