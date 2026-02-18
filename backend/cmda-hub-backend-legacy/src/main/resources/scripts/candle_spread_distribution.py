import pandas as pd
import numpy as np
import plotly.figure_factory as ff
import plotly.graph_objects as go
import json
import datetime

def candle_spread_distribution(json_path):
   

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

    # Read JSON data
    try:
        # Attempt to read as NDJSON
        data = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        data = pd.read_json(json_path, lines=False)

    data['Spread'] = data['Open'] - data['Close']

    def create_plot(df_subset, title):
        hist_data = [df_subset['Spread']]
        group_labels = ['Candle Spread']

        # Create distribution plot
        fig = ff.create_distplot(hist_data, group_labels, bin_size=2, show_rug=False)
        fig.update_traces(marker_color='orange')
        fig.update_traces(line_color='red', selector=dict(type='scatter'))

        # Calculate statistics
        median_val = np.median(df_subset['Spread'])
        std_dev = np.std(df_subset['Spread'])
        max_relative_density = max(fig['data'][1]['y'])

        # Count occurrences for the specified bins
        count_minus_std_dev = df_subset[(df_subset['Spread'] >= median_val - std_dev - 1) & (df_subset['Spread'] <= median_val - std_dev + 1)].shape[0]
        count_plus_std_dev = df_subset[(df_subset['Spread'] >= median_val + std_dev - 1) & (df_subset['Spread'] <= median_val + std_dev + 1)].shape[0]
        count_median = df_subset[(df_subset['Spread'] >= median_val - 1) & (df_subset['Spread'] <= median_val + 1)].shape[0]

        # Calculate total number of observations
        total_observations = df_subset.shape[0]

        # Calculate probabilities
        probability_median = count_median / total_observations
        probability_minus_std_dev = (count_minus_std_dev / total_observations) * 100
        probability_plus_std_dev = (count_plus_std_dev / total_observations) * 100

    
        # Add vertical lines for median and standard deviations
        shapes = [
            dict(type="line", x0=median_val, y0=0, x1=median_val, y1=max_relative_density, line=dict(color="black", width=2, dash="dash")),
            dict(type="line", x0=median_val - std_dev, y0=0, x1=median_val - std_dev, y1=max_relative_density, line=dict(color="green", width=2, dash="dash")),
            dict(type="line", x0=median_val + std_dev, y0=0, x1=median_val + std_dev, y1=max_relative_density, line=dict(color="green", width=2, dash="dash"))
        ]

        # Add annotations
        annotations = [
             dict(x=median_val, y=max_relative_density, xref='x', yref='y', text=f'Median', showarrow=False, font=dict(color='black',family='Arial Black')),
                dict(x=median_val - std_dev, y=max_relative_density + 0.005, xref='x', yref='y', text=f'-ve <br> Std Dev1 <br> ({probability_minus_std_dev:.2f} %) ', showarrow=False, font=dict(color='green',family='Arial Black')),
                dict(x=median_val + std_dev, y=max_relative_density + 0.005, xref='x', yref='y', text=f'+ve <br> Std Dev1 <br> ({probability_plus_std_dev:.2f} %)', showarrow=False, font=dict(color='green',family='Arial Black')),
                dict(x=median_val, y=-0.001, xref='x', yref='y', text=f'{median_val:.2f}', showarrow=False, font=dict(color='black',family='Arial Black')),
                dict(x=median_val - std_dev, y=-0.001, xref='x', yref='y', text=f'{median_val - std_dev:.2f}', showarrow=False, font=dict(color='green',family='Arial Black')),
                dict(x=median_val + std_dev, y=-0.001, xref='x', yref='y', text=f'{median_val + std_dev:.2f}', showarrow=False, font=dict(color='green',family='Arial Black'))
            ]
        
         # Create scatter points for a rug plot-like effect
        hist_values, bin_edges = np.histogram(df_subset['Spread'], bins=30)
        bin_centers = 0.5 * (bin_edges[1:] + bin_edges[:-1])
        max_hist_value = max(hist_values)
        min_y_value = min(fig.data[0].y) if fig.data[0].y is not None else 0

        rug_scatter = go.Scatter(
            x=bin_centers,
            y=[min_y_value - 0.0025] * len(bin_centers),
            mode='markers',
            marker=dict(
                symbol='arrow-up',
                size=12,
                color=['rgba(255, 0, 0, {:.3f})'.format(val / max_hist_value) for val in hist_values]
            ),
            text=[f'Count: {hist_values[i]}' for i in range(len(hist_values))],
            hoverinfo='text',
            showlegend=False
        )

        fig.add_trace(rug_scatter)
        
        # Update layout
        fig.update_layout(
            title=title,
            shapes=shapes,
            annotations=annotations,
            xaxis_title="Price Variation",
            yaxis_title="Density",
            template="plotly_white"
        )

        return fig

    # Define data subsets
    full_data = data.copy()
    one_month_data = data[data['Date'] >= (data['Date'].max() - pd.Timedelta(days=30))]
    one_week_data = data[data['Date'] >= (data['Date'].max() - pd.Timedelta(days=7))]

    # Create plots
    full_fig = create_plot(full_data, "Full Data Distribution")
    one_month_fig = create_plot(one_month_data, "Last One Month Distribution")
    one_week_fig = create_plot(one_week_data, "Last One Week Distribution")

    # Combine all traces
    combined_fig = go.Figure()
    for trace in full_fig.data:
        combined_fig.add_trace(trace)
    for trace in one_month_fig.data:
        combined_fig.add_trace(trace)
    for trace in one_week_fig.data:
        combined_fig.add_trace(trace)

    # Set initial visibility
    num_full_traces = len(full_fig.data)
    num_one_month_traces = len(one_month_fig.data)
    num_one_week_traces = len(one_week_fig.data)

    visibility = [True] * num_full_traces + [False] * (num_one_month_traces + num_one_week_traces)
    combined_fig.for_each_trace(lambda trace, i=iter(visibility): trace.update(visible=next(i)))

    # Add dropdown menu
    combined_fig.update_layout(
        updatemenus=[
            dict(
                buttons=[
                    dict(label="Full Data",
                         method="update",
                         args=[
                             {"visible": [True] * num_full_traces + [False] * (num_one_month_traces + num_one_week_traces)},
                             {"title": "Full Data Distribution", "shapes": full_fig.layout.shapes, "annotations": full_fig.layout.annotations}
                         ]),
                    dict(label="Last One Month",
                         method="update",
                         args=[
                             {"visible": [False] * num_full_traces + [True] * num_one_month_traces + [False] * num_one_week_traces},
                             {"title": "Last One Month Distribution", "shapes": one_month_fig.layout.shapes, "annotations": one_month_fig.layout.annotations}
                         ]),
                    dict(label="Last One Week",
                         method="update",
                         args=[
                             {"visible": [False] * (num_full_traces + num_one_month_traces) + [True] * num_one_week_traces},
                             {"title": "Last One Week Distribution", "shapes": one_week_fig.layout.shapes, "annotations": one_week_fig.layout.annotations}
                         ])
                ],
                direction="down",
                showactive=True
            )
        ]
    )

    # Extract KDE values
    kde_x = full_fig['data'][1]['x']
    kde_y = full_fig['data'][1]['y']

    # Calculate overall statistics
    median_val = np.median(data['Spread'])
    std_dev = np.std(data['Spread'])

    # Comment for voiceover
    comment = (f"""The above plot shows the Candle Spread Distribution over the past one year (TTM). The median represents value of price action we saw on most of the days in the past TTM. 
                Additionally, the -ve standard deviation value tells us that on a down moving day after an open the price would close generally near it. Below it, is shown the % probability of this happening based on the TTM data
                and the +ve standard deviation tells us that on a up moving day after an open the price would close generally near it.
                These values suggest a typical range for this stocks closing prices."""
                   )

    full_dict = full_fig.to_dict()
    month_dict = one_month_fig.to_dict()
    week_dict = one_week_fig.to_dict()

    
    fig_to_searial = convert_to_serializable(full_dict)
    fig_to_month = convert_to_serializable(month_dict)
    fig_to_week = convert_to_serializable(week_dict)
    # Return data as JSON (convert tuples or arrays to lists)
    return {
        # "combined_plot_html": combined_fig.to_html(full_html=False, include_plotlyjs='cdn'),
        'fig_to_searial': fig_to_searial,
        'fig_to_month' : fig_to_month,
        "fig_to_week" : fig_to_week,
        # "group_labels": group_labels,
        "kde_x": list(kde_x),
        "kde_y": list(kde_y),
        "median": median_val,
        "std_dev": std_dev,
        "comment": comment
    }

if __name__ == "__main__":
    import sys
    json_path = sys.argv[1]
    result = candle_spread_distribution(json_path)
    print(json.dumps(result))
