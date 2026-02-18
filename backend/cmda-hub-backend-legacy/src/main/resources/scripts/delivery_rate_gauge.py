import sys
import pandas as pd
import json
import plotly.graph_objects as go
import numpy as np
import matplotlib.pyplot as plt

def delivery_rate_gauge(json_path):
    def calc_avg_delv_rate(df, period):
        """Calculate the average delivery rate for a given DataFrame."""
        if period == 'Previous Day':
            avg_delivery_rate = df['DeliveryPercentage'].values[0]
        else:
            deliverable_qty = df['DeliverableQty'].sum()
            total_qty = df['TotalTradedQty'].sum()
            avg_delivery_rate = round((deliverable_qty / total_qty) * 100, 2)
        return avg_delivery_rate

    def generate_color_scale(colormap, num_values, brightness=1.0):
        """Generate a color scale using the specified colormap."""
        cmap = plt.cm.get_cmap(colormap)
        
        if brightness != 1.0:
            cmap_colors = cmap(np.linspace(0, 1, 256))
            cmap_colors = np.clip(cmap_colors * brightness, 0, 1)
            cmap = plt.cm.colors.ListedColormap(cmap_colors)
        
        def value_to_color(value):
            normalized_value = value / (num_values - 1)
            rgba_color = cmap(normalized_value)
            hex_color = "#{:02x}{:02x}{:02x}".format(int(rgba_color[0]*255), int(rgba_color[1]*255), int(rgba_color[2]*255))
            return hex_color
        
        color_scale_dict = {value: value_to_color(value) for value in range(num_values)}
        return color_scale_dict

    def calculate_avg_delivery_rate(df, period='1Y'):
        """Calculate the average delivery rate for a specified period."""
        if period == '1Y':
            df['Date'] = pd.to_datetime(df['Date'])
            one_year_ago = pd.Timestamp.now() - pd.DateOffset(years=1)
            recent_data = df[df['Date'] >= one_year_ago]
        else:
            recent_data = df

        if 'DeliveryPercentage' not in recent_data.columns:
            raise ValueError("The input data must contain a 'DeliveryPercentage' column.")
        
        return recent_data['DeliveryPercentage'].mean()

    try:
        data = pd.read_json(json_path, lines=True)
    except ValueError:
        data = pd.read_json(json_path, lines=False)

    if 'Date' not in data.columns:
        raise ValueError("The input JSON must contain a 'Date' column.")

    avg_delivery_rate_1Y = calculate_avg_delivery_rate(data, period='1Y')
    avg_delivery_rate_Xperiod = calculate_avg_delivery_rate(data.iloc[-1:], period='X')

    latest_date = pd.to_datetime(data['Date'].iloc[-1]).strftime('%d-%b-%Y')

    color_scale = generate_color_scale('RdYlGn', 100, brightness=2)

    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=avg_delivery_rate_Xperiod,
        delta={"reference": avg_delivery_rate_1Y, "position": "top"},
        title={"text": "Delivery Rate Gauge"},
        gauge={
            'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "darkblue"},
            'bar': {'color': color_scale[round(avg_delivery_rate_1Y)]},
            'threshold': {'line': {'color': "black", 'width': 4}, 'thickness': 0.75, 'value': avg_delivery_rate_1Y},
            'bgcolor': "lightgrey",
            'borderwidth': 2,
            'bordercolor': "gray",
        }
    ))

    fig.update_layout(title_text=f"Delivery Rate Comparison", title_y=0.95, title_x=0.5)
    fig.add_annotation(text=f"Avg Delivery Rate Over the Year: {avg_delivery_rate_1Y}%", x=0.5, y=1.3, showarrow=False,
                        font=dict(color="black", size=21))

    fig.add_annotation(x=0.5, y=0.15, text=f"{avg_delivery_rate_Xperiod}%", showarrow=False, font=dict(size=21), align='center')
    fig.add_annotation(x=0.5, y=0.4, text=f"Rate as of {latest_date}", showarrow=False, font=dict(size=18), align='center')

    sentiment = "Bullish Sentiment" if avg_delivery_rate_Xperiod > avg_delivery_rate_1Y else "Bearish Sentiment"
    delivery_behavior = ("investors are likely holding shares longer" if avg_delivery_rate_Xperiod < avg_delivery_rate_1Y else "investors are likely trading more frequently")

    comment = f"""<p style="color: white;">
    Delivery rate is a key indicator of market sentiment. The Delivery Rate as of {latest_date} is {avg_delivery_rate_Xperiod}%,
    {sentiment}, suggesting that {delivery_behavior}.
    </p>"""

    fig.update_layout(
        title="Delivery Rate Comparison",
        height=400
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
        "layout": fig_dict_serializable['layout'],
        "avg_delivery_rate_1Y": avg_delivery_rate_1Y,
        "avg_delivery_rate_Xperiod": avg_delivery_rate_Xperiod,
        "latest_date": latest_date,
        "comment": comment
    }

if __name__ == "__main__":
    json_path = sys.argv[1]
    result = delivery_rate_gauge(json_path)
    print(json.dumps(result))


