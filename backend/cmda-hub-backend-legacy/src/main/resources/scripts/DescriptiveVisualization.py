import matplotlib.pyplot as plt
import numpy as np
import datetime
import pandas as pd
import numpy as np
import plotly.figure_factory as ff
import plotly.graph_objects as go
import json
import sys
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from numpy import shape
from contourpy.util import data
import plotly.graph_objects as go
import plotly.express as px
from fsspec.implementations import data
from scipy.ndimage import gaussian_filter1d
import random
import torch
import torch.nn as nn
import torch.optim as optim
from plotly.graph_objs.layout.map.layer import symbol
from pandas.tests.extension import date



class DescriptiveVisualization:

#  Candle_spread_Distribution  Graph 

    # @staticmethod
    # def candle_spread_distribution(stock_json):
   

    #     def convert_to_serializable(obj):
    #         if isinstance(obj, (np.ndarray, pd.Series)):
    #             return obj.tolist()
    #         elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime.datetime, datetime.date)):
    #             return obj.isoformat()
    #         elif isinstance(obj, dict):
    #             return {key: convert_to_serializable(value) for key, value in obj.items()}
    #         elif isinstance(obj, list):
    #             return [convert_to_serializable(item) for item in obj]
    #         else:
    #             return obj
    
    #     df_copy = pd.DataFrame(stock_json)
    
    #     data = df_copy.copy()
        
    #     data['Date'] = pd.to_datetime(data['Date'])
    #     data['Spread'] = data['Open'] - data['Close']
    
    #     # print(data.info())
        
    #     def create_plot(df_subset, title):
    #         hist_data = [df_subset['Spread']]
    #         group_labels = ['Candle Spread']
    
    #         # Create distribution plot
    #         fig = ff.create_distplot(hist_data, group_labels, bin_size=2, show_rug=False)
    #         fig.update_traces(marker_color='#4d95ec')
    #         fig.update_traces(line_color='red', selector=dict(type='scatter'))
    
    #         # Calculate statistics
    #         median_val = np.median(df_subset['Spread'])
    #         std_dev = np.std(df_subset['Spread'])
    #         max_relative_density = max(fig['data'][1]['y'])
            
    
    #         # Count occurrences for the specified bins
    #         count_minus_std_dev = df_subset[(df_subset['Spread'] >= median_val - std_dev - 1) & (df_subset['Spread'] <= median_val - std_dev + 1)].shape[0]
    #         count_plus_std_dev = df_subset[(df_subset['Spread'] >= median_val + std_dev - 1) & (df_subset['Spread'] <= median_val + std_dev + 1)].shape[0]
    #         count_median = df_subset[(df_subset['Spread'] >= median_val - 1) & (df_subset['Spread'] <= median_val + 1)].shape[0]
    
    #         # Calculate total number of observations
    #         total_observations = df_subset.shape[0]
            
    
    #         # Calculate probabilities
    #         probability_median = count_median / total_observations
    #         probability_minus_std_dev = (count_minus_std_dev / total_observations) * 100
    #         probability_plus_std_dev = (count_plus_std_dev / total_observations) * 100
    
        
    #         # Add vertical lines for median and standard deviations
    #         shapes = [
    #             dict(type="line", x0=median_val, y0=0, x1=median_val, y1=max_relative_density, line=dict(color="black", width=2, dash="dash")),
    #             dict(type="line", x0=median_val - std_dev, y0=0, x1=median_val - std_dev, y1=max_relative_density, line=dict(color="green", width=2, dash="dash")),
    #             dict(type="line", x0=median_val + std_dev, y0=0, x1=median_val + std_dev, y1=max_relative_density, line=dict(color="green", width=2, dash="dash"))
    #         ]
    
    #         # Add annotations
    #         annotations = [
    #              dict(x=median_val, y=max_relative_density, xref='x', yref='y', text=f'Median', showarrow=False, font=dict(color='black',family='Arial Black')),
    #                 dict(x=median_val - std_dev, y=max_relative_density + 0.005, xref='x', yref='y', text=f'-ve <br> Std Dev1 <br> ({probability_minus_std_dev:.2f} %) ', showarrow=False, font=dict(color='green',family='Arial Black')),
    #                 dict(x=median_val + std_dev, y=max_relative_density + 0.005, xref='x', yref='y', text=f'+ve <br> Std Dev1 <br> ({probability_plus_std_dev:.2f} %)', showarrow=False, font=dict(color='green',family='Arial Black')),
    #                 dict(x=median_val, y=-0.001, xref='x', yref='y', text=f'{median_val:.2f}', showarrow=False, font=dict(color='black',family='Arial Black')),
    #                 dict(x=median_val - std_dev, y=-0.001, xref='x', yref='y', text=f'{median_val - std_dev:.2f}', showarrow=False, font=dict(color='green',family='Arial Black')),
    #                 dict(x=median_val + std_dev, y=-0.001, xref='x', yref='y', text=f'{median_val + std_dev:.2f}', showarrow=False, font=dict(color='green',family='Arial Black'))
    #             ]
            
    #          # Create scatter points for a rug plot-like effect
    #         hist_values, bin_edges = np.histogram(df_subset['Spread'], bins=30)
    #         bin_centers = 0.5 * (bin_edges[1:] + bin_edges[:-1])
    #         max_hist_value = max(hist_values)
    #         min_y_value = min(fig.data[0].y) if fig.data[0].y is not None else 0
    
    #         rug_scatter = go.Scatter(
    #             x=bin_centers,
    #             y=[min_y_value - 0.0025] * len(bin_centers),
    #             mode='markers',
    #             marker=dict(
    #                 symbol='arrow-up',
    #                 size=12,
    #                 color=['rgba(255, 0, 0, {:.3f})'.format(val / max_hist_value) for val in hist_values]
    #             ),
    #             text=[f'Count: {hist_values[i]}' for i in range(len(hist_values))],
    #             hoverinfo='text',
    #             showlegend=False
    #         )

    
    #         fig.add_trace(rug_scatter)
            
    #         # Update layout
    #         fig.update_layout(
    #             title=title,
    #             shapes=shapes,
    #             annotations=annotations,
    #             xaxis_title="Price Variation",
    #             yaxis_title="Density",
    #             template="plotly_white",
    #             autosize=True
    #         )
            
    #         fig.update_layout(
    #             legend=dict(
    #                 orientation="h",  # Horizontal orientation
    #                 yanchor="top",    # Anchor the legend to the top of the designated space
    #                 y=-0.2,           # Move it below the plot
    #                 xanchor="center",  # Center align
    #                 x=0.5             # Position it centrally
    #             )
    #         )

    
    #         return fig
    
    #     # Define data subsets
    #     full_data = data.copy()
    #     one_month_data = data[data['Date'] >= (data['Date'].max() - pd.Timedelta(days=30))]
    #     one_week_data = data[data['Date'] >= (data['Date'].max() - pd.Timedelta(days=7))]
    
    #     # Create plots
    #     full_fig = create_plot(full_data, "TTM Data Distribution")
    #     one_month_fig = create_plot(one_month_data, "Last One Month Distribution")
    #     one_week_fig = create_plot(one_week_data, "Last One Week Distribution")
    
    #     # Combine all traces
    #     combined_fig = go.Figure()
    #     for trace in full_fig.data:
    #         combined_fig.add_trace(trace)
    #     for trace in one_month_fig.data:
    #         combined_fig.add_trace(trace)
    #     for trace in one_week_fig.data:
    #         combined_fig.add_trace(trace)
    
    #     # Set initial visibility
    #     num_full_traces = len(full_fig.data)
    #     num_one_month_traces = len(one_month_fig.data)
    #     num_one_week_traces = len(one_week_fig.data)
    
    #     visibility = [True] * num_full_traces + [False] * (num_one_month_traces + num_one_week_traces)
    #     combined_fig.for_each_trace(lambda trace, i=iter(visibility): trace.update(visible=next(i)))
    
    
    #     combined_fig.update_layout(
    #                             title=dict(
    #                                 text="TTM Data Distribution",  # Keep the title text dynamic if needed
    #                                 x=0.5,  # Center the title horizontally
    #                                 y=combined_fig.layout.title.y  # Keep the existing y position unchanged
    #                             ),
    #                             updatemenus=[
    #                                 dict(
    #                                     buttons=[
    #                                         dict(label="TTM Data",
    #                                              method="update",
    #                                              args=[
    #                                                  {"visible": [True] * num_full_traces + [False] * (num_one_month_traces + num_one_week_traces)},
    #                                                  {"title": dict(text="TTM Data Distribution", x=0.5, y=combined_fig.layout.title.y),  
    #                                                   "shapes": full_fig.layout.shapes, 
    #                                                   "annotations": full_fig.layout.annotations}
    #                                              ]),
    #                                         dict(label="Last One Month",
    #                                              method="update",
    #                                              args=[
    #                                                  {"visible": [False] * num_full_traces + [True] * num_one_month_traces + [False] * num_one_week_traces},
    #                                                  {"title": dict(text="Last One Month Distribution", x=0.5, y=combined_fig.layout.title.y),  
    #                                                   "shapes": one_month_fig.layout.shapes, 
    #                                                   "annotations": one_month_fig.layout.annotations}
    #                                              ]),
    #                                         dict(label="Last One Week",
    #                                              method="update",
    #                                              args=[
    #                                                  {"visible": [False] * (num_full_traces + num_one_month_traces) + [True] * num_one_week_traces},
    #                                                  {"title": dict(text="Last One Week Distribution", x=0.5, y=combined_fig.layout.title.y),  
    #                                                   "shapes": one_week_fig.layout.shapes, 
    #                                                   "annotations": one_week_fig.layout.annotations}
    #                                              ])
    #                                     ],
    #                                     direction="down",
    #                                     showactive=True,
    #                                     x = 1,
    #                                     xanchor='right',
    #                                     y= 1.2,
    #                                     yanchor='top'
    #                                 )
    #                             ]
    #                         )

    #     # Extract KDE values
    #     kde_x = full_fig['data'][1]['x']
    #     kde_y = full_fig['data'][1]['y']
    
    #     # Calculate overall statistics
    #     median_val = np.median(data['Spread'])
    #     std_dev = np.std(data['Spread'])
    
    #     # Comment for voiceover
    #     comment = (f"""The above plot shows the Candle Spread Distribution over the past one year (TTM). The median represents value of price action we saw on most of the days in the past TTM. 
    #                 Additionally, the -ve standard deviation value tells us that on a down moving day after an open the price would close generally near it. Below it, is shown the % probability of this happening based on the TTM data
    #                 and the +ve standard deviation tells us that on a up moving day after an open the price would close generally near it.
    #                 These values suggest a typical range for this stocks closing prices."""
    #                    )
    
    #     full_dict = full_fig.to_dict()
    #     month_dict = one_month_fig.to_dict()
    #     week_dict = one_week_fig.to_dict()
    
        
    #     fig_to_searial = convert_to_serializable(full_dict)
    #     fig_to_month = convert_to_serializable(month_dict)
    #     fig_to_week = convert_to_serializable(week_dict)
    #     # Return data as JSON (convert tuples or arrays to lists)
    #     return {
    #         # "combined_plot_html": combined_fig.to_html(full_html=False, include_plotlyjs='cdn'),
    #         'fig_to_searial': fig_to_searial,
    #         'fig_to_month' : fig_to_month,
    #         "fig_to_week" : fig_to_week,
    #         # "group_labels": group_labels,
    #         "kde_x": list(kde_x),
    #         "kde_y": list(kde_y),
    #         "median": median_val,
    #         "std_dev": std_dev,
    #         "comment": comment
    #     }

    

    @staticmethod
    def candle_spread_distribution(df):

        def convert_to_serializable(obj):
            # Same as above, included here for clarity
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime.datetime, datetime.date)):
                return obj.isoformat()
            elif isinstance(obj, dict):
                return {k: convert_to_serializable(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(o) for o in obj]
            elif isinstance(obj, (np.integer, np.floating)):
                return obj.item()
            elif isinstance(obj, bytes):
                return obj.decode('utf-8')
            elif hasattr(obj, '__dict__'):
                return convert_to_serializable(obj.__dict__)
            return obj
    
        # 1) Validate / normalize input
        if not isinstance(df, (pd.DataFrame, list)):
            raise ValueError("Input must be a pandas DataFrame or a list of records.")
        if isinstance(df, list):
            try:
                df = pd.DataFrame(df)
            except Exception as e:
                raise ValueError(f"Failed to convert input to DataFrame: {e}")
    
        required_columns = ["Date", "Open", "High", "Low", "Close"]
        if not all(col in df.columns for col in required_columns):
            raise ValueError(f"DataFrame missing one of {required_columns}")
    
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date").reset_index(drop=True)
    
        # 2) Build date‐based subsets (TTM, last 6M, last 3M, last 1M, last 1W)
        full_data = df.copy()
        max_date = full_data["Date"].max()
    
        six_month_data = full_data[full_data["Date"] >= (max_date - pd.DateOffset(months=6))]
        three_month_data = full_data[full_data["Date"] >= (max_date - pd.DateOffset(months=3))]
        one_month_data = full_data[full_data["Date"] >= (max_date - pd.DateOffset(months=1))]
        one_week_data = full_data[full_data["Date"] >= (max_date - pd.DateOffset(days=7))]
    
        # 3) Helper: create a single distribution figure for a given subset & mode
        def create_plot(df_subset, title, mode):
            """
            Returns (fig, stats_dict), where:
              - fig is a plotly.graph_objects.Figure with histogram + KDE + rug + vertical lines + annotations,
              - stats_dict = { 'median': float, 'std_dev': float, 'mad': float,
                               'normal_low': float, 'normal_high': float,
                               'std_low': float, 'std_high': float,
                               'prob_minus': float, 'prob_plus': float,
                               'trend': str, 'volatility': str }
            """
            d = df_subset.copy()
            if len(d) < 5:
                raise ValueError(f"Insufficient data points ({len(d)}) for {title} plot")
    
            # 3a) Compute “Spread” in % depending on mode
            if mode == "OC":
                d["Spread"] = ((d["Close"] - d["Open"]) / d["Open"]) * 100
                # ─── NEW: absolute price‐spread
                d["SpreadValue"] = d["Close"] - d["Open"]
            else:  # “HL”
                d["Spread"] = ((d["High"] - d["Low"]) / d["Low"]) * 100
                # ─── NEW: absolute price‐spread
                d["SpreadValue"] = d["High"] - d["Low"]
    
    
            # 3b) Build figure
            #         fig = go.Figure()
    
    
            fig = make_subplots(
                rows=1, cols=2,
                column_widths=[0.75, 0.25],
                specs=[[{"type": "xy"}, {"type": "box"}]],
                horizontal_spacing=0.02
            )
        
            # ---- 1) pick your bin width ----
            bin_size = 1.5
            total_obs = len(d)
            # print(total_obs)
    
            # ---- 2) histogram in raw counts ----
            hist = go.Histogram(
                x=d["Spread"],
                name="Candle Spread",
                marker=dict(color="rgba(255,210,0,0.9)"),
                opacity=0.7,
                xbins=dict(size=bin_size),
                # histnorm omitted → defaults to counts
            )
            fig.add_trace(hist, row=1, col=1)
    
            # ---- 3) KDE density + scale to counts ----
            kde = gaussian_kde(d["Spread"])
            x_range = np.linspace(d["Spread"].min(), d["Spread"].max(), 200)
            density = kde(x_range)
            kde_counts = density * total_obs * bin_size
    
            fig.add_trace(
                go.Scatter(
                    x=x_range,
                    y=kde_counts,
                    mode="lines",
                    name="KDE (counts)",
                    line=dict(width=2, color="red", shape="spline"),
                ),
                row=1, col=1
            )
    
            # ─── Now add the vertical box‐plot in col=2 ───
            fig.add_trace(
                go.Box(
                    y=d["SpreadValue"],
                    name="Spread (₹)",
                    boxpoints=False,
                    marker=dict(color="#43d6f0"),
                    line=dict(width=2),
                    hoverinfo="y"
                ),
                row=1, col=2
            )
    
    
            # 3c) Compute statistics
            median_val = d["Spread"].median()
            std_dev = d["Spread"].std()
            mad = d["Spread"].sub(median_val).abs().median()
            normal_low = median_val - (1.4826 * mad)
            normal_high = median_val + (1.4826 * mad)
            std_low = median_val - std_dev
            std_high = median_val + std_dev
            
            
            # non percent, actual values
            median_val_v = d["SpreadValue"].median()
            mad_v        = (d["SpreadValue"] - median_val_v).abs().median()
            normal_low_v = median_val_v - 1.4826 * mad_v
            normal_high_v= median_val_v + 1.4826 * mad_v
    
    
            # Trend / volatility labels
            if median_val < 0:
                trend = "📉 Negative Trend"
            elif median_val > 0:
                trend = "📈 Positive Trend"
            else:
                trend = "➖ Neutral Trend"
    
            if mad < 1:
                volatility = "🟢 Stable Volatility"
            elif mad < 3:
                volatility = "🟡 Moderate Volatility"
            else:
                volatility = "🔴 High Volatility"
    
            max_relative_density = max(kde_counts)
    
            # Counts for ±1σ and median
            total_obs = d.shape[0]
            count_minus = d[
                (d["Spread"] >= std_low - 1) & (d["Spread"] <= std_low + 1)
            ].shape[0]
            count_plus = d[
                (d["Spread"] >= std_high - 1) & (d["Spread"] <= std_high + 1)
            ].shape[0]
            count_median = d[
                (d["Spread"] >= median_val - 1) & (d["Spread"] <= median_val + 1)
            ].shape[0]
            prob_minus = (count_minus / total_obs) * 100
            prob_plus = (count_plus / total_obs) * 100
    

    
    
            fig.add_shape(
                type="line",
                x0=median_val, y0=0,
                x1=median_val, y1=max_relative_density,
                line=dict(color="black", width=2, dash="dash"),
                row=1, col=1
            )
            fig.add_shape(
                type="line",
                x0=normal_low, y0=0,
                x1=normal_low, y1=max_relative_density,
                line=dict(color="green", width=2, dash="dash"),
                row=1, col=1
            )
            fig.add_shape(
                type="line",
                x0=normal_high, y0=0,
                x1=normal_high, y1=max_relative_density,
                line=dict(color="green", width=2, dash="dash"),
                row=1, col=1
            )
            
            
        
    
            # 3e) Annotations
            fig.add_annotation(
                x=median_val,
                y=max_relative_density * 1.02,
                xref="x", yref="y",
                text="Median",
                showarrow=False,
                font=dict(color="black", family="Arial Black"),
                row=1, col=1
            )
    
            # 2) Median numeric value
            fig.add_annotation(
                x=median_val,
                y=-0.5,
                xref="x", yref="y",
                text=f"{median_val:.2f} %",
                showarrow=False,
                font=dict(color="black", family="Arial Black"),
                row=1, col=1
            )
    
            # 3) “MAD Low” label
            fig.add_annotation(
                x=normal_low,
                y=max_relative_density * 1.05,
                xref="x", yref="y",
                text="Low",
                showarrow=False,
                font=dict(color="green", family="Arial Black"),
                row=1, col=1
            )
    
            # 4) “MAD High” label
            fig.add_annotation(
                x=normal_high,
                y=max_relative_density * 1.05,
                xref="x", yref="y",
                text="High",
                showarrow=False,
                font=dict(color="green", family="Arial Black"),
                row=1, col=1
            )
    
            # 5) MAD low numeric
            fig.add_annotation(
                x=normal_low,
                y=-0.5,
                xref="x", yref="y",
                text=f"{normal_low:.2f} %",
                showarrow=False,
                font=dict(color="green", family="Arial Black"),
                row=1, col=1
            )
    
            # 6) MAD high numeric
            fig.add_annotation(
                x=normal_high,
                y=-0.5,
                xref="x", yref="y",
                text=f"{normal_high:.2f} %",
                showarrow=False,
                font=dict(color="green", family="Arial Black"),
                row=1, col=1
            )
            
            
            fig.add_annotation(                
                dict(
                        xref="paper",
                        yref="paper",
                        x=15,
                        y=20,
                        text=(
                            f"<b>{trend}</b><br>"
                            f"<b>{volatility}</b><br>"
                            f"<b>Median:</b> {median_val:.2f}% (₹ {median_val_v:.2f}) ({count_median} times)<br>"
                            f"<b>Normal Range:</b> [{normal_low:.2f}% (₹{normal_low_v:.2f}),<br> {normal_high:.2f}% (₹{normal_high_v:.2f})]<br>" #MAD Range
                        ),
                        showarrow=False,
                        align="center",
                        bgcolor="rgba(255,255,255,0.9)",
                        font=dict(color="black", family="Arial", size=12),
                    ),row=1, col=1)
                
                
                
            # shaded band in value units
            fig.add_shape(
                dict(
                    type="rect",
                    xref="x2", yref="y2",
                    x0=0, x1=1,
                    y0=normal_low_v, y1=normal_high_v,
                    fillcolor="rgba(0,255,0,0.2)", line=dict(width=0),
                ),
                row=1, col=2
            )
    
            

    
            # your existing bin_size
            half = bin_size / 2
    
            # percent‐MAD markers:
            low_pct  = normal_low    # e.g. −0.75 (%)
            high_pct = normal_high   # e.g. +0.80 (%)
    
            count_low_v = d[
                (d["Spread"] >=  low_pct - half) &
                (d["Spread"] <   low_pct + half)
            ].shape[0]
    
            count_high_v = d[
                (d["Spread"] >=  high_pct - half) &
                (d["Spread"] <   high_pct + half)
            ].shape[0]
    
    
    
    
    
            # value annotations
            # value annotations
            fig.add_annotation(
                dict(
                    xref="paper", yref="y2", x=0.99, y=normal_low_v,
                    text=f" Common Lower Zone: <br> ₹{normal_low_v:.2f} ({count_low_v} times)",
                    showarrow=False, font=dict(size=12, color="darkgreen"),
                    align="right"
                )
            )
            fig.add_annotation(
                dict(
                    xref="paper", yref="y2", x=0.99, y=normal_high_v,
                    text=f"Common Upper Zone: <br> ₹{normal_high_v:.2f} ({count_high_v} times)",
                    showarrow=False, font=dict(size=12, color="darkgreen"),
                    align="right"
                )
            )
    
            
            
    
            # 3f) “Rug”-like scatter at bottom
            hist_values, bin_edges = np.histogram(d["Spread"], bins=30)
            bin_centers = 0.5 * (bin_edges[1:] + bin_edges[:-1])
            max_hist_value = max(hist_values)
            min_y_value = 0  # because histnorm="probability density"
            rug_scatter = go.Scatter(
                x=bin_centers,
                y=[min_y_value - 1] * len(bin_centers),
                mode="markers",
                marker=dict(
                    symbol="arrow-up",
                    size=12,
                    color=[f"rgba(255, 0, 0, {val / max_hist_value:.2f})" for val in hist_values],
                ),
                text=[f"Count: {hist_values[i]}" for i in range(len(hist_values))],
                hoverinfo="text",
                showlegend=False,
            )
            fig.add_trace(rug_scatter)
    
            # 3g) Finalize layout
            fig.update_layout(
                title=title,
                font=dict(family="Arial", size=12, color="black"),
                xaxis=dict(
                    title=dict(text="<b>Price Variation(%)</b>", font=dict(size=14, color="#586161")),
                    gridcolor="rgba(220, 220, 220, 0.5)",
                    linecolor="#bdc3c7",
                    tickfont=dict(color="#586161"),
                ),
                yaxis=dict(
                    title=dict(text="<b>Density (Days)</b>", font=dict(size=14, color="#586161")),
                    gridcolor="rgba(220, 220, 220, 0.3)",
                    linecolor="#bdc3c7",
                    tickformat=".2f",
                    zeroline=False,
                ),
            #             shapes=shapes,
            #             annotations=annotations,
                showlegend=False,
                margin=dict(t=60, b=10),
                template="plotly_white",
                
                xaxis2=dict(visible=False),
                yaxis2=dict(title="Price Spread (₹)",side="right"),
                
                
            )
    
            stats = {
                "median": median_val,
                "std_dev": std_dev,
                "mad": mad,
                "normal_low": normal_low,
                "normal_high": normal_high,
                "std_low": std_low,
                "std_high": std_high,
                "prob_minus": prob_minus,
                "prob_plus": prob_plus,
                "trend": trend,
                "volatility": volatility,
                "kde_x": x_range,
            #             "kde_y": kde_y,
            }
    
            return fig, stats
    
        # 4) Generate all ten figures + stats
        #    (OC‐TTM, OC‐6M, OC‐3M, OC‐1M, OC‐1W; HL‐TTM, HL‐6M, HL‐3M, HL‐1M, HL‐1W)
        results = {}
    
        # -- OC figures
        full_fig_OC, full_stats_OC       = create_plot(full_data,      "TTM OC Distribution",       mode="OC")
        sixM_fig_OC, sixM_stats_OC       = create_plot(six_month_data, "Last 6 Months OC",          mode="OC")
        threeM_fig_OC, threeM_stats_OC   = create_plot(three_month_data,"Last 3 Months OC",          mode="OC")
        oneM_fig_OC, oneM_stats_OC       = create_plot(one_month_data,  "Last 1 Month OC",           mode="OC")
        oneW_fig_OC, oneW_stats_OC       = create_plot(one_week_data,   "Last 1 Week OC",            mode="OC")
    
        # -- HL figures
        full_fig_HL, full_stats_HL       = create_plot(full_data,      "TTM HL Distribution",       mode="HL")
        sixM_fig_HL, sixM_stats_HL       = create_plot(six_month_data, "Last 6 Months HL",          mode="HL")
        threeM_fig_HL, threeM_stats_HL   = create_plot(three_month_data,"Last 3 Months HL",          mode="HL")
        oneM_fig_HL, oneM_stats_HL       = create_plot(one_month_data,  "Last 1 Month HL",           mode="HL")
        oneW_fig_HL, oneW_stats_HL       = create_plot(one_week_data,   "Last 1 Week HL",            mode="HL")
    
        # 5) Generate comment‐HTML for every combination
        def generate_comment(stats, period, mode):
            mode_desc = "Open-Close" if mode == "OC" else "High-Low"
            return (
                f"<p style=\"color: white;\">"
                f"The above plot shows the Candle Spread Distribution ({mode_desc}) for the {period}. "
                f"The median ({stats['median']:.2f}%) represents the typical price action observed during this period.<br>"
                f"The negative standard deviation range ({stats['std_low']:.2f}%) suggests that on a down-moving day, "
                f"the price would generally settle near this value, with a {stats['prob_minus']:.2f}% probability based on the data.<br>"
                f"The positive standard deviation range ({stats['std_high']:.2f}%) indicates that on an up-moving day, "
                f"the price would generally settle near this value, with a {stats['prob_plus']:.2f}% probability.<br>"
                f"These values suggest a typical range for this stock's price variation."
                f"</p>"
            )
    
        # Fill in keys for OC
        results["fig_OC_full"]   = convert_to_serializable(full_fig_OC.to_dict())
        results["fig_OC_6M"]     = convert_to_serializable(sixM_fig_OC.to_dict())
        results["fig_OC_3M"]     = convert_to_serializable(threeM_fig_OC.to_dict())
        results["fig_OC_1M"]     = convert_to_serializable(oneM_fig_OC.to_dict())
        results["fig_OC_1W"]     = convert_to_serializable(oneW_fig_OC.to_dict())
    
        results["median_OC_full"]  = full_stats_OC["median"]
        results["std_dev_OC_full"] = full_stats_OC["std_dev"]
        results["median_OC_6M"]    = sixM_stats_OC["median"]
        results["std_dev_OC_6M"]   = sixM_stats_OC["std_dev"]
        results["median_OC_3M"]    = threeM_stats_OC["median"]
        results["std_dev_OC_3M"]   = threeM_stats_OC["std_dev"]
        results["median_OC_1M"]    = oneM_stats_OC["median"]
        results["std_dev_OC_1M"]   = oneM_stats_OC["std_dev"]
        results["median_OC_1W"]    = oneW_stats_OC["median"]
        results["std_dev_OC_1W"]   = oneW_stats_OC["std_dev"]
    
        results["comment_OC_full"] = generate_comment(full_stats_OC,  "past one year (TTM)", "OC")
        results["comment_OC_6M"]   = generate_comment(sixM_stats_OC,  "last 6 months",      "OC")
        results["comment_OC_3M"]   = generate_comment(threeM_stats_OC,"last 3 months",      "OC")
        results["comment_OC_1M"]   = generate_comment(oneM_stats_OC,  "last 1 month",       "OC")
        results["comment_OC_1W"]   = generate_comment(oneW_stats_OC,  "last 1 week",        "OC")
    
        # Fill in keys for HL
        results["fig_HL_full"]   = convert_to_serializable(full_fig_HL.to_dict())
        results["fig_HL_6M"]     = convert_to_serializable(sixM_fig_HL.to_dict())
        results["fig_HL_3M"]     = convert_to_serializable(threeM_fig_HL.to_dict())
        results["fig_HL_1M"]     = convert_to_serializable(oneM_fig_HL.to_dict())
        results["fig_HL_1W"]     = convert_to_serializable(oneW_fig_HL.to_dict())
    
        results["median_HL_full"]  = full_stats_HL["median"]
        results["std_dev_HL_full"] = full_stats_HL["std_dev"]
        results["median_HL_6M"]    = sixM_stats_HL["median"]
        results["std_dev_HL_6M"]   = sixM_stats_HL["std_dev"]
        results["median_HL_3M"]    = threeM_stats_HL["median"]
        results["std_dev_HL_3M"]   = threeM_stats_HL["std_dev"]
        results["median_HL_1M"]    = oneM_stats_HL["median"]
        results["std_dev_HL_1M"]   = oneM_stats_HL["std_dev"]
        results["median_HL_1W"]    = oneW_stats_HL["median"]
        results["std_dev_HL_1W"]   = oneW_stats_HL["std_dev"]
    
        results["comment_HL_full"] = generate_comment(full_stats_HL,  "past one year (TTM)", "HL")
        results["comment_HL_6M"]   = generate_comment(sixM_stats_HL,  "last 6 months",      "HL")
        results["comment_HL_3M"]   = generate_comment(threeM_stats_HL,"last 3 months",      "HL")
        results["comment_HL_1M"]   = generate_comment(oneM_stats_HL,  "last 1 month",       "HL")
        results["comment_HL_1W"]   = generate_comment(oneW_stats_HL,  "last 1 week",        "HL")
    
        # 6) We also return a shared KDE array (from OC‐full); frontend can ignore if they want
        results["kde_x"] = full_stats_OC["kde_x"].tolist()
        #     results["kde_y"] = full_stats_OC["kde_y"].tolist()
    
        # 7) (Optionally) if you want a single “config” object for all Plotly figures:
        results["config"] = {
            "displayModeBar": False,
            "displaylogo": False,
            "modeBarButtons": [["toImage"]],
        }
    
        return results



    @staticmethod   
    def last_traded_price_box_plot(stock_json):
            
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
        
        df_copy = pd.DataFrame(stock_json)

        df = df_copy.copy()
    
        if 'LastPrice' not in df.columns:
            raise ValueError("The input JSON must contain a 'LastPrice' column.")
    
        data = calculate_swing_pivot_points(df)
    
        data['Period'] = '1 Year'
        last_record = data.iloc[[-1]]
        #last_record['Period'] = 'Previous Day'
        # combined_df = pd.concat([data, last_record])
        combined_df = data
    
        color_map = {'1 Year': '#4d95ec', 'Previous Day': 'red'}
        fig = px.strip(
            data,
            y="LastPrice",
            color="Period",
            stripmode="overlay",
            color_discrete_map=color_map
        )
    
        # Update strip plot
        fig.update_traces(marker=dict(size=7), selector=dict(name='1W'))  # Adjust marker size for past period
        fig.update_traces(marker=dict(color=color_map['1 Year'], opacity=0.7), selector=dict(name='1 Year'))  # Reduce opacity for the 1 Year data pts to highlight selected period
        fig.update_traces()  # Remove legend from strip plot
    
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
            # width = 1000,
            autosize=True,
            height=500,
            template= 'plotly_white',
            font=dict(family='Arial', size=12, color='black'),
            # showlegend=True
        )
        
        fig.update_layout(
            legend=dict(
                orientation="h",  # Horizontal orientation
                yanchor="top",    # Anchor the legend to the top of the designated space
                y=-0.2,           # Move it below the plot
                xanchor="center",  # Center align
                x=0.5   ,          # Position it centrally
                traceorder="normal"

            )
        )
        
        
        # Calculate key statistics for dynamic comment
        period = 'Previous day'
        median_1Y = df['LastPrice'].median()
        q1_1Y = df['LastPrice'].quantile(0.25)
        q3_1Y = df['LastPrice'].quantile(0.75)
        min_1Y = df['LastPrice'].min()
        max_1Y = df['LastPrice'].max()

        median_period = last_record['LastPrice'].median()
        q1_period = last_record['LastPrice'].quantile(0.25)
        q3_period = last_record['LastPrice'].quantile(0.75)
        min_period = last_record['LastPrice'].min()
        max_period = last_record['LastPrice'].max()

        resistance_1 = df['Resistance_1'].iloc[-1] 
        support_1 = df['Support_1'].iloc[-1]


    
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
        
        comment = (f"""This box plot shows the distribution of last traded prices over the past year (TTM) and {period}. 
                    For the 1-year period, the median traded price is {median_1Y:.2f}, with an interquartile range (IQR) from {q1_1Y:.2f} (q1) to {q3_1Y:.2f} (q3).
                    Most transactions (about 50% of data points) fall within this range, showing where typical trading prices cluster. 
                    The minimum and maximum traded prices were {min_1Y:.2f} and {max_1Y:.2f}, respectively.  
                    In contrast, during the {period}, the median traded price was {median_period:.2f}, with an IQR from {q1_period:.2f} to {q3_period:.2f}.
                    The minimum and maximum prices in this period were {min_period:.2f} and {max_period:.2f}. 
                    By comparing both periods, you can observe that the {period} prices were
                    {'higher' if median_period > median_1Y else 'lower'} than the yearly average. 
                    The chart also highlights the Pivot Point,
                    which is a significant price level used by traders to gauge market direction. 
                    Additionally, the Resistance (R1) level at {resistance_1:.2f} indicates a price level where selling 
                    pressure could emerge, and the Support (S1) level at {support_1:.2f} represents a price level where 
                    buying interest might be strong enough to prevent the price from falling further.""")
        
        return {
            "scatter_data": fig_dict_serializable['data'],
            "layout": fig_dict_serializable['layout'],
            "comment":comment
        }



# Worm Plot Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends

    
    @staticmethod
    def create_worm_plot(stock_json):
        
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
    
        # df_copy = df.copy()
        df_copy = pd.DataFrame(stock_json)
        
        data = df_copy.copy()
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
        for i in range(1, len(data)):
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
        # Calculate weekly delivery percentage
        df_copy['Week'] = df_copy['Date'].dt.to_period('W')
        weekly_data = df_copy.groupby('Week').agg(
            Open=('Open', 'first'),      # Use the first value of the week for 'Open'
            High=('High', 'max'),        # Use the max value of the week for 'High'
            Low=('Low', 'min'),          # Use the min value of the week for 'Low'
            Close=('Close', 'last'),     # Use the last value of the week for 'Close'
            Total_Traded_Qty=('TotalTradedQty', 'sum'),
            Deliverable_Qty=('DeliverableQty', 'sum')
        ).reset_index()
    
    
    
        # Calculate the delivery percentage
        weekly_data['Delivery_Percentage'] = (weekly_data['Deliverable_Qty'] / weekly_data['Total_Traded_Qty']) * 100
    
        # Convert 'Week' to datetime for plotting
        weekly_data['Week'] = weekly_data['Week'].dt.to_timestamp()
        
        # Create a color list for the bars based on the condition (green for rise, red for fall)
        bar_colors = ['green' if close > open else 'red' for close, open in zip(weekly_data['Close'], weekly_data['Open'])]
    
        # Add the delivery percentage bar plot
        fig.add_trace(go.Bar(
            x=weekly_data['Week'],
            name="",
            y=weekly_data['Delivery_Percentage'],
            marker_color=bar_colors,
            hovertemplate='%{x|%b %d, %Y}<br>%{y:.2f}%',  # Only display Date and Percentage with 2 decimals
            showlegend=False
        ), row=2, col=1)
    
        # Configure layout
        fig.update_layout(
            yaxis_title='Price',
            xaxis_rangeslider_visible=False,
            height=550,
            autosize=True,
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
    
        fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5          # Position it centrally
                )
            )

        comment = """
            In the above plot the ribbon on the candlestick chart to shows the stock's trend and volatility. Green sections of the ribbon indicate an uptrend, where prices are moving higher. Red sections of the ribbon indicate a downtrend, where prices are moving lower.
            The thickness of the ribbon reflects the volatility during that period. Wider ribbons represent periods of higher volatility, where prices fluctuate more dramatically. Thinner ribbons suggest more stable periods with less price movement.
            The green bars at the bottom show the Weekly Trade Delivery percentage, which measures how much of the total traded quantity was actually delivered during the week.
        """
    
        # Serialize the figure and return as JSON
        fig_dict = fig.to_dict()
    
        fig_dict_serializable = convert_ndarray(fig_dict)
    
        return {
            "scatter_data": fig_dict_serializable['data'],
            "layout": fig_dict_serializable['layout'],
            "comment": comment
        }
    
    
# AVG box plot  
   
    
    @staticmethod
    def create_avg_box_plot(stock_json):
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

        # df_copy = df.copy()
        data = pd.DataFrame(stock_json)
        
        # data = df_copy.copy()
    
        # Ensure 'Date' and 'Close' columns exist
        if 'Date' not in data.columns or 'Close' not in data.columns:
            raise ValueError("The input JSON must contain 'Date' and 'Close' columns.")
    
        df_copy = data.copy()
    
        # Ensure 'Date' is in datetime format
        df_copy['Date'] = pd.to_datetime(df_copy['Date'])
    
        # Create a 'Month' column based on the 'Date' to group by month
        # df_copy['Month'] = df_copy['Date'].dt.to_period('M')
        df_copy['Month'] = df_copy['Date'].dt.to_period('M').astype(str)  # Convert Period to string immediately

    
        # Aggregate data for each month
        monthly_data = df_copy.groupby('Month').agg({
            'High': 'max',
            'Low': 'min',
            'Close': 'mean',  # Calculate average closing price
        }).reset_index()
        monthly_data['Month'] = monthly_data['Month'].astype(str)

    
        # Prepare data for box plot
        box_data = df_copy.groupby('Month')['Close'].apply(list).reset_index()
        box_data['Month'] = box_data['Month'].astype(str)

    
        # Create the plot
        fig = go.Figure()
    
        # Add box plot for the monthly closing prices
        for index, row in box_data.iterrows():
            fig.add_trace(go.Box(
                y=row['Close'],
                # name=row['Month'].strftime('%Y-%m'),  # Convert Period to string
                name=row['Month'],  # Convert Period to string
                marker_color='#4d95ec',
                showlegend=False
            ))
    
        # Add scatter plot for average closing price
        fig.add_trace(go.Scatter(
            # x=monthly_data['Month'].dt.to_timestamp(),  # Convert Period to Timestamp
            x=monthly_data['Month'],  # Convert Period to Timestamp
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
            xaxis_title={'text':'Month', 'font':{'size':14}},
                yaxis_title={'text':'Price', 'font':{'size':14}},
                template='plotly_white',
                font=dict(size=12, color='black'),
                height=700,
                # width=7500,
                autosize=True,
                xaxis = dict(tickfont=dict(size=10),dtick='M1',tickangle=35),
                yaxis = dict(tickfont=dict(size=10))
        )
        
        fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5             # Position it centrally
                )
            )

    
        # Dynamic comment based on statistical analysis
        overall_mean = df_copy['Close'].mean()
        overall_std_dev = df_copy['Close'].std()
        # latest_month = monthly_data.iloc[-1]['Month'].strftime('%Y-%m')  # Convert Period to string
        latest_month = monthly_data.iloc[-1]['Month'] # Convert Period to string
        latest_avg_price = monthly_data.iloc[-1]['Close']
    
        comment = (
            f"The monthly price ranges are shown for the trailing twelve months. "
            f"The overall average closing price is {overall_mean:.2f} with a standard deviation of {overall_std_dev:.2f}. "
            f"For the most recent month ({latest_month}), the average closing price is {latest_avg_price:.2f}."
        )
        
        
        # # Modify your convert_serializable function
        # def convert_serializable(obj):
        #     if isinstance(obj, np.ndarray):
        #         return obj.tolist()
        #     elif isinstance(obj, pd.Timestamp):
        #         return obj.strftime('%Y-%m-%d')  # Convert timestamp to string
        #     elif isinstance(obj, pd.Period):
        #         return obj.strftime('%Y-%m')  # Convert period to string
        #     elif isinstance(obj, datetime.datetime):  # Handle standard datetime objects
        #         return obj.strftime('%Y-%m-%d %H:%M:%S')
        #     elif isinstance(obj, datetime.date):  # Handle date objects separately
        #         return obj.strftime('%Y-%m-%d')
        #     elif isinstance(obj, dict):  # Recursively process dictionaries
        #         return {key: convert_serializable(value) for key, value in obj.items()}
        #     elif isinstance(obj, list):  # Recursively process lists
        #         return [convert_serializable(item) for item in obj]
        #     else:
        #         return obj  # Return the object if it doesn’t match known types

    
        # # Convert the figure to a JSON-compatible format
        # fig_dict = fig.to_dict()
        #
        # # Apply serialization conversion before dumping JSON
        # results_serializable = convert_serializable(fig_dict)
        # print(json.dumps(results_serializable))  # This should now work without errors
        # # Recursively convert non-serializable objects to JSON-compatible types
        # fig_dict_serializable = convert_serializable(fig_dict)
        
        # Convert figure dictionary to serializable format
        fig_dict = fig.to_dict()
        
        fig_dict_serializable = convert_to_serializable(fig_dict)

        # Convert results to JSON-compatible format
        json_output = json.dumps(fig_dict_serializable)
        
    

        
        
    
        # Return JSON response
        return {
            "box_plot_data": fig_dict_serializable['data'],
            "layout": fig_dict_serializable['layout'],
            "overall_mean": overall_mean,
            "overall_std_dev": overall_std_dev,
            "latest_month_avg_price": latest_avg_price,
            "comment": comment
        }
       
         

    def create_macd_plot(stock_json):
        
        df_copy = pd.DataFrame(stock_json)
        df = df_copy.copy()
        
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
            # fillcolor='rgba(50, 205, 50, 0.7)',
            fillcolor='rgba(77, 149, 236, 1)',
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
            # width=1500
            autosize=True
        )
        
        fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5             # Position it centrally
                )
            )

    
        # Generate comments based on the data
        overall_mean_macd = df['MACD'].mean()
        overall_mean_signal = df['Signal_Line'].mean()
        latest_date = df.iloc[-1]['Date'].strftime('%Y-%m-%d')
        latest_macd = df.iloc[-1]['MACD']
        latest_signal = df.iloc[-1]['Signal_Line']
    
        comment = f"""
        
                    This chart helps us understand potential price trends by using a tool called the MACD 
                    (Moving Average Convergence Divergence)</strong> along with a Signal Line. Let’s go through each element:
                    

                    1. MACD Line (Orange): This line captures the momentum (strength and direction) of price movements. 
                    When it rises above the Signal Line, it often suggests the price might start increasing, and when it falls below, 
                    it might indicate a price decline.
                    

                    2. Signal Line (Blue): This is a smoothed version of the MACD line, helping confirm the MACD’s signals.
                    

                    3. Divergence (Green Area):The green shaded area between the MACD and Signal Line shows the "divergence" –
                    the difference between these two lines. A wider divergence suggests a stronger momentum, which might lead to significant price changes. 
                    For instance, when the MACD and Signal Line move far apart, it can indicate an upcoming rise or fall in price.
                    

                    Continuous_Trend_Mean_Divergence: This value represents the average divergence between the MACD and Signal Line during periods where 
                    the price trend continues in the same direction, indicating stability in the current trend.
                    

                    Reversal_Mean_Divergence: This value represents the average divergence observed before a trend reversal, 
                    suggesting that when the divergence falls to this level, a potential change in direction may be near.
                    

                    Crossover Points (Markers): These are points where the MACD and Signal Line cross each other. 
                    They’re important because they help us identify when the stock might change direction.
                  

                    1. Green Markers (Bullish Crossover): A green marker appears when the MACD line crosses above the Signal Line. 
                    This is called a "bullish crossover" and often suggests the price might rise.
                    

                    2. Red Markers (Bearish Crossover): A red marker appears when the MACD line crosses below the Signal Line. 
                    This is called a "bearish crossover" and often suggests the price might fall."""
    
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
        
        

    def sensex_vs_stock_corr_bar(stock_json, stock_symbol):
        
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
    
        data = pd.DataFrame(stock_json)
            
        df_copy = data.copy()
        
        df1 = pd.read_csv('src/main/resources/data/sensex_data/nifty_50.csv')
        # df1 = pd.read_csv('data/sensex_data/nifty_50.csv')
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
                line=dict(color='#f2a51e', width=3.5,shape='spline'),
                marker=dict(size=5),
                hovertemplate=(
                f"{stock_symbol}"+ "<br>"
                "Month: %{x}" + "<br>"
                'Percent Change: ' + monthly_stock['StockPercentChange'].round(2).astype(str) + "%"),
                showlegend=False  # Hide from legend
    
                
            ))
    
    
        fig.update_layout(
            title={'text':f'Monthly Percentage Change for Sensex (Nifty 50) and {stock_symbol} For TTM', 'font':{'size':15}},
            # title=f'Monthly Percentage Change for Sensex (Nifty 50) and {stock_symbol} For TTM',
            xaxis_title='Month',
            yaxis_title='Percent Change (%)',
            barmode='overlay',
            template='plotly_white',
            autosize=True
        )
        
        fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5             # Position it centrally
                )
            )

    
        comment = (f"This chart shows the monthly percent change in the Sensex (Nifty 50) and {stock_symbol} over the past year."
            "The green bars represent the Sensex's percentage change compared to the previous month. If the bar goes "
            "up, the Sensex increased in value; if it goes down, the Sensex decreased."
            f"The blue bars show the same for {stock_symbol}, representing how much its price changed compared to the previous month."
            f"You can think of it as a quick snapshot of how both the overall market (Sensex) and {stock_symbol} have performed month by month."
            "The red line tracks the stock's monthly performance over time, showing if it has been going up or down. "
            "The orange line does the same for the Sensex."
            f"By looking at the lines and bars together, you can get a clear sense of whether {stock_symbol} is following "
            "the overall market trend or moving differently.")
    
        fig_dict = fig.to_dict()
        fig_dict_serializable = convert_ndarray(fig_dict)
    
        return {
            "scatter_data": fig_dict_serializable['data'],
            "layout": fig_dict_serializable['layout'],
            "comment": comment
        }
        
        
   

    def sensex_vs_stock_corr(stock_json, stock_symbol):
        
        df_copy = pd.DataFrame(stock_json)
        
        stock_df = df_copy.copy()
        
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

        
        #stock_df = pd.read_json(json_path, lines=True)
        nifty_df = pd.read_csv('src/main/resources/data/sensex_data/nifty_50.csv')
        # nifty_df = pd.read_csv('data/sensex_data/nifty_50.csv')
        
    
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
            marker_color='#4d95ec'
        ), row=1, col=2)
    
        # Update layout
        fig.update_layout(
            title=f"{stock_symbol} vs Sensex Analysis",
            xaxis_title="Date",
            yaxis_title="Standardized Prices",
            template="plotly_white",
            autosize=True
            
        )
        
        fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5             # Position it centrally
                )
            )

    
        # Generate JSON-compatible response
        # Dynamic comment based on overall correlation
        comment = f"""This plot helps us understand the movements of the Sensex and the {stock_symbol} prices over time.
        The green line represents the {stock_symbol} price movement , while the orange line represents the Sensex movement.
        The box plot in the right panel shows the dispersion between the stock prices and the sensex.
        In short, this plot helps us visualize how connected the stock is to the Sensex and shows how much it might behave differently at times."""

        fig_dict = fig.to_dict()
        fig_dict_serializable = convert_serializable(fig_dict)
    
        return {
            "scatter_data": fig_dict_serializable['data'],
            "layout": fig_dict_serializable['layout'],
            "comment": comment
        }
        
    
    def corr_heatmap(stock_json, stock_symbol):
        
        df_copy = pd.DataFrame(stock_json)
        
        df = df_copy.copy()
    
        
        # Load additional data
        df1 = pd.read_csv('src/main/resources/data/sensex_data/nifty_50.csv')
        df2 = pd.read_csv('src/main/resources/data/sensex_data/bse_sensex.csv')
        

        # df1 = pd.read_csv('data/sensex_data/nifty_50.csv')
        # df2 = pd.read_csv('data/sensex_data/bse_sensex.csv')
        


        # Function to calculate percentage changes
        def calculate_changes(df, column="Close"):
            df = df.copy()
            df["Daily"] = df[column].pct_change() * 100
            df["Weekly"] = df[column].pct_change(5) * 100
            df["Monthly"] = df[column].pct_change(20) * 100
            df["YTD"] = (df[column] / df[column].iloc[0] - 1) * 100
            return df[["Daily", "Weekly", "Monthly", "YTD"]].iloc[-1]
    
        # Calculate changes for each dataset
        stock_changes = calculate_changes(df)
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
            annotated = df.astype(str)  # Ensure all columns are string type
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
            coloraxis_showscale=False,
            autosize=True
            
        )
        
        fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5             # Position it centrally
                )
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
        
        
        
    def delivery_rate_gauge(stock_json):
        
        period='Previous Day'
        
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
    
        df_copy = pd.DataFrame(stock_json)
        
        data = df_copy.copy()
    
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
        
        # Title 
        fig.update_layout(title_text=f"Delivery Rate Comparison", title_y=0.75, title_x=0.5)
        fig.add_annotation(text=f"Avg Delivery Rate Over the Year: {avg_delivery_rate_1Y:.2f}%", 
                            x=0.5, y=1.3, showarrow=False,
                            font=dict(color="black", size=18),)
    
    
        fig.add_annotation(x=0.5, y=0.15, text=f"{avg_delivery_rate_Xperiod:.2f}%", showarrow=False, font=dict(size=18), align='center')
        fig.add_annotation(x=0.5, y=0.4, text=f"Rate as of {latest_date}", showarrow=False, font=dict(size=18), align='center')
    
        # Dynamic insight text
        insight_comparison = 'lower than' if avg_delivery_rate_Xperiod < avg_delivery_rate_1Y else 'higher than'
        insight_strength = 'indicates increased market interest in the stock recently.' if avg_delivery_rate_Xperiod > avg_delivery_rate_1Y else 'suggests that there is reduced buying activity in the market.'
        past_period_text = '' if period == 'Previous Day' else 'Past'

        # Define sentiment based on the comparison of delivery rates
        if avg_delivery_rate_Xperiod > avg_delivery_rate_1Y:
            sentiment = "Bullish Sentiment, i.e Investors expect the stock price to rise, leading to increased buying activity. "
        elif avg_delivery_rate_Xperiod < avg_delivery_rate_1Y:
            sentiment = "Bearish Sentiment, i.e Investors expect the stock price to fall, leading to increased selling activity. "
        else:
            sentiment = "Neutral Sentiment, i.e: Investors are uncertain or expect minimal movement in the stock price. "


        # Dynamic delivery behavior text
        delivery_behavior = (
            " the investors are likely holding onto shares for a longer period with fewer shares being delivered." 
            if avg_delivery_rate_Xperiod < avg_delivery_rate_1Y 
            else "the investors are likely trading shares more frequently, with a higher proportion of shares being delivered, suggesting increased market activity."
        )

        comment = (f"""Delivery rate is a key indicator of market sentiment, and its fluctuation can suggest potential shifts in stock interest.
                The Delivery Rate as of {latest_date} is {insight_comparison} the yearly average.
                This {insight_strength}. The yearly delivery rate stands at {avg_delivery_rate_1Y}%,
                while the rate on {latest_date} is {avg_delivery_rate_Xperiod}%.
                This indicates {sentiment}
                "Currently, {delivery_behavior}"""
                )


        fig.update_layout(
            title="Delivery Rate Comparison",
            height=500,
            # width=1800
            autosize=True
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
        

    def predict_volatility(stock_json):

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
            
        # df = data.copy()
        
        df_copy = pd.DataFrame(stock_json)
        
        df = df_copy.copy()
        # print(df)
        def set_seed(seed):
            random.seed(seed)  # For Python's random
            np.random.seed(seed)  # For NumPy
            torch.manual_seed(seed)  # For PyTorch on CPU
            if torch.cuda.is_available():
                torch.cuda.manual_seed(seed)  # For PyTorch on GPU
                torch.backends.cudnn.deterministic = True
                torch.backends.cudnn.benchmark = False  # Ensure reproducibility

        def calculate_historical_volatility(prices, window=7):
            returns = prices.pct_change().dropna()
            volatility = returns.rolling(window=window).std() * np.sqrt(252)
            return volatility.dropna()

        def predict_vol(data):
            df = data.copy()

            class NeuralNetwork(nn.Module):
                def __init__(self, inputs, outputs):
                    super(NeuralNetwork, self).__init__()
                    self.layer = nn.Linear(inputs, 100)
                    self.layer2 = nn.Linear(100, outputs)
                    self.relu = nn.ReLU()

                def forward(self, x):
                    x = self.layer(x)
                    x = self.relu(x)
                    x = self.layer2(x)
                    return x

            class Normalize:
                def __init__(self):
                    self.minx = None
                    self.maxx = None

                def normalize(self, x):
                    x = np.array(x)
                    self.minx = min(x)
                    self.maxx = max(x)
                    return (x - self.minx) / (self.maxx - self.minx)

                def denormalize(self, x):
                    return x * (self.maxx - self.minx) + self.minx

            def BuildTrainTest(vol):
                window = 100
                output = 30
                inputs = []
                outputs = []
                for i in range(window, len(vol) - output + 1):
                    inp_ = vol[i - window:i]
                    out_ = vol[i:i + output]
                    inputs.append(inp_)
                    outputs.append(out_)
                IN = [torch.tensor(i, dtype=torch.float32) for i in inputs]
                OUT = [torch.tensor(i, dtype=torch.float32) for i in outputs]
                TEST = [torch.tensor(vol[-window:], dtype=torch.float32)]
                return torch.stack(IN), torch.stack(OUT), torch.stack(TEST)

            # Normalize and prepare data
            historical_volatility = calculate_historical_volatility(df['Close'])
            normal = Normalize()
            nVol = normal.normalize(historical_volatility.values)

            TIN, TOUT, TTEST = BuildTrainTest(nVol)

            model = NeuralNetwork(100, 30)
            optimizer = optim.Adam(model.parameters(), lr=0.001)
            criterion = nn.MSELoss()

            for epoch in range(500):
                output = model(TIN)
                loss = criterion(output, TOUT)
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

            with torch.no_grad():
                testout = model(TTEST)

            nvolatility = testout.numpy()[0]
            predicted_volatility = normal.denormalize(nvolatility)
            return predicted_volatility

        def volatility_distribution_with_prediction(df , window=7):
            # Set the seed for reproducibility
            set_seed(42)
            

            # Calculate historical and predicted volatility
            df['Volatility'] = calculate_historical_volatility(df['Close'], window)
            predicted_volatility = predict_vol(df)

            # Remove NaN values
            df = df.replace([np.inf, -np.inf], np.nan).dropna(subset=['Volatility'])

            # Define histogram data
            hist_data = [df['Volatility']]
            group_labels = ['Historical Volatility']

            # Create the histogram plot
            fig = ff.create_distplot(hist_data, group_labels, bin_size=0.01, show_rug=False)
            fig.update_traces(marker_color='#4d95ec') 
            fig.update_traces(line_color='red', selector=dict(type='scatter'))
  
            # Add orange points for predicted volatility on the x-axis
            fig.add_trace(go.Scatter(
                x=predicted_volatility[:5],  # First 5 predicted values
                y=[0] * 5,  # Place points at y=0
                mode='markers+text',
                marker=dict(color='orange', size=10, symbol='circle'),
                text=[f'P{i + 1}' for i in range(5)],  # Add labels P1, P2, etc.
                textposition='bottom center',
                name='Predicted Volatility'
            ))

            # Add the latest known volatility as a vertical line
            latest_volatility = df['Volatility'].iloc[-1]
            fig.add_shape(type="line",
                        x0=latest_volatility, y0=0, x1=latest_volatility, y1=max(fig['data'][1]['y']),
                        line=dict(color="blue", width=3, dash="dash"))

            fig.add_annotation(x=latest_volatility, y=0, xref='x', yref='y',
                            text=f'Latest<br>Volatility<br>{latest_volatility.round(2)}', showarrow=False, font=dict(color='blue'))

            # Final layout adjustments
            fig.update_layout(
                font=dict(family='Arial', size=12, color='black'),
                xaxis=dict(
                    title='Volatility (Standard Deviation)',  # X-axis label
                    tickfont=dict(size=17)
                ),
                yaxis=dict(
                    title='Density',  # Y-axis label
                    tickfont=dict(size=17)
                ),
                showlegend=False,
                margin=dict(t=60, b=10),
                template='plotly_white',
                title='Volatility with Predictions',
                # width=1000,
                autosize=True
                
            )
            
            fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5             # Position it centrally
                )
            )

            
            return fig

            # return fig.to_html(full_html=False, include_plotlyjs='cdn')
        
        fig = volatility_distribution_with_prediction(df)
        # print(type(fig))
          # Serialize the figure and return as JSON
        fig_dict = fig.to_dict()
    
        fig_dict_serializable = convert_to_serializable(fig_dict)
        
        comment = (f"""This plot shows how the stock's price movements have changed over time and gives an idea 
                  of how uncertain or volatile the stock might be in the future. 

                The orange line represents the "known volatility," which is how much the stock's price fluctuated in the past few months. 
                  Think of this as a measure of how unpredictable the stock's price has been. 

                The blue line is a prediction of how volatile the stock might be over the next 10 business days. 
                  This helps us anticipate how much the price might move in the near future, though it's based on past patterns and is not guaranteed. 

                In short, this plot helps us understand how much the stock's price changes and gives us an idea of what to expect in the coming days."""
                )
        
        return {
            "scatter_data": fig_dict_serializable['data'],
            "layout": fig_dict['layout'],
            "comment": comment
        }
        
        
        
    def create_industry_bubble_plot(symbol):

        # industry_data = pd.read_csv('data/Industry_data_with_returns.csv')
        # pe_eps_data = pd.read_csv('data/pe_data.csv')
        #

        industry_data = pd.read_csv(f'src/main/resources/data/Industry_data_with_returns.csv')
        pe_eps_data = pd.read_csv(f'src/main/resources/data/pe_data.csv')

        # Find the Basic_Industry for the given symbol
        basic_industry = industry_data[industry_data['Symbol'] == symbol]['Basic_Industry'].iloc[0]
        
        # Filter symbols belonging to the same Basic_Industry
        symbols_in_basic_industry = industry_data[industry_data['Basic_Industry'] == basic_industry]['Symbol']
        
        # Merge the industry data and pe_eps_data for these symbols
        filtered_industry_data = industry_data[industry_data['Symbol'].isin(symbols_in_basic_industry)]
        merged_df = pd.merge(filtered_industry_data, pe_eps_data, on='Symbol', how='left')
        merged_df = merged_df[merged_df['bookValue']>=0]
        
        # Handle NaN values
        merged_df['bookValue'] = merged_df['bookValue'].fillna(0)
        merged_df['trailingPE'] = merged_df['trailingPE'].fillna(0)
        merged_df['trailingEps'] = merged_df['trailingEps'].fillna(0)

        # Calculate the price as eps * pe
        merged_df['price'] = (merged_df['trailingEps'] * merged_df['trailingPE']).round(2)
 
        # Define the custom blue color shades
        custom_blue_colors = [
                # "#18c4b8", "#1ed7cd", "#087ea2", "#017598", "#05a7be",  # Your original colors
                "#0d98ba", "#00b3b3", "#0083a8", "#0099cc", "#006d77",  # Teal & Aqua Blues
                "#33a1c9", "#0077b6", "#0096c7", "#00a8e8", "#48cae4",  # Sky & Ocean Blues
                "#007ea7", "#004e64", "#2a9d8f", "#22577a", "#1b4965",  # Deep & Cool Blues
                "#5fa8d3", "#468faf", "#1f7a8c", "#276fbf", "#2c7da0"   # Soft & Muted Blues
            ]
        
        # Plotting the bubble chart with Alphabet color scheme and legend
        fig = px.scatter(
            merged_df,
            x='trailingEps',
            y='trailingPE',
            size='bookValue',
            color='Symbol',  # Assign different colors to each symbol
            # color_discrete_sequence=px.colors.qualitative.Alphabet,  # Use Alphabet color scheme
            color_discrete_sequence=custom_blue_colors,  # Use the custom blue shades
            # hover_name='Symbol',
            # hover_data={'price': True},  # Include price in the hover information
            labels={'trailingPE': 'PE Ratio', 'trailingEps': 'Eps','bookValue':'Book Value','price':'Price'},
            size_max=100)
        
        

        fig.update_layout(
            title = dict(text=f'Industry: {basic_industry}',x=0.5,y=0.9),
            height = 500,
            template='plotly_white',
            autosize=True
            )
            
        
        fig.update_layout(
                legend=dict(
                    orientation="h",  # Horizontal orientation
                    yanchor="top",    # Anchor the legend to the top of the designated space
                    y=-0.2,           # Move it below the plot
                    xanchor="center",  # Center align
                    x=0.5             # Position it centrally
                )
            )
 
    
        # return fig.to_html(full_html=False, include_plotlyjs='cdn')
        # return fig
        
        comment = (f"""This chart showcases the performance of various symbols in the same industry as {symbol}. 
                    Each bubble represents a different symbol. The vertical axis shows the PE Ratio, indicating how much
                    investors are willing to pay for each unit of earnings. 
                    The horizontal axis shows the EPS, which measures a company's profitability. 
                    The size of the bubbles reflects the book value of each symbol. 
                    By comparing the size and position of the bubbles, you can quickly see which companies are performing
                    well and which ones lag behind. It's a visual battle of metrics, making it easy to identify key players in the industry."""
                    )
    
        fig_dict = fig.to_dict()
        
        return {
            "scatter_data": fig_dict['data'],
            "layout": fig_dict['layout'],
            "comment": comment
        }
    
    
    def create_technical_plot(stock_json):
        # df = data.copy()
        
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
            
        df_copy = pd.DataFrame(stock_json)
        
        df = df_copy.copy()
    #     # Compute RSI
    #     def compute_rsi(data, window=14):
    #         delta = data["Close"].diff()
    #         gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    #         loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    #         rs = gain / loss
    #         return 100 - (100 / (1 + rs))
    #
    #     # Compute MACD
    #     def compute_macd(data, short=12, long=26, signal=9):
    #         short_ema = data["Close"].ewm(span=short, adjust=False).mean()
    #         long_ema = data["Close"].ewm(span=long, adjust=False).mean()
    #         macd = short_ema - long_ema
    #         signal_line = macd.ewm(span=signal, adjust=False).mean()
    #         return macd, signal_line
    #
    #     # Compute Volatility
    #     def compute_volatility(data, window=10):
    #         return data["Close"].pct_change().rolling(window=window).std() * 100
    #
    #     df["RSI"] = compute_rsi(df)
    #     df["MACD"], df["Signal"] = compute_macd(df)
    #     df["Volatility"] = compute_volatility(df)
    #
    #
    #     # Calculate weekly delivery percentage
    #     # df['Week'] = df['Date'].dt.to_period('W')
    #
    #
    #     # Create figure
    #     fig = go.Figure()
    #
    #     fig.add_trace(go.Candlestick(
    #         x=df["Date"], 
    #         open=df["Open"], 
    #         high=df["High"], 
    #         low=df["Low"], 
    #         close=df["Close"], 
    #         name="Candlestick",
    #         showlegend=False,
    #
    #         # Make candles thinner (reduce width)
    #         increasing_line_width=0.8,  # Thinner lines for green candles
    #         decreasing_line_width=0.8,  # Thinner lines for red candles
    #
    #         # Adjust colors for a softer look
    #         increasing_fillcolor="rgba(0, 200, 0, 0.5)",  # Light green (transparent)
    #         decreasing_fillcolor="rgba(255, 0, 0, 0.5)",  # Light red (transparent)
    #
    #         # Make borders less prominent
    #         increasing_line_color="rgba(0, 200, 0, 0.8)",  # Slightly darker green border
    #         decreasing_line_color="rgba(255, 0, 0, 0.8)",  # Slightly darker red border
    #     ))
    #
    #
    #     # Add indicators (initially hidden)
    #     fig.add_trace(go.Scatter(
    #         x=df["Date"], y=df["RSI"], mode="lines", name="RSI", visible=False, 
    #         yaxis="y2", line=dict(color="green",width = 1.2)  # Blue for RSI
    #     ))
    #
    #     fig.add_trace(go.Scatter(
    #         x=df["Date"], y=df["MACD"], mode="lines", name="MACD", visible=False, 
    #         yaxis="y2", line=dict(color="orange",width = 1.2)  # Purple for MACD
    #     ))
    #
    #     fig.add_trace(go.Scatter(
    #         x=df["Date"], y=df["Signal"], mode="lines", name="MACD Signal", visible=False, 
    #         yaxis="y2", line=dict(color="blue",width = 1.2)  # Orange (Dashed) for MACD Signal
    #     ))
    #
    #     fig.add_trace(go.Scatter(
    #         x=df["Date"], y=df["Volatility"], mode="lines", name="Volatility", visible=False, 
    #         yaxis="y2", line=dict(color="purple",width = 1.2)  # Brown (Dotted) for Volatility
    #     ))
    #
    #
    #     # Add the delivery percentage bar plot
    #     fig.add_trace(go.Bar(
    #         x=df['Date'],
    #         name="",
    #         y=df['DeliverableQty'],
    #         marker_color='green',
    # #         width = 80000000,
    #         hovertemplate='%{x|%b %d, %Y}<br>%{y}%',  # Only display Date and Percentage with 2 decimals
    #         showlegend=False ,
    #         visible=False,
    #         yaxis = "y2"
    #     ))
    #
    #
    #
    #
    #     # Define dropdown menu options
    #     dropdown_buttons = [
    #         {
    #             "label": "Candlestick",
    #             "method": "update",
    #             "args": [{"visible": [True, False, False, False, False,False]}, {"title": "Candlestick"}]
    #         },
    #         {
    #             "label": "Show RSI",
    #             "method": "update",
    #             "args": [{"visible": [True, True, False, False, False,False]}, {"title": "Candlestick + RSI"}]
    #         },
    #         {
    #             "label": "Show MACD",
    #             "method": "update",
    #             "args": [{"visible": [True, False, True, True, False,False]}, {"title": "Candlestick + MACD"}]
    #         },
    #         {
    #             "label": "Show Volatility",
    #             "method": "update",
    #             "args": [{"visible": [True, False, False, False, True,False]}, {"title": "Candlestick + Volatility"}]
    #         },
    #         {
    #             "label": "Show All Indicators",
    #             "method": "update",
    #             "args": [{"visible": [True, True, True, True, True,False]}, {"title": "Candlestick + All Indicators"}]
    #         },
    #         {
    #             "label": "Weekly Delivery Percentage",
    #             "method": "update",
    #             "args": [{"visible": [False, False, False, False, False, True]}, {"title": "Weekly Delivery Percentage"}]
    #         }
    #     ]
    #
    #     # Add dropdown menu
    #     fig.update_layout(
    #         title="Interactive Stock Chart",
    #         height=400,
    #         xaxis_rangeslider_visible=False,
    #         template = 'plotly_white',
    #         width=950,
    #         updatemenus=[{
    #             "buttons": dropdown_buttons,
    #             "direction": "down",
    #             "showactive": True,
    #             'x':1.0,  # Adjust for right alignment
    #             'xanchor':"right",
    #             'y':1.3,  # Position slightly above the plot
    #             'yanchor':"top",
    #             }],
    #
    #         xaxis = dict(
    #         dtick='M1',
    #         tickangle = 70),
    #
    #         yaxis2=dict(
    #         overlaying="y",
    #         side="right",
    #         showgrid=False,
    #         showticklabels = False),
    #
    #         yaxis=dict(
    #         tickmode='linear',
    #         dtick=100),
    #
    #
    #
    #     )
    #
    #
    #     fig.update_layout(
    #     legend=dict(
    #         orientation="h",  # Horizontal orientation
    #         yanchor="top",    # Anchor the legend to the top of the designated space
    #         y=-0.2,           # Move it below the plot
    #         xanchor="center",  # Center align
    #         x=0.5             # Position it centrally
    #         )
    #     )
    
    # Compute RSI
        def compute_rsi(data, window=14):
            delta = data["Close"].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
            rs = gain / loss
            return 100 - (100 / (1 + rs))

        # Compute MACD
        def compute_macd(data, short=12, long=26, signal=9):
            short_ema = data["Close"].ewm(span=short, adjust=False).mean()
            long_ema = data["Close"].ewm(span=long, adjust=False).mean()
            macd = short_ema - long_ema
            signal_line = macd.ewm(span=signal, adjust=False).mean()
            return macd, signal_line

        # Compute Volatility
        def compute_volatility(data, window=10):
            return data["Close"].pct_change().rolling(window=window).std() * 100

        df["RSI"] = compute_rsi(df)
        df["MACD"], df["Signal"] = compute_macd(df)
        df["Volatility"] = compute_volatility(df)
        
        
        # Calculate weekly delivery percentage
        # df['Week'] = df['Date'].dt.to_period('W')


        # Create figure
        fig = go.Figure()

        fig.add_trace(go.Candlestick(
            x=df["Date"], 
            open=df["Open"], 
            high=df["High"], 
            low=df["Low"], 
            close=df["Close"], 
            name="Candlestick",
            showlegend=False,

            # Make candles thinner (reduce width)
            increasing_line_width=0.8,  # Thinner lines for green candles
            decreasing_line_width=0.8,  # Thinner lines for red candles

            # Adjust colors for a softer look
            increasing_fillcolor="rgba(0, 200, 0, 0.5)",  # Light green (transparent)
            decreasing_fillcolor="rgba(255, 0, 0, 0.5)",  # Light red (transparent)

            # Make borders less prominent
            increasing_line_color="rgba(0, 200, 0, 0.8)",  # Slightly darker green border
            decreasing_line_color="rgba(255, 0, 0, 0.8)",  # Slightly darker red border
        ))


        # Add indicators (initially hidden)
        fig.add_trace(go.Scatter(
            x=df["Date"], y=df["RSI"], mode="lines", name="RSI", visible=False, 
            yaxis="y2", line=dict(color="green",width = 1.2)  # Blue for RSI
        ))

        fig.add_trace(go.Scatter(
            x=df["Date"], y=df["MACD"], mode="lines", name="MACD", visible=False, 
            yaxis="y2", line=dict(color="orange",width = 1.2)  # Purple for MACD
        ))

        fig.add_trace(go.Scatter(
            x=df["Date"], y=df["Signal"], mode="lines", name="MACD Signal", visible=False, 
            yaxis="y2", line=dict(color="blue",width = 1.2)  # Orange (Dashed) for MACD Signal
        ))

        fig.add_trace(go.Scatter(
            x=df["Date"], y=df["Volatility"], mode="lines", name="Volatility", visible=False, 
            yaxis="y2", line=dict(color="purple",width = 1.2)  # Brown (Dotted) for Volatility
        ))
        
        
        # Create a color list for the bars based on the condition (green for rise, red for fall)
        bar_colors = ['green' if close > open else 'red' for close, open in zip(df['Close'], df['Open'])]

        # Add the delivery percentage bar plot with dynamic color
        fig.add_trace(go.Bar(
            x=df['Date'],
            name="Volume",
            y=df['TotalTradedQty'],
            marker_color=bar_colors,  # Use the dynamic color list
            hovertemplate='%{x|%b %d, %Y}<br>%{y}',  # Display Date and Quantity
            showlegend=False,
            visible=False,
            yaxis="y2"
        ))

        
        

        # Define dropdown menu options
        dropdown_buttons = [
            {
                "label": "Candlestick",
                "method": "update",
                "args": [{"visible": [True, False, False, False, False,False]}, {"title": ""}]
            },
            {
                "label": "Show RSI",
                "method": "update",
                "args": [{"visible": [True, True, False, False, False,False]}, {"title": "Candlestick + RSI"}]
            },
            {
                "label": "Show MACD",
                "method": "update",
                "args": [{"visible": [True, False, True, True, False,False]}, {"title": "Candlestick + MACD"}]
            },
            {
                "label": "Show Volatility",
                "method": "update",
                "args": [{"visible": [True, False, False, False, True,False]}, {"title": "Candlestick + Volatility"}]
            },
            {
                "label": "Show All Indicators",
                "method": "update",
                "args": [{"visible": [True, True, True, True, True,False]}, {"title": "Candlestick + RSI + MACD + Volatility"}]
            },
            {
                "label": "Volume",
                "method": "update",
                "args": [{"visible": [False, False, False, False, False, True]}, {"title": "Volume"}]
            }
        ]

        # Add dropdown menu
        fig.update_layout(
            title="",
            height=500,
            # width=1000,
            autosize=True,
            xaxis_rangeslider_visible=False,
            template = 'plotly_white',
            updatemenus=[{
                "buttons": dropdown_buttons,
                "direction": "down",
                "showactive": True,
                'x':1.0,  # Adjust for right alignment
                'xanchor':"right",
                'y':1.25,  # Position slightly above the plot
                'yanchor':"top",
                }],
            
                xaxis = dict(
                tickformatstops=[
                    dict(dtickrange=["M1", "D1"], value="%d-%b"),  # Show day and month when zooming in to less than a month
                ],
                    ),

                yaxis2=dict(
                overlaying="y",
                side="right",
                showgrid=False,
                showticklabels = True),

                yaxis=dict(
                tickmode='linear',
                dtick=100),

                dragmode="pan",  # This allows panning (scrolling) behavior



        )
        # config = dict(scrollZoom=True)

        config = dict(scrollZoom=True)
    
        # fig.show() 
        
        
        # print(type(fig))
          # Serialize the figure and return as JSON
        fig_dict = fig.to_dict()
        
        fig_dict_serializable = convert_to_serializable(fig_dict)
    
        return {
            "figure": fig_dict_serializable,
            'config':config
            }
