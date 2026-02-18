import sys
import pandas as pd
import json
import plotly.express as px
import numpy as np

def corr_heatmap(json_path, stock_symbol="UNIVCABLES"):
    try:
        # Attempt to read as NDJSON
        data = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        data = pd.read_json(json_path, lines=False)

    # Load additional data
    df1 = pd.read_csv('src/main/resources/data/sensex_data/nifty_50.csv')
    df2 = pd.read_csv('src/main/resources/data/sensex_data/bse_sensex.csv')

    # Function to calculate percentage changes
    def calculate_changes(df, column="Close"):
        df = df.copy()
        df["Daily"] = df[column].pct_change() * 100
        df["Weekly"] = df[column].pct_change(5) * 100
        df["Monthly"] = df[column].pct_change(20) * 100
        df["YTD"] = (df[column] / df[column].iloc[0] - 1) * 100
        return df[["Daily", "Weekly", "Monthly", "YTD"]].iloc[-1]

    # Calculate changes for each dataset
    stock_changes = calculate_changes(data)
    nifty50_changes = calculate_changes(df1)
    bse_changes = calculate_changes(df2)

    # Combine data into a single DataFrame
    combined_data = pd.DataFrame({
        "Metric": ["Daily", "Weekly", "Monthly", "YTD"],
        f"{stock_symbol}": stock_changes.values,
        "Nifty 50": nifty50_changes.values,
        "BSE Sensex": bse_changes.values
    })

    # Melt for heatmap
    melted_data = combined_data.melt(id_vars="Metric", var_name="Index", value_name="Change")

    # Ensure the stock is always at the end
    melted_data["Index"] = pd.Categorical(
        melted_data["Index"],
        categories=["Nifty 50", "BSE Sensex", f"{stock_symbol}"],
        ordered=True
    )
    
    # Sort based on the defined order
    melted_data = melted_data.sort_values("Index")

    # Ensure the order of metrics is correct (Daily, Weekly, Monthly, YTD)
    melted_data["Metric"] = pd.Categorical(
        melted_data["Metric"],
        categories=["Daily", "Weekly", "Monthly", "YTD"],
        ordered=True
    )

    # Sort based on the defined order
    melted_data = melted_data.sort_values("Metric")
    
    # Add triangles with neon colors for increase (green) and decrease (red), text remains black
    def add_neon_colored_triangles(df):
        annotated = df.copy()
        for metric in df.index:
            for col in df.columns:
                value = df.loc[metric, col]
                # Define triangle color
                if value > 0:
                    triangle = f"<span style='color:#39FF14'>&#9650;</span>"  # Neon green triangle
                elif value < 0:
                    triangle = f"<span style='color:#FF073A'>&#9660;</span>"  # Neon red triangle
                else:
                    triangle = ""  # No triangle for neutral values
                
                # Combine triangle and value (text remains black)
                annotated.loc[metric, col] = f"{triangle} <span style='color:black'>{value:.2f}%</span>"
        return annotated
    
    # Prepare the data for the heatmap
    pivot_data = melted_data.pivot(index="Metric", columns="Index", values="Change")
    annotated_data = add_neon_colored_triangles(pivot_data)
    
    # Define a custom color scale: red -> white -> green
    custom_color_scale = [
        [0.0, "#ff0000"],  # Minimum value: red
        [0.5, "white"],    # Midpoint: white
        [1.0, "green"]     # Maximum value: green
    ]

    # Create heatmap with 0 at the center of the color scale
    fig = px.imshow(
        pivot_data,
        color_continuous_scale=custom_color_scale,  # Red for negative, Green for positive
        color_continuous_midpoint=0,  # Center the scale at 0
        labels={"color": "Change (%)"},
        text_auto=False,
        aspect="auto"
    )
    
    # Add the text with neon-colored triangles
    fig.update_traces(
        xgap=2,  # Horizontal gap between boxes
        ygap=2,   # Vertical gap between boxes
        text=annotated_data.values,
        texttemplate="%{text}",  # Use custom text with neon triangles
        textfont=dict(size=16,family="Google Sans, Arial, sans-serif")  # Adjust font size for better readability
    )

    fig.update_layout(
        title=dict(text=f"Performance Heatmap: {stock_symbol} vs Nifty 50 vs BSE Sensex", x=0.5, y=0.935, font=dict(size=16)),
        xaxis_title="",
        yaxis_title="",
        font=dict(size=18, family="Google Sans, Arial, sans-serif"),
        coloraxis_colorbar=dict(title="Change (%)"),
        coloraxis_showscale=False
    )

    # Statistical summary for comment
    comment = (
        f"The heatmap shows the comparative performance of {stock_symbol}, Nifty 50, and BSE Sensex over daily, weekly, monthly, and YTD periods."
    )

    # Convert the figure to JSON-compatible format
    fig_dict = fig.to_dict()

    # Recursively convert all NumPy arrays to lists
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

    # Return JSON response
    return {
        "heatmap_data": fig_dict_serializable['data'],
        "layout": fig_dict_serializable['layout'],
        "comment": comment
    }

if __name__ == "__main__":
    json_path = sys.argv[1]
    stock_symbol = sys.argv[2] if len(sys.argv) > 2 else "UNIVCABLES"
    result = corr_heatmap(json_path, stock_symbol)

    # Ensure the result is JSON serializable
    print(json.dumps(result))
