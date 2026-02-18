import numpy as np
import pandas as pd
import os
import re
import sys
import json
import plotly.express as px
import plotly.graph_objs as go
import plotly.subplots as sp
import plotly.figure_factory as ff
from babel.numbers import format_decimal, format_currency
from collections import deque
from datetime import datetime
from plotly.graph_objects import Figure
from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict


from data_logger import logger
import dash
from dash import dcc, html, Input, Output, State

from utils import PUtils
from dash_plot import DashPlot
from pandas.tests.io.test_fsspec import df1

import warnings
warnings.filterwarnings("ignore")


class VisualizeInsights:
 

    @staticmethod
    def generate_graph(results1Json, results2Json, graphType):
        if not results1Json or not results2Json or not graphType:
            return json.dumps({"error": "Missing required arguments."})
    
        # print(f"Type of results1Json before parsing: {type(results1Json)}")
        # print(f"Type of results2Json before parsing: {type(results2Json)}")
    
        try:
            # First Parsing: Convert from string to JSON (list/dict)
            if isinstance(results1Json, str):
                results1Json = json.loads(results1Json)
    
            if isinstance(results2Json, str):
                results2Json = json.loads(results2Json)
    
            # Second Parsing: Handle double-encoded JSON
            if isinstance(results1Json, str):
                results1Json = json.loads(results1Json)
            
            if isinstance(results2Json, str):
                results2Json = json.loads(results2Json)
    
            # print(f"Type of results1Json after parsing: {type(results1Json)}")
            # print(f"Type of results2Json after parsing: {type(results2Json)}")
    
            df1 = pd.DataFrame(results1Json)
            df2 = pd.DataFrame(results2Json)
    
        except json.JSONDecodeError as e:
            return json.dumps({"error": f"JSON Decode Error: {str(e)}"})
        except Exception as e:
            return json.dumps({"error": f"Error processing JSON data: {str(e)}"})

        plot_result = {"error": "Invalid graph type"}  # Default response



        if graphType == "top_ten_script":
            plot_result = VisualizeInsights.top_10_Scrips_combined(df1)
        elif graphType == "combined_box_plot":
            plot_result = VisualizeInsights.combined_box_plot(df1, df2) 
        elif graphType == "stock_deployed_amt_over_time":
            plot_result = VisualizeInsights.stock_deployed_amt_over_time(df1)
        elif graphType == "create_PNL_plot":
            plot_result = VisualizeInsights.create_PNL_plot(df2)
        elif graphType == "create_swot_plot":
            plot_result = VisualizeInsights.create_swot_plot(df2)
        elif graphType == "create_industry_sunburst":
            plot_result = VisualizeInsights.create_industry_sunburst(df1)
        elif graphType == "create_user_sunburst_with_dropdown":
            plot_result = VisualizeInsights.create_user_sunburst_with_dropdown(df1)
        elif graphType == "generate_combined_bubble_chart":
            plot_result = VisualizeInsights.generate_combined_bubble_chart(df1)
        elif graphType == "create_invested_amount_plot":
            plot_result = VisualizeInsights.create_invested_amount_plot(df2)
        elif graphType == "create_best_trade_plot":
            plot_result = VisualizeInsights.create_best_trade_plot(df1)        
        elif graphType == "classify_stocks_risk_return":
            plot_result = VisualizeInsights.classify_stocks_risk_return(df1)        
        elif graphType == "calculate_portfolio_metrics":
            plot_result = VisualizeInsights.calculate_portfolio_metrics(df1)
        elif graphType == "plot_portfolio_eps_bv_quarterly_all_entries":
            plot_result = VisualizeInsights.plot_portfolio_eps_bv_quarterly_all_entries(df1)  
        if graphType == "portfolio_replacements":
            plot_result = VisualizeInsights.generate_portfolio_replacements(df1)
        elif graphType == "actual_date_replacements":
            plot_result = VisualizeInsights.generate_actual_date_replacements(df2) 
                 
        return plot_result
    
    
    @staticmethod
    def format_inr(value):
        try:
            return format_decimal(value,locale='en_IN')
        except:
            return value 

    
    @staticmethod
    def top_10_Scrips_combined(df1):
        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is
    
        try:
            # Process dataframe
            portfolio_df = df1 
            portfolio_df.columns = portfolio_df.columns.str.replace('_', ' ')
            latest_date = portfolio_df['Date'].max()
            latest_data = portfolio_df[portfolio_df['Date'] == latest_date]
    
            # Define traces
            traces = []
            categories = [
                ("Brokerage Amount", "Top 10 Scrips by Brokerage", "#a0e548"),
                ("Realized PNL", "Top 10 Scrips by Realized PNL", "#e45f2b"),
                ("Unrealized PNL", "Top 10 Scrips by Unrealized PNL", "#f6c445"),
            ]
    
            for i, (col, name, color) in enumerate(categories):
                # Convert column to numeric, errors='coerce' will replace non-numeric values with NaN
                latest_data[col] = pd.to_numeric(latest_data[col], errors='coerce')
                
                # Drop rows where conversion failed (NaN values)
                valid_data = latest_data.dropna(subset=[col])
                
                top10 = latest_data.nlargest(10, col)
                top10['Scrip'] = top10['Scrip'].str.replace(' ', '<br>')
    
                traces.append(go.Bar(
                    x=top10['Scrip'],
                    y=top10[col] / 100000,  # Convert to lakhs
                    text=top10[col].round(),
                    textposition='auto',
                    name=name,
                    marker_color=color,
                    visible=(i == 0)  # Only the first one visible initially
                ))
    
            # Create figure
            fig = go.Figure(data=traces)
    
            # Layout settings
            fig.update_layout(
                title=dict(text="Top 10 Scrips by Brokerage", x=0.5, xanchor="center"),
                xaxis=dict(title="Scrip"),
                yaxis=dict(title="Amount (in Lakhs)", type="linear"),
                autosize=True,
                updatemenus=[{
                    "buttons": [
                        {"label": name, "method": "update", "args": [{"visible": [j == i for j in range(len(categories))]}, {"title": name}]}
                        for i, (_, name, _) in enumerate(categories)
                    ],
                    "direction": "down",
                    "showactive": True,
                    "x": 1.2,
                    "xanchor": "right",
                    "y": 1.2,
                    "yanchor": "top",
                }]
            )
    
            # Convert to JSON format
            fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
    
            return {
                "scatter_data": fig_dict["data"],
                "layout": fig_dict["layout"],
                "comment": "Graph data returned successfully"
            }
    
        except Exception as e:
            return {"error": str(e)}


    


    def stock_deployed_amt_over_time(portfolio_fifo_results_df):
    
        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return [None if (isinstance(x, (float, int)) and np.isnan(x)) else x for x in obj.tolist()]
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            elif isinstance(obj, (float, int)) and np.isnan(obj):
                return None
            else:
                return obj  # Return other types as-is

        
        try:
            

            # Fill NaN values with 0 (or an appropriate default)
            # portfolio_fifo_results_df.fillna(0, inplace=True)
            #
            # # Pivot tables for Deployed Amount, Current Value, and Realized PNL
            # deployed_pivoted_df = portfolio_fifo_results_df.pivot_table(values='Deployed_Amount', index='Date', columns='Scrip')
            # current_value_pivoted_df = portfolio_fifo_results_df.pivot_table(values='Market Value', index='Date', columns='Scrip')
            # realized_pnl_pivoted_df = portfolio_fifo_results_df.pivot_table(values='Realized PNL', index='Date', columns='Scrip')
            
            
            # Convert necessary columns to numeric and date
            portfolio_fifo_results_df['Deployed_Amount'] = pd.to_numeric(portfolio_fifo_results_df['Deployed_Amount'], errors='coerce')
            portfolio_fifo_results_df['Market Value'] = pd.to_numeric(portfolio_fifo_results_df['Market_Value'], errors='coerce')
            portfolio_fifo_results_df['Realized PNL'] = pd.to_numeric(portfolio_fifo_results_df['Realized_PNL'], errors='coerce')
            portfolio_fifo_results_df['Date'] = pd.to_datetime(portfolio_fifo_results_df['Date'], errors='coerce')
            
            # Now fill NaNs and pivot
            portfolio_fifo_results_df.fillna(0, inplace=True)
            
            # Pivot tables for Deployed Amount, Current Value, and Realized PNL
            deployed_pivoted_df = portfolio_fifo_results_df.pivot_table(values='Deployed_Amount', index='Date', columns='Scrip')
            current_value_pivoted_df = portfolio_fifo_results_df.pivot_table(values='Market Value', index='Date', columns='Scrip')
            realized_pnl_pivoted_df = portfolio_fifo_results_df.pivot_table(values='Realized PNL', index='Date', columns='Scrip')

    
            # Custom colors for Deployed Amount, Current Value, and Realized PNL (one color per scrip)
            deployed_colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
            current_value_colors = ['#17becf', '#bcbd22', '#7f7f7f', '#e377c2', '#8c564b', '#9467bd', '#d62728', '#2ca02c', '#ff7f0e', '#1f77b4']
            
            # Initialize traces list
            traces = []
    
            # Add a line for each scrip for Deployed Amount
            for i, scrip in enumerate(deployed_pivoted_df.columns):
                traces.append(go.Scatter(
                    x=deployed_pivoted_df.index,
                    y=deployed_pivoted_df[scrip],
                    mode='lines+markers',
                    name=f'{scrip} - Deployed Amount',
                    text=deployed_pivoted_df[scrip],
                    hoverinfo='text',
                    marker=dict(size=6),
                    line=dict(color=deployed_colors[i % len(deployed_colors)], width=2, shape='spline'),
                    visible=False  # Start with all traces hidden
                ))
                        
            for i, scrip in enumerate(current_value_pivoted_df.columns):
                # traces.append(go.Bar(
                #     x=current_value_pivoted_df.index,
                #     y=current_value_pivoted_df[scrip],
                #     name=f'{scrip} - Market Value',
                #     text=current_value_pivoted_df[scrip].round(2),
                #     hoverinfo='text',
                #     marker=dict(color=current_value_colors[i % len(current_value_colors)]),
                #     opacity=0.8,
                #     textposition='none',  # Disable numbers directly on bars
                #     visible=False,  # Start with all traces hidden
                #     offsetgroup=i  # Group bars together for alignment
                # ))
                
                traces.append(go.Bar(
                    x=current_value_pivoted_df.index,
                    y=current_value_pivoted_df[scrip],
                    name=f'{scrip} - Market Value',
                    text=current_value_pivoted_df[scrip].round(2),
                    hoverinfo='text',
                    marker=dict(color=current_value_colors[i % len(current_value_colors)]),
                    opacity=0.7,  # Slightly transparent to make overlapping data visible
                    textposition='none',  
                    visible=False,  
                    offsetgroup=i  
                ))


    
            # Add a scatter plot for each scrip where Realized PNL is non-zero and changes from the previous value
            for i, scrip in enumerate(realized_pnl_pivoted_df.columns):
                scrip_pnl = realized_pnl_pivoted_df[scrip]
    
                # Calculate the monthly Realized PNL (difference from the previous month)
                monthly_realized_pnl = scrip_pnl.diff().fillna(scrip_pnl.iloc[0])  # Fill NA with the first value for the first month
    
                # Keep only the months where there's a non-zero or changing PNL
                non_zero_changing_pnl = monthly_realized_pnl[(monthly_realized_pnl != 0) & (monthly_realized_pnl != monthly_realized_pnl.shift())]
    
                # Define conditional colors: green for profit, red for loss
                colors = ['green' if pnl > 0 else 'red' for pnl in non_zero_changing_pnl]
    
                # Add trace for monthly Realized PNL with conditional formatting
                traces.append(go.Scatter(
                    x=non_zero_changing_pnl.index,
                    y=non_zero_changing_pnl,
                    mode='markers',
                    name=f'{scrip} - Monthly Realized PNL',
                    text=non_zero_changing_pnl.round(2),
                    hoverinfo='text',
                    marker=dict(size=10, color=colors, symbol='circle'),  # Apply the conditional colors
                    visible=False  # Start with all traces hidden
                ))
    
            # Create a Plotly figure
            fig = go.Figure(data=traces)
    
            # Initially make the first traces visible
            if traces:
                fig.data[0].visible = True
    
            # Customize the layout
            # fig.update_layout(
            #     title='Deployed Amount, Market Value, and Realized PNL Over Time',
            #     xaxis_title='Date',
            #     yaxis_title='Amount',
            #     legend_title='Stock Name and Metric',
            #     hovermode='x',
            #     template='plotly_white',
            #     showlegend=True,
            #     autosize=True,
            #     width=1500,
            #     margin=dict(l=50, r=10, t=80, b=50)
            # )
            
            
                        # Initially make the first traces visible (Deployed Amount, Current Value, and Realized PNL for the first scrip)
            fig.data[0].visible = True
            fig.data[len(deployed_pivoted_df.columns)].visible = True
            fig.data[2 * len(deployed_pivoted_df.columns)].visible = True
            
            
            
            fig.update_layout(
                title='Deployed Amount, Market Value, and Realized PNL Over Time',
                xaxis_title='Date',
                yaxis=dict(
                    title="Amount (Deployed, Market Value, Realized PNL)",  # Single y-axis title
                    showgrid=True,  # Show grid to improve visibility
                    zeroline=True
                ),
                legend_title='Stock Name and Metric',
                hovermode='x',
                template='plotly_white',
                showlegend=True,
                # autosize=True,
                width=1000,
                margin=dict(l=50, r=50, t=80, b=50),
                barmode='group'  # Group bars instead of stacking them
            )


    
            # Adjust x-axis to show date intervals every 2 months, with wrapped labels
            fig.update_layout(
                xaxis=dict(
                    tickformat='%b\n%Y',
                    dtick='M2',
                    tickmode='linear',
                    tickangle=0,
                ),
                updatemenus=[{
                    'buttons': [
                        {
                            'args': [
                                {
                                    'visible': [scrip == selected_scrip for scrip in deployed_pivoted_df.columns] + 
                                            [scrip == selected_scrip for scrip in current_value_pivoted_df.columns] + 
                                            [scrip == selected_scrip for scrip in realized_pnl_pivoted_df.columns]
                                },
                                {
                                    'title.text': f'Deployed Amount, Market Value, and Realized PNL Over Time for {selected_scrip}'
                                }
                            ],
                            'label': selected_scrip,
                            'method': 'update',
                        } for selected_scrip in deployed_pivoted_df.columns
                    ],
                    'direction': 'down',
                    'showactive': True,
                    'x': 1.20,
                    'xanchor': 'left',
                    'y': 1.10,
                    'yanchor': 'top',
                }]
            )
    
            for trace in fig.data:
                trace.y = [None if (isinstance(y, float) and np.isnan(y)) else y for y in trace.y]

            # Convert to JSON
            fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
            
            return {
                "scatter_data": fig_dict["data"],
                "layout": fig_dict["layout"],
                "comment": "Graph data returned successfully"
            }
    
        except Exception as e:
            return json.dumps({"error": str(e)})
    
    


    @staticmethod
    # use portfolio data and transaction data
    def combined_box_plot(portfolio_fifo_results_df, transaction_tab):
    
        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is

        try:
            # Plot 1
            def deployed_amount_box_plot(portfolio_fifo_results_df):
                
                # print(portfolio_fifo_results_df[['Date', 'Deployed_Amount']].head())
                # print(portfolio_fifo_results_df.dtypes)
                
                portfolio_fifo_results_df['Deployed_Amount'] = pd.to_numeric(portfolio_fifo_results_df['Deployed_Amount'], errors='coerce')


                # Grouping by 'Date' and summing 'Deployed Amount' to get the monthly deployed amount
                deployed_amt_box = portfolio_fifo_results_df.groupby(by='Date').agg(MonthlyDeployedAmt=('Deployed_Amount', 'sum'))

                # Calculate the min, max, mean, and median values
                min_val = deployed_amt_box['MonthlyDeployedAmt'].min()
                formatted_min_val = VisualizeInsights.format_inr(min_val)

                max_val = deployed_amt_box['MonthlyDeployedAmt'].max()
                formatted_max_val = VisualizeInsights.format_inr(max_val)

                mean_val = deployed_amt_box['MonthlyDeployedAmt'].mean()
                formatted_mean_val = VisualizeInsights.format_inr(mean_val)

                median_val = deployed_amt_box['MonthlyDeployedAmt'].median()
                formatted_median_val = VisualizeInsights.format_inr(median_val)
                # Create the box plot
                fig = go.Figure()

                # Add the box plot trace
                fig.add_trace(go.Box(
                    x=deployed_amt_box['MonthlyDeployedAmt'],  # Change y to x
                    name='Deployed Amount',
                    boxmean=True,
                    marker_color='darkorange',
                    ))

                # Add scatter plots for min, max, mean, and median, positioned on the same x-coordinate as the box plot
                x_value = 'Deployed Amount'
                fig.add_trace(go.Scatter(
                    x=[min_val], y=[x_value],  # Swap x and y
                    mode='markers+text', name='Min',
                    text=[f'Min: {formatted_min_val}'], textposition='middle right',  # Adjust text position
                    marker=dict(color='blue', size=10)
                ))
                fig.add_trace(go.Scatter(
                    x=[max_val], y=[x_value],  # Swap x and y
                    mode='markers+text', name='Max',
                    text=[f'Max: {formatted_max_val}'], textposition='middle right',
                    marker=dict(color='red', size=10)
                ))
                fig.add_trace(go.Scatter(
                    x=[mean_val], y=[x_value],  # Swap x and y
                    mode='markers+text', name='Mean',
                    text=[f'Mean: {formatted_mean_val}'], textposition='middle right',
                    marker=dict(color='green', size=10)
                ))
                fig.add_trace(go.Scatter(
                    x=[median_val], y=[x_value],  # Swap x and y
                    mode='markers+text', name='Median',
                    text=[f'Median: {formatted_median_val}'], textposition='middle right',
                    marker=dict(color='purple', size=10)
                ))
                # Customize the layout
                fig.update_layout(
                    # title='Deployed Amount Values Box Plot',
                    margin=dict(l=600, r=600),  # Increase left and right margins
                    xaxis_title='Value (in ₹)',  # This will be the deployed amount now
                    yaxis_title='',  # Empty as the x-axis now shows the values
                    title_x=0.5,
                    plot_bgcolor='rgba(240, 240, 240, 0.8)',  # Light gray background
                    paper_bgcolor='white',
                    height=600,
                    
                )

                return fig

            # Plot 2
            def create_box_plot(df):
                
                df['Qty'] = pd.to_numeric(df['Qty'], errors='coerce')
                df['Mkt_Price'] = pd.to_numeric(df['Mkt_Price'], errors='coerce')
                df['Turnover'] = df['Qty'] * df['Mkt_Price']

            
                # df['Turnover'] = df['Qty'] * df['Mkt_Price']

                df_copy = df.copy()
                
                
                def calculate_upper_fence(turnover):
                    q1 = turnover.quantile(0.25)
                    q3 = turnover.quantile(0.75)
                    iqr = q3 - q1
                    upper_fence = q3 + 1.5 * iqr
                    return upper_fence

                # Convert 'Trade_Date' to datetime format
                df_copy['Trade_Date'] = pd.to_datetime(df_copy['Trade_Date'])

                # Create a 'Month' column based on the 'Trade_Date'
                df_copy['Month'] = df_copy['Trade_Date'].dt.to_period('M')

                box_data = df_copy.groupby('Month')['Turnover'].apply(list).reset_index()
                box_data = box_data.explode('Turnover').reset_index(drop=True)

                # Calculate monthly max and upper fence
                monthly_max = box_data.groupby('Month').agg(Monthly_Max=('Turnover', 'max')).reset_index()
                upper_fence = box_data.groupby('Month').agg(Upper_Fence=('Turnover', calculate_upper_fence)).reset_index()

                # Merge the original DataFrame with the aggregated DataFrames
                box_data = pd.merge(box_data, monthly_max, on='Month', how='left')
                box_data = pd.merge(box_data, upper_fence, on='Month', how='left')


                box_data = box_data[~((box_data['Turnover'] > box_data['Upper_Fence']) & (box_data['Turnover'] < box_data['Monthly_Max']))]

                
                
                box_data = box_data.groupby('Month')['Turnover'].apply(list).reset_index()

                # Calculate monthly average turnover
                avg_turnover = df_copy.groupby('Month')['Turnover'].mean().reset_index()
                
                # Calculate monthly average turnover
                median_turnover = df_copy.groupby('Month')['Turnover'].median().reset_index()

                # Transform the turnover data
                def transform_turnover(turnover):
                    transformed = []
                    for val in turnover:
                        if val <= 100_000:
                            transformed.append(val)  # Keep 0-100k as is
                        else:
                            transformed.append(100_000 + (val - 100_000) / 3)  # Compress above 100k
                    return transformed

                # Create the plot
                fig = go.Figure()

                # Add box plot for the monthly turnover values
                for index, row in box_data.iterrows():
                    transformed_turnover = transform_turnover(row['Turnover'])  # Apply transformation
                    original_turnover = row['Turnover']  # Keep original values for hover
                    
                    fig.add_trace(go.Box(
                        y=original_turnover,
                        name=row['Month'].to_timestamp().strftime('%Y-%m'),  # Month as name
                        marker_color='#32a1e6',
                        showlegend=False,
                        text=original_turnover,
                        
                    ))
                    
                # Add a line plot for the average turnover
                fig.add_trace(go.Scatter(
                    x=avg_turnover['Month'].astype(str),  # X-axis: month
                    y=avg_turnover['Turnover'],  # Y-axis: average turnover
                    mode='lines+markers',
                    name='Avg Turnover',
                    marker=dict(color='orange', size=5),
                    line=dict(color='orange', width=2),
                    showlegend=True
                ))
                
                # Add a line plot for the average turnover
                fig.add_trace(go.Scatter(
                    x=median_turnover['Month'].astype(str),  # X-axis: month
                    y=median_turnover['Turnover'],  # Y-axis: average turnover
                    mode='lines+markers',
                    name='Median Turnover',
                    marker=dict(color='red', size=5),
                    line=dict(color='red', width=2),
                    showlegend=True
                ))

                # Custom ticks and labels for the y-axis
                fig.update_layout(
                    title={
                        'text': 'Monthly Turnover',
                        'y': 0.95,  # Vertical position of the title (1 is the top)
                        'x': 0.5,  # Horizontal position of the title (0.5 centers the title)
                        'xanchor': 'center',
                        'yanchor': 'top',
                    },
                    template='plotly_white',
                    font=dict(size=12, color='black'),
                    height=700,
                    width=1600,
                    xaxis=dict(dtick='M1',tickformat='%b\n%Y'),
                    yaxis=dict(range=[0, 175000],  # Set a larger range to spread the values out
                        title='Turnover (Rs)',
                        showgrid=True
                    )
                )
                return fig
            

            
            # Create individual plots
            deployed_amt_fig = deployed_amount_box_plot(portfolio_fifo_results_df)
            monthly_box_fig = create_box_plot(transaction_tab)
            
            # Check if figures have traces
            if not deployed_amt_fig.data:
                raise ValueError("deployed_amt_fig contains no data!")
            if not monthly_box_fig.data:
                raise ValueError("monthly_box_fig contains no data!")
        
            # Create a subplot with 2 rows
            fig = sp.make_subplots(
                rows=2, cols=1,
                subplot_titles=('Deployed Amount Box Plot', 'Monthly Turnover Box Plots'),
                vertical_spacing=0.2,
                row_heights=[0.3, 0.7],  # Adjust the ratio
                column_widths=[0.8]
            )
        
            # Add the deployed amount box plot to the first subplot
            for trace in deployed_amt_fig.data:
                fig.add_trace(trace, row=1, col=1)
        
            # Add the monthly box plots to the second subplot
            for trace in monthly_box_fig.data:
                fig.add_trace(trace, row=2, col=1)
        
            # Customize layout
            fig.update_layout(
                height=1000,
                title_text='',
                title_x=0.5,
                showlegend=False,
                template='plotly_white'
            )
        
            # Update axes
            fig.update_yaxes(title='Turnover (Rs)', row=2, col=1)
            fig.update_xaxes(title='Month', dtick='M1', row=2, col=1)
        
            # Convert to JSON
            fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
        
            return {
                "scatter_data": fig_dict["data"],
                "layout": fig_dict["layout"],
                "comment": "Graph data returned successfully"
            }
        
        except Exception as e:
            return {"error": str(e)}  # Don't use json.dumps()

    


    # @staticmethod
    # # use transaction data
    # def create_PNL_plot(transaction_tab):

    #     def convert_to_serializable(obj):
    #         if isinstance(obj, (np.ndarray, pd.Series)):
    #             return obj.tolist()  # Convert NumPy array to list
    #         elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
    #             return obj.isoformat()  # Convert datetime to string
    #         elif isinstance(obj, dict):
    #             return {key: convert_to_serializable(value) for key, value in obj.items()}
    #         elif isinstance(obj, list):
    #             return [convert_to_serializable(item) for item in obj]
    #         else:
    #             return obj  # Return other types as-is


    #     try:

    #         transaction_tab['Trade_Date'] = pd.to_datetime(transaction_tab['Trade_Date'])
    #         transaction_tab['Mkt_Price'] = pd.to_numeric(transaction_tab['Mkt_Price'], errors='coerce')

    #         # transaction_tab['Trade_Date'] = pd.to_datetime(transaction_tab['Trade_Date'])

    #         # Get unique stock names from the dataframe
    #         stock_names = transaction_tab['Scrip_Name'].unique()

    #         # Create a list to hold traces and buttons for the dropdown
    #         traces = []
    #         buttons = []
    #         trace_visibility_map = {}  # To store the visibility index for each stock

    #         # Default stock to be shown
    #         default_stock = stock_names[0]

    #         # Loop through each stock and prepare the data for plotting
    #         for stock_name in stock_names:
    #             # Filter data for the specific stock
    #             stock_data = transaction_tab[transaction_tab['Scrip_Name'] == stock_name].copy()

    #             # Line plot for Market Value over time
    #             line_trace = go.Scatter(
    #                 x=stock_data['Trade_Date'], 
    #                 y=stock_data['Mkt_Price'],
    #                 mode='lines+markers', 
    #                 name='',
    #                 visible=(stock_name == default_stock),  # Set default stock as visible
    #                 line=dict(color='blue'),
    #                 marker=dict(color='blue',size=5),
    #                 # Add hover template to show Order_Type and Qty
    #                 hovertemplate=(
    #                     "Date: %{x}<br>"
    #                     "Market Price: %{y}<br>"
    #                     "Action: %{customdata[0]}<br>"
    #                     "Quantity: %{customdata[1]}<extra></extra>"
    #                 ),
    #                 # Pass the Order_Type and Qty columns to hover via customdata
    #                 customdata=stock_data[['Order_Type', 'Qty']].values
    #             )
    #             traces.append(line_trace)
                
    #             # Create visibility entry for the current stock
    #             trace_visibility_map[stock_name] = [len(traces) - 1]  # Track index for visibility

    #             # Add shaded regions for Buy (Green) and Sell (Red)
    #             prev_date = None
    #             prev_price = None
    #             for idx, row in stock_data.iterrows():
    #                 if prev_date is not None:
    #                     price_change = row['Mkt_Price'] - prev_price

    #                     # Define green region for Buy with a price increase
    #                     if row['Order_Type'] == 'B' and price_change > 0:
    #                         green_region = go.Scatter(
    #                             x=[prev_date, row['Trade_Date'], row['Trade_Date'], prev_date],
    #                             y=[stock_data['Mkt_Price'].min(), stock_data['Mkt_Price'].min(),
    #                             stock_data['Mkt_Price'].max(), stock_data['Mkt_Price'].max()],
    #                             fill='toself', mode='none', fillcolor='green', opacity=0.6,
    #                             line=dict(color="green", width=2, dash="dash"),
    #                             showlegend=False,
    #                             hoverinfo='skip',  # Skip hover info for this region
    #                             visible=(stock_name == default_stock)
    #                         )
    #                         traces.append(green_region)
    #                         trace_visibility_map[stock_name].append(len(traces) - 1)  # Track visibility

    #                     # Define red region for Sell with a price decrease
    #                     elif row['Order_Type'] == 'S' and price_change < 0:
    #                         red_region = go.Scatter(
    #                             x=[prev_date, row['Trade_Date'], row['Trade_Date'], prev_date],
    #                             y=[stock_data['Mkt_Price'].min(), stock_data['Mkt_Price'].min(),
    #                             stock_data['Mkt_Price'].max(), stock_data['Mkt_Price'].max()],
    #                             fill='toself', mode='none', fillcolor='red', opacity=0.6,
    #                             line=dict(color="red", width=2, dash="dash"),
    #                             showlegend=False, 
    #                             hoverinfo='skip',  # Skip hover info for this region
    #                             visible=(stock_name == default_stock)
    #                         )
    #                         traces.append(red_region)
    #                         trace_visibility_map[stock_name].append(len(traces) - 1)  # Track visibility

    #                 prev_date = row['Trade_Date']
    #                 prev_price = row['Mkt_Price']

    #         # Create buttons for dropdown (visibility control)
    #         for stock_name in stock_names:
    #             visibility = [False] * len(traces)  # Start with all traces hidden

    #             # Make visible the traces related to the current stock
    #             for trace_index in trace_visibility_map[stock_name]:
    #                 visibility[trace_index] = True

    #             # Add button for this stock to dropdown
    #             buttons.append({
    #                 'args': [{'visible': visibility}],  # Set visibility for this stock
    #                 'label': stock_name,
    #                 'method': 'restyle'
    #             })

    #         # Create the figure with the data
    #         fig = go.Figure(data=traces)

    #         # Add dropdown menu
    #         fig.update_layout(
    #             updatemenus=[{
    #                 'buttons': buttons,
    #                 'direction': 'down',
    #                 'showactive': True,
    #                 'x': 1.0,
    #                 'xanchor': 'right',
    #                 'y': 1.15,
    #                 'yanchor': 'top'
    #             }]
    #         )

    #         # Update layout details
    #         fig.update_layout(
    #             title='Stock Price Movements and Transaction Zones',
    #             xaxis_title='Date',
    #             yaxis_title='Market Price',
    #             template='plotly_white',
    #             xaxis=dict(
    #                 tickangle=0,
    #                 tickformatstops=[
    #                     # dict(dtickrange=[None, "M1"], value="%b %Y"),  # Show month and year when zoomed out
    #                     dict(dtickrange=["M1", "D1"], value="%d-%b"),  # Show day and month when zooming in to less than a month
    #                     # dict(dtickrange=["D1", None], value="%d-%b-%Y")  # Show full date when zoomed into day level
    #                 ],
    #                 rangeslider=dict(
    #                     visible=True,
    #                     thickness=0.05  # Optional: Control the thickness of the range slider
    #                 ),
    #             ),
    #             height=600,
    #             showlegend=False,
    #             autosize=True
    #         )

    #         # Enable scroll wheel zoom
    #         config = dict(scrollZoom=True)

    #         # Convert to JSON
    #         fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
            
    #         return {
    #             "figure": fig_dict,
    #              "config":config
    #             }
    

    #     except Exception as e:           
    #         return json.dumps({"error": str(e)})


    @staticmethod
    def create_PNL_plot(transaction_df):
        try:
            conn, cursor = DBHandler.get_connection()
            mkt_db = MktDB(conn, cursor)

            def create_name_symbol_mapping(df):
                def normalize_ScripNames(text, keep_nums=True):
                    if keep_nums:
                        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
                    else:
                        text = re.sub(r'[^a-zA-Z\s]', '', text)
                    text = text.lower()
                    char_to_replace = {'ltd': '', 'limited': '', 'eng': '', 'engineering': ''}
                    for key, value in char_to_replace.items():
                        text = text.replace(key, value)
                    return ' '.join(text.split())

                def search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer):
                    vector = vectorizer.transform([normalized_ScripName]).toarray()
                    cos_sim_scores = cosine_similarity(vector, nse_vectors)[0]
                    return np.argmax(cos_sim_scores), np.max(cos_sim_scores)

                def is_symbol(value):
                    if value in nse_scrip_list['SYMBOL'].values:
                        return True
                    if re.fullmatch(r'^[A-Z0-9&.-]+$', value):
                        return True
                    return False

                nse_scrip_list = pd.read_csv(r'src/main/resources/data/portf_data/new_portfolio_equity_list.csv')
                nse_scrip_list['Normalized_ScripName'] = nse_scrip_list['Name of Company'].apply(normalize_ScripNames)
                df['Is_Symbol'] = df['Scrip_Name'].apply(is_symbol)

                if df['Is_Symbol'].all():
                    df.rename(columns={'Scrip_Name': 'Symbol'}, inplace=True)
                    df['Scrip_Name'] = df['Symbol'].map(dict(zip(nse_scrip_list['SYMBOL'], nse_scrip_list['Name of Company'])))
                    missing_scrip_names = df[df['Scrip_Name'].isna()]
                    if not missing_scrip_names.empty:
                        print("These symbols could not be mapped to a Scrip_Name and will be dropped:")
                        print(missing_scrip_names['Symbol'].tolist())
                        df = df.dropna(subset=['Scrip_Name']).reset_index(drop=True)
                else:
                    df['Normalized_ScripName'] = df['Scrip_Name'].apply(normalize_ScripNames)
                    vectorizer = CountVectorizer().fit(nse_scrip_list['Normalized_ScripName'])
                    nse_vectors = vectorizer.transform(nse_scrip_list['Normalized_ScripName']).toarray()
                    name_to_symbol = dict(zip(nse_scrip_list['Normalized_ScripName'], nse_scrip_list['SYMBOL']))
                    df['Symbol'] = df['Normalized_ScripName'].map(name_to_symbol)
                    missing_symbols = df[df['Symbol'].isna()]
                    for i, row in missing_symbols.iterrows():
                        normalized_ScripName = row['Normalized_ScripName']
                        scrip_index, similarity_score = search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer)
                        if similarity_score > 0.8:
                            matched_symbol = nse_scrip_list.iloc[scrip_index]['SYMBOL']
                            df.at[i, 'Symbol'] = matched_symbol
                df['Symbol'].fillna('Unknown', inplace=True)
                df.drop(columns=['Is_Symbol','Normalized_ScripName'], inplace=True)
                return df

            df = create_name_symbol_mapping(transaction_df.copy())
            df['Trade_Date'] = pd.to_datetime(df['Trade_Date'])
            df = df[df['Exchange'] != 'BSE'].copy()
            df = df.sort_values(['Scrip_Name', 'Trade_Date'])

            stock_data = {}

            min_date = df['Trade_Date'].min().strftime('%Y-%m-%d')
            max_date = (df['Trade_Date'].max() + timedelta(days=5)).strftime('%Y-%m-%d')
            symbols = df['Symbol'].unique().tolist()
            hist = mkt_db.fetch_historical_data(symbols=symbols, start_date=min_date, end_date=max_date)
            hist['Date'] = pd.to_datetime(hist['Date'])

            for stock in df['Scrip_Name'].unique():
                sd = df[df['Scrip_Name'] == stock].copy()
                symbol = sd['Symbol'].iloc[0]
                stock_trade_dates = sd['Trade_Date']
                start_date = stock_trade_dates.min()
                end_date = stock_trade_dates.max()

                stock_hist = (
                    hist[hist['Symbol'] == symbol]
                    .set_index('Date')['Close']
                    .resample('D')
                    .last()
                    .ffill()
                )

                price_ser = stock_hist[start_date:end_date]
                trend = price_ser.rolling(5, min_periods=1).mean()

                sd['future_avg_5d'] = sd['Trade_Date'].apply(
                    lambda d: price_ser.loc[d + timedelta(days=1): d + timedelta(days=5)].mean()
                )
                sd['outcome'] = sd.apply(lambda r: (
                    'Good buy'  if r['Order_Type']=='B' and r['future_avg_5d'] > r['Mkt_Price'] else
                    'Bad buy'   if r['Order_Type']=='B' else
                    'Good sell' if r['Order_Type']=='S' and r['future_avg_5d'] < r['Mkt_Price'] else
                    'Bad sell'
                ), axis=1)

                sd['Trade_Day'] = sd['Trade_Date'].dt.normalize()
                agg = sd.groupby(['Trade_Day', 'outcome']).agg(
                    total_qty=('Qty','sum'),
                    avg_price=('Mkt_Price','mean')
                ).reset_index()

                majority_dates = []
                majority_prices = []
                majority_outcomes = []
                breakdown = []

                for day, group in agg.groupby('Trade_Day'):
                    best = group.loc[group['total_qty'].idxmax()]
                    majority_dates.append(day.strftime('%Y-%m-%d'))
                    majority_prices.append(best['avg_price'])
                    majority_outcomes.append(best['outcome'])

                    day_details = []
                    for _, r in group.iterrows():
                        day_details.append({
                            'outcome':    r['outcome'],
                            'total_qty':  int(r['total_qty']),
                            'avg_price':  round(r['avg_price'], 2)
                        })
                    breakdown.append(day_details)

                stock_data[stock] = {
                    'dates':       price_ser.index.strftime('%Y-%m-%d').tolist(),
                    'prices':      price_ser.tolist(),
                    'trend':       trend.tolist(),
                    'maj_dates':   majority_dates,
                    'maj_prices':  majority_prices,
                    'maj_outcomes':majority_outcomes,
                    'breakdown':   breakdown,
                    'num_trades': len(sd),
                    'num_buys':   len(sd[sd['Order_Type']=='B']),
                    'num_sells':  len(sd[sd['Order_Type']=='S']),
                }

            print(json.dumps(stock_data))  # if used as script
            return stock_data

        except Exception as e:
            error_trace = traceback.format_exc()
            error_response = {
                "error": "Graph generation failed in Python",
                "details": error_trace
            }
            print(json.dumps(error_response))  # if used as script
            return error_response  
        

    
    @staticmethod
    # use transation data
    def create_swot_plot(transaction_tab):

        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is


        try:
            
             # Convert columns to numeric early on
            transaction_tab['Mkt_Price'] = pd.to_numeric(transaction_tab['Mkt_Price'], errors='coerce')
            transaction_tab['Brok_Amt'] = pd.to_numeric(transaction_tab['Brok_Amt'], errors='coerce')
            transaction_tab['Qty'] = pd.to_numeric(transaction_tab['Qty'], errors='coerce')

            # Initialize the required columns in the DataFrame
            transaction_tab['realized_pnl'] = 0.0
            transaction_tab['Remaining_Qty'] = 0

            # Dictionary to hold FIFO queues by Scrip_Name and Exchange
            fifo_queues = {}
            removed_scrips = set()  # Set to track scrips with insufficient shares
            
            # Iterate over the DataFrame
            for index, row in transaction_tab.iterrows():
                scrip = row['Scrip_Name']
                exchange = row['Exchange']
                qty = row['Qty']
                mkt_price = row['Mkt_Price']
                order_type = row['Order_Type']

                # Identify the FIFO queue for the current Scrip and Exchange
                key = (scrip, exchange)
                if key not in fifo_queues:
                    fifo_queues[key] = deque()

                # Get the FIFO queue for the current scrip
                fifo_queue = fifo_queues[key]

                if order_type == 'B':
                    # Add the buy quantity and price to the FIFO queue
                    fifo_queue.append({'qty': qty, 'price': mkt_price})
                    # Update the remaining quantity in the DataFrame
                    transaction_tab.at[index, 'Remaining_Qty'] = sum(item['qty'] for item in fifo_queue)

                elif order_type == 'S':
                    # Initialize realized P&L for this sale
                    realized_pnl = 0.0
                    qty_to_sell = qty

                    # Process FIFO lots until the sale quantity is met
                    while qty_to_sell > 0 and fifo_queue:
                        buy_lot = fifo_queue[0]
                        buy_qty = buy_lot['qty']
                        buy_price = buy_lot['price']

                        if buy_qty <= qty_to_sell:
                            # Sell entire lot
                            realized_pnl += buy_qty * (mkt_price - buy_price)
                            qty_to_sell -= buy_qty
                            fifo_queue.popleft()  # Remove this lot
                        else:
                            # Partially sell from the lot
                            realized_pnl += qty_to_sell * (mkt_price - buy_price)
                            buy_lot['qty'] -= qty_to_sell
                            qty_to_sell = 0

                    # Check if insufficient shares were available to meet the sale
                    if qty_to_sell > 0:
                        removed_scrips.add(scrip)  # Track the scrip for complete removal
                        continue  # Skip further processing and move to the next row

                    # Update DataFrame with realized P&L and remaining quantity
                    transaction_tab.at[index, 'realized_pnl'] = realized_pnl
                    transaction_tab.at[index, 'Remaining_Qty'] = sum(item['qty'] for item in fifo_queue)

        #     # Print out the scrips removed due to insufficient shares
        #     if removed_scrips:
        #         print("The following scrips had insufficient shares to sell and were removed completely from the DataFrame:")
        #         for scrip in removed_scrips:
        #             print(f"- {scrip}")

            # Remove all transactions related to any scrip that had insufficient shares
            transaction_tab = transaction_tab[~transaction_tab['Scrip_Name'].isin(removed_scrips)]

            # Reset the index of the updated DataFrame
            transaction_tab = transaction_tab.reset_index(drop=True)

            transaction_tab['Trade_Date'] = pd.to_datetime(transaction_tab['Trade_Date'])


            # Sort the DataFrame by 'Scrip_Name' and 'Trade_Date'
            transaction_tab = transaction_tab.sort_values(by=['Scrip_Name', 'Trade_Date'])

            # Initialize a list to store the results
            results = []
            
            # Group by 'Scrip_Name'
            for stock, group in transaction_tab.groupby('Scrip_Name'):
                buy_stack = []  # To keep track of buy transactions
                for idx, row in group.iterrows():
                    if row['Order_Type'] == 'B':
                        # Append buy transactions to the stack
                        adjusted_buy_price = row['Mkt_Price'] + (row['Brok_Amt'] / row['Qty'])  # Add buy-side brokerage to buy price

                        buy_stack.append({
                            'Qty': row['Qty'],
                            'Buy_Price': adjusted_buy_price,
                            'Buy_Date': row['Trade_Date'],
                            'Buy_Brokerage': row['Brok_Amt']  # Store buy-side brokerage
                        })
                    elif row['Order_Type'] == 'S':
                        sell_qty = row['Qty']
                        sell_date = row['Trade_Date']

                        # Subtract sell-side brokerage from total sell value
                        sell_price = row['Mkt_Price']  # Original sell price per unit
                        total_sell_value = sell_price * sell_qty
                        adjusted_sell_value = total_sell_value - row['Brok_Amt']  # Deduct sell-side brokerage
                        net_sell_price_per_unit = adjusted_sell_value / sell_qty  # Adjusted sell price per unit

                        # Process the sell quantity using FIFO
                        while sell_qty > 0 and buy_stack:
                            buy_transaction = buy_stack[0]
                            buy_qty = buy_transaction['Qty']

                            if buy_qty <= sell_qty:
                                matched_qty = buy_qty
                                buy_stack.pop(0)  # Remove the buy transaction from the stack
                            else:
                                matched_qty = sell_qty
                                buy_transaction['Qty'] -= sell_qty  # Update remaining buy quantity

                            # Calculate holding period in days
                            holding_period_days = (sell_date - buy_transaction['Buy_Date']).days

                            # Calculate log return
                            if buy_transaction['Buy_Price'] > 0:
                                log_return = np.log(net_sell_price_per_unit / buy_transaction['Buy_Price'])
                            else:
                                log_return = 0  # Avoid division by zero


                            # Calculate simple return
                            if buy_transaction['Buy_Price'] > 0:
                                simple_return = (net_sell_price_per_unit - buy_transaction['Buy_Price']) / buy_transaction['Buy_Price']
                            else:
                                simple_return = 0  # Avoid division by zero



                            # Append the result
                            results.append({
                                'Scrip_Name': stock,
                                'Buy_Date': buy_transaction['Buy_Date'],
                                'Sell_Date': sell_date,
                                'Qty': matched_qty,
                                'Buy_Price': buy_transaction['Buy_Price'],  # Adjusted buy price with buy-side brokerage
                                'Sell_Price': sell_price,  # Original sell price per unit (for reference)
                                'Net_Sell_Price': net_sell_price_per_unit,  # Adjusted sell price after deducting sell-side brokerage
                                'Holding_Period_Days': holding_period_days,
                                'Log_Return': log_return,  # Log return
                                'Simple_Return': simple_return,  # simple returns
                                'Buy_Brokerage': buy_transaction['Buy_Brokerage'],  # Buy-side brokerage
                                'Sell_Brokerage': row['Brok_Amt'],  # Sell-side brokerage
                            })

                            # Reduce the sell quantity
                            sell_qty -= matched_qty

            # Create a DataFrame from the results
            returns_df = pd.DataFrame(results)

            # Calculate the Net Return for each transaction
            returns_df['Net_Return'] = (returns_df['Net_Sell_Price'] - returns_df['Buy_Price']) / returns_df['Buy_Price']

            # Ensure NaN or infinite values are handled
            returns_df['Net_Return'] = returns_df['Net_Return'].replace([np.inf, -np.inf], np.nan).fillna(0)

            # Group by Scrip_Name and calculate the mean net return for each stock
            performance_summary = returns_df.groupby('Scrip_Name')['Net_Return'].mean().reset_index()

            performance_summary['Scrip_Name'] = performance_summary['Scrip_Name'].str.title()

            # Sort the stocks by mean net return
            performance_summary = performance_summary.sort_values(by='Net_Return', ascending=False)


            # Define categorization thresholds

            current_inflation_rate = 0.0431

            performance_summary['Inflation_returns'] = performance_summary['Net_Return'] - current_inflation_rate

            fd_rate = 0.07
            mf_rate = 0.15

            adjusted_fd_rate = fd_rate - current_inflation_rate
            adjusted_mf_rate = mf_rate - current_inflation_rate


            def categorize_swot_fd_nominal(net_return):
                if net_return > fd_rate:
                    return 'Strengths'
                elif fd_rate > net_return > 0.05:
                    return 'Opportunities'
                elif 0 < net_return <= 0.05:
                    return 'Weaknesses'
                else:
                    return 'Threats'


            def categorize_swot_fd_adjusted(net_return):
                adjusted_fd_rate = fd_rate - current_inflation_rate  # Adjust FD rate for inflation
                if net_return > fd_rate:
                    return 'Strengths'
                elif fd_rate > net_return > adjusted_fd_rate:
                    return 'Opportunities'
                elif 0 < net_return <= adjusted_fd_rate:
                    return 'Weaknesses'
                else:
                    return 'Threats'


            def categorize_swot_mf_nominal(net_return):
                if net_return > mf_rate:
                    return 'Strengths'
                elif mf_rate > net_return > 0.09:
                    return 'Opportunities'
                elif 0 < net_return <= 0.09:
                    return 'Weaknesses'
                else:
                    return 'Threats'


            def categorize_swot_mf_adjusted(net_return):
                adjusted_mf_rate = mf_rate - current_inflation_rate  # Adjust MF rate for inflation
                if net_return > mf_rate:
                    return 'Strengths'
                elif mf_rate > net_return > adjusted_mf_rate:
                    return 'Opportunities'
                elif 0 < net_return <= adjusted_mf_rate:
                    return 'Weaknesses'
                else:
                    return 'Threats'

            # Generate separate SWOT categories for FD and MF rates
            performance_summary['SWOT_Category_FD'] =performance_summary['SWOT_Category_FD_Nominal'] = performance_summary['Net_Return'].apply(categorize_swot_fd_nominal)
            performance_summary['SWOT_Category_FD_Adjusted'] = performance_summary['Inflation_returns'].apply(categorize_swot_fd_adjusted)

            performance_summary['SWOT_Category_MF_Nominal'] = performance_summary['Net_Return'].apply(categorize_swot_mf_nominal)
            performance_summary['SWOT_Category_MF_Adjusted'] = performance_summary['Inflation_returns'].apply(categorize_swot_mf_adjusted)


            # Define the text positions for each SWOT category
            swot_positions = {
                'Strengths': [-9, 10.5],      # Upper-left for Strengths
                'Opportunities': [1, 10.5],   # Upper-right for Opportunities
                'Threats': [1, -2],       # Bottom-right for Threats
                'Weaknesses': [-9, -2],     # Bottom-left for Weaknesses
            }

            # Initialize lists to hold positions, text, colors, and text colors
            x_positions = []
            y_positions = []
            texts = []
            text_colors = []  # New list for text colors
            hover_texts = []  # List to store hover information

            # Define color mapping for SWOT categories (background colors)
            color_mapping = {
                'Strengths': 'rgba(0, 185, 229,1)',   # Light blue for Strengths
                'Opportunities': 'rgba(56, 212, 48,1)',# Light green for Opportunities
                'Threats': 'rgba(227, 232, 43,1)', # Light yellow for Weaknesses
                'Weaknesses': 'rgba(237, 57, 2,1)'       # Light red for Threats
                }

            # Define text colors for each SWOT category
            text_color_mapping = {
                'Strengths': 'black',       # White text for Strengths (dark background)
                'Weaknesses': 'black',      # Black text for Weaknesses (light background)
                'Opportunities': 'black',   # White text for Opportunities (dark background)
                'Threats': 'black'          # White text for Threats (dark background)
            }

            # Generate elements for the plot based on the selected SWOT categories
            def generate_swot_elements(performance_summary, category_column):
                x_positions, y_positions, texts, hover_texts = [], [], [], []
                for category, position in swot_positions.items():
                    category_data = performance_summary[performance_summary[category_column] == category]
                    x_base, y_base = position
                    for i, (_, row) in enumerate(category_data.iterrows(), start=1):
                        y_positions.append(y_base - i * 0.5)  # Adjust y-position for stacking
                        x_positions.append(x_base)
                        net_return_percent = row['Net_Return'] * 100
                        texts.append(f"{i}. {row['Scrip_Name']} - {net_return_percent:.2f}%")
                        hover_texts.append(f"{row['Scrip_Name']}, Avg Net Return: {net_return_percent:.2f}%")
                return x_positions, y_positions, texts, hover_texts


            # Generate SWOT data based on current dropdown selections
            def generate_swot_data(performance_summary, rate_type, inflation_adjusted):
                """
                Generate SWOT positions, text, and hover text based on selected dropdown options.
                """
                if inflation_adjusted:
                    category_column = 'SWOT_Category_{}_Inflation'.format(rate_type)
                else:
                    category_column = 'SWOT_Category_{}'.format(rate_type)

                return generate_swot_elements(performance_summary, category_column)

            # Initialize default settings
            default_rate_type = 'FD'  # Options: 'FD' or 'MF'
            default_inflation_adjusted = False  # Options: True or False

            # Generate initial plot data
            x_positions, y_positions, texts, hover_texts = generate_swot_data(performance_summary, default_rate_type,
                                                                            default_inflation_adjusted)

            # Create the SWOT matrix plot
            fig = go.Figure()

            # Add background shapes for each quadrant
            fig.add_shape(type="line", x0=0, y0=-12, x1=0, y1=12, line=dict(color="Black", width=2)),
            # Horizontal line separating top and bottom quadrants
            fig.add_shape(type="line", x0=-10, y0=0, x1=10, y1=0, line=dict(color="Black", width=2)),
            # Background color for each quadrant
            fig.add_shape(type="rect", x0=0, y0=0, x1=10, y1=12, fillcolor=color_mapping['Opportunities'], line=dict(width=0), layer='below')
            fig.add_shape(type="rect", x0=-10, y0=0, x1=0, y1=12, fillcolor=color_mapping['Strengths'], line=dict(width=0), layer='below')
            fig.add_shape(type="rect", x0=0, y0=-12, x1=10, y1=0, fillcolor=color_mapping['Weaknesses'], line=dict(width=0), layer='below')
            fig.add_shape(type="rect", x0=-10, y0=-12, x1=0, y1=0, fillcolor=color_mapping['Threats'], line=dict(width=0), layer='below')

            # Customize the layout
            fig.update_layout(
                # title_text="SWOT Analysis: Stock Performance",
                showlegend=False,
                xaxis=dict(visible=False),  # Hide x-axis
                yaxis=dict(visible=False),  # Hide y-axis
                height=850,
                # width=1000,
                annotations=[
                    dict(x=-5, y=11, text="Strengths", showarrow=False,
                        font=dict(size=28, color="black", family="Times New Roman, Bold")),
                    dict(x=5, y=11, text="Opportunities", showarrow=False,
                        font=dict(size=28, color="black", family="Times New Roman, Bold")),
                    dict(x=-5, y=-1, text="Weaknesses", showarrow=False,
                        font=dict(size=28, color="black", family="Times New Roman, Bold")),
                    dict(x=5, y=-1, text="Threats", showarrow=False,
                        font=dict(size=28, color="black", family="Times New Roman, Bold")),
                ]
            )

            # Function to generate the correct category based on both dropdown selections
            def generate_combined_data(rate_type, adjustment_type):
                """
                Generate x, y, text, and hovertext based on the combined state of the two dropdowns.
                """
                category_column = f"SWOT_Category_{rate_type}_{adjustment_type}"
                return generate_swot_elements(performance_summary, category_column)

            # Initial plot data (default state)
            current_rate_type = "FD"  # Default rate type
            current_adjustment_type = "Nominal"  # Default adjustment type
            x_positions, y_positions, texts, hover_texts = generate_combined_data(current_rate_type, current_adjustment_type)

            fig.add_trace(go.Scatter(
                x=x_positions,
                y=y_positions,
                mode='text',
                text=texts,
                hovertext=hover_texts,
                hoverinfo='text',
                textfont=dict(size=17, color="black", family="Times New Roman"),
                textposition='middle right',
            ))

            # Dropdown definitions
            fig.update_layout(
                updatemenus=[
                    # Dropdown for Rate Type (FD vs. MF)
                    dict(
                        buttons=[
                            dict(
                                label="FD Rates",
                                method="update",  # Use 'update' instead of 'restyle' for full layout update
                                args=[{
                                    'x': [generate_combined_data('FD', current_adjustment_type)[0]],
                                    'y': [generate_combined_data('FD', current_adjustment_type)[1]],
                                    'text': [generate_combined_data('FD', current_adjustment_type)[2]],
                                    'hovertext': [generate_combined_data('FD', current_adjustment_type)[3]],
                                }],
                            ),
                            dict(
                                label="Mutual Fund Rates",
                                method="update",
                                args=[{
                                    'x': [generate_combined_data('MF', current_adjustment_type)[0]],
                                    'y': [generate_combined_data('MF', current_adjustment_type)[1]],
                                    'text': [generate_combined_data('MF', current_adjustment_type)[2]],
                                    'hovertext': [generate_combined_data('MF', current_adjustment_type)[3]],
                                }],
                            ),
                        ],
                        direction="down",
                        x=0.775,
                        y=1.1,
                        xanchor="left",
                        yanchor="top",
                    ),
                    # Dropdown for Adjustment Type (Nominal vs. Inflation-Adjusted)
                    dict(
                        buttons=[
                            dict(
                                label="Nominal",
                                method="update",
                                args=[{
                                    'x': [generate_combined_data(current_rate_type, 'Nominal')[0]],
                                    'y': [generate_combined_data(current_rate_type, 'Nominal')[1]],
                                    'text': [generate_combined_data(current_rate_type, 'Nominal')[2]],
                                    'hovertext': [generate_combined_data(current_rate_type, 'Nominal')[3]],
                                }],
                            ),
                            dict(
                                label="Inflation-Adjusted",
                                method="update",
                                args=[{
                                    'x': [generate_combined_data(current_rate_type, 'Adjusted')[0]],
                                    'y': [generate_combined_data(current_rate_type, 'Adjusted')[1]],
                                    'text': [generate_combined_data(current_rate_type, 'Adjusted')[2]],
                                    'hovertext': [generate_combined_data(current_rate_type, 'Adjusted')[3]],
                                }],
                            ),
                        ],
                        direction="down",
                        x=1.0,
                        y=1.1,
                        xanchor="left",
                        yanchor="top",
                    )
                ]
            )

            # Convert to JSON
            fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
            
            return {
                "figure": fig_dict               
                  }
    

        except Exception as e:           
            return json.dumps({"error": str(e)})
        



    @staticmethod
    # use portfolio data 
    def create_best_trade_plot(portfolio_fifo_results_df):

        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is


        try:
            
            portfolio_fifo_results_df.rename(columns={
                'Deployed_Amount': 'Deployed Amount',
                'Brokerage_Amount': 'Brokerage Amount',
                'Realized_PNL': 'Realized PNL',
                'Unrealized_%_Return': 'Unrealized % Return'
            }, inplace=True)
            
            current_inflation_rate = 6.21  # Adjust the current inflation rate here

            portfolio_fifo_results_df_copy = portfolio_fifo_results_df.reset_index()

            # Convert Unrealized % Return to numeric
            portfolio_fifo_results_df_copy['Unrealized % Return'] = portfolio_fifo_results_df_copy['Unrealized % Return'].str.replace(' %', '').astype(float)

            # Fill NaNs in relevant columns with 0 or appropriate value
            portfolio_fifo_results_df_copy['Realized PNL'].fillna(0, inplace=True)
            portfolio_fifo_results_df_copy['Unrealized % Return'].fillna(0, inplace=True)

            
            portfolio_fifo_results_df_copy['Realized PNL'] = pd.to_numeric(portfolio_fifo_results_df_copy['Realized PNL'], errors='coerce')
            portfolio_fifo_results_df_copy['Unrealized % Return'] = pd.to_numeric(portfolio_fifo_results_df_copy['Unrealized % Return'], errors='coerce')

            # Adjust returns for inflation
            portfolio_fifo_results_df_copy['Realized PNL Adjusted'] = portfolio_fifo_results_df_copy['Realized PNL'] - (portfolio_fifo_results_df_copy['Realized PNL'] * current_inflation_rate / 100)
            portfolio_fifo_results_df_copy['Unrealized % Return Adjusted'] = portfolio_fifo_results_df_copy['Unrealized % Return'] - current_inflation_rate

            scrips = portfolio_fifo_results_df_copy['Scrip'].unique()
            priors = {scrip: 1 / len(scrips) for scrip in scrips}

            # Define Good performance criteria for both nominal and inflation-adjusted metrics
            portfolio_fifo_results_df_copy['Good Performance Nominal'] = (
                (portfolio_fifo_results_df_copy['Realized PNL'] > 0) &
                (portfolio_fifo_results_df_copy['Unrealized % Return'] > 0)
            )

            portfolio_fifo_results_df_copy['Good Performance Adjusted'] = (
                (portfolio_fifo_results_df_copy['Realized PNL Adjusted'] > 0) &
                (portfolio_fifo_results_df_copy['Unrealized % Return Adjusted'] > 0)
            )

            # Calculate probabilities for both nominal and adjusted data
            def calculate_probabilities(good_performance_col):
                evidence_prob = portfolio_fifo_results_df_copy[good_performance_col].mean()
                if evidence_prob == 0:
                    return {scrip: 0 for scrip in scrips}  # Handle division by zero by returning zero probabilities

                likelihoods = {
                    scrip: portfolio_fifo_results_df_copy[portfolio_fifo_results_df_copy['Scrip'] == scrip][good_performance_col].mean()
                    for scrip in scrips
                }
                posteriors = {
                    scrip: (likelihoods[scrip] * priors[scrip]) / evidence_prob
                    for scrip in scrips
                }
                return posteriors

            best_trades_nominal = calculate_probabilities('Good Performance Nominal')
            best_trades_adjusted = calculate_probabilities('Good Performance Adjusted')

            # Check if all probabilities are zero
            if all(p == 0 for p in best_trades_nominal.values()) and all(p == 0 for p in best_trades_adjusted.values()):
                # Create a simple message box plot
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=[0.5], y=[0.5],  # Center the text
                    text=["There are no good trades in your portfolio"],
                    mode="text",
                    textfont=dict(size=20),
                    showlegend=False,
                    hoverinfo='skip'
                ))
                fig.update_layout(
                    xaxis=dict(showticklabels=False, showgrid=False, zeroline=False),
                    yaxis=dict(showticklabels=False, showgrid=False, zeroline=False),
                    template="plotly_white",
                    height=400
                )
            else:
                # Proceed with the normal plotting
                best_trades_nominal = sorted(best_trades_nominal.items(), key=lambda x: x[1])
                best_trades_adjusted = sorted(best_trades_adjusted.items(), key=lambda x: x[1])

                scrips_nominal, probabilities_nominal = zip(*best_trades_nominal)
                scrips_adjusted, probabilities_adjusted = zip(*best_trades_adjusted)

                # Create the plot with toggle button
                fig = go.Figure()

                # Add Nominal Data
                fig.add_trace(
                    go.Bar(
                        x=probabilities_nominal,
                        y=scrips_nominal,
                        orientation='h',
                        marker=dict(color='blue'),
                        name="Nominal",
                        text=[f"{p:.2%}" for p in probabilities_nominal],
                        textposition='outside',
                        visible=True,
                    )
                )

                # Add Inflation-Adjusted Data
                fig.add_trace(
                    go.Bar(
                        x=probabilities_adjusted,
                        y=scrips_adjusted,
                        orientation='h',
                        marker=dict(color='green'),
                        name="Inflation-Adjusted",
                        text=[f"{p:.2%}" for p in probabilities_adjusted],
                        textposition='outside',
                        visible=False,
                    )
                )

                # Update layout with buttons for toggling
                fig.update_layout(
                    updatemenus=[
                        dict(
                            type="dropdown",
                            buttons=[
                                dict(
                                    label="Nominal",
                                    method="update",
                                    args=[
                                        {"visible": [True, False]},  # Show Nominal, Hide Adjusted
                                        {"title": "Best Trades (Nominal Returns)"}
                                    ]
                                ),
                                dict(
                                    label="Inflation-Adjusted",
                                    method="update",
                                    args=[
                                        {"visible": [False, True]},  # Show Adjusted, Hide Nominal
                                        {"title": "Best Trades (Inflation-Adjusted Returns)"}
                                    ]
                                )
                            ],
                            direction="down",
                            showactive=True,
                            x=1.0,  # Adjust for right alignment
                            xanchor="right",
                            y=1.1,  # Position slightly above the plot
                            yanchor="top",
                        )
                    ],
                    title=dict(text="Best Trades (Nominal Returns)", x=0.5),
                    xaxis_title="Probability (%)",
                    yaxis_title="Scrips",
                    xaxis_tickformat=".1%",
                    template="plotly_white",
                    height=600
                )
                # Convert to JSON
                fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
                
                return {
                    "figure": fig_dict               
                    }
        

        except Exception as e:           
            return json.dumps({"error": str(e)})
        
 
    
    def create_industry_sunburst(portfolio_fifo_results_df):
        
        def convert_to_serializable(obj):
            """Helper function to convert non-serializable objects to JSON-serializable formats."""
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  
            
            
        try:
            # transaction_tab['Trade_Date'] = pd.to_datetime(transaction_tab['Trade_Date'])
            portfolio_fifo_results_df['Remaining_Qty'] = pd.to_numeric(portfolio_fifo_results_df['Remaining_Qty'], errors='coerce')

            warnings_list = []  # Store warnings here
            
            # Convert 'Date' column to datetime
            portfolio_fifo_results_df['Date'] = pd.to_datetime(portfolio_fifo_results_df['Date'])
            
            # Get latest available date
            latest_date = portfolio_fifo_results_df['Date'].max()
            latest_data = portfolio_fifo_results_df[portfolio_fifo_results_df['Date'] == latest_date]
            filtered_latest_data = latest_data[latest_data['Remaining_Qty'] > 0]
            # Database Connection
            conn, cursor = DBHandler.get_connection()
            mkt_db = MktDB(conn, cursor)
    
            # Fetch industry data from DB instead of CSV
            industry_data_with_returns = pd.read_csv(r'src/main/resources/data/Industry_data_with_returns.csv')
    
            top_symbols_data = []
    
            for symbol in filtered_latest_data['Symbol']:
                industry_row = industry_data_with_returns[industry_data_with_returns['Symbol'] == symbol]
                
                if industry_row.empty:
                    warnings_list.append(f"No industry data found for symbol {symbol}. Skipping...")
                    continue
                
                industry = industry_row['Basic_Industry'].values[0]
                industry_symbols = industry_data_with_returns[industry_data_with_returns['Basic_Industry'] == industry]['Symbol'].tolist()
    
                # Fetch stock data for all symbols in the industry
                stock_data = mkt_db.fetch_historical_data(symbols=industry_symbols, start_date="2023-01-01", end_date="2024-01-01")
    
                if stock_data.empty:
                    warnings_list.append(f"No stock data found for industry {industry}. Skipping...")
                    continue
    
                unrealized_pnl_data = []
                remaining_qty = filtered_latest_data.loc[filtered_latest_data['Symbol'] == symbol, 'Remaining_Qty'].values[0]
    
                for ind_symbol in industry_symbols:
                    stock_df = stock_data[stock_data['Symbol'] == ind_symbol].copy()
    
                    if stock_df.empty:
                        warnings_list.append(f"No data found for symbol {ind_symbol} in DB")
                        continue
    
                    stock_df['Date'] = pd.to_datetime(stock_df['Date'])
                    latest_record = stock_df.loc[stock_df['Date'].idxmax()]
                    latest_close = latest_record['Close']
                    latest_date = latest_record['Date']
    
                    # Get TTM price
                    ttm_date = latest_date - pd.DateOffset(years=1)
                    stock_df = stock_df.sort_values('Date')
                    
                    # Find the closest available date
                    closest_idx = (stock_df['Date'] - ttm_date).abs().idxmin()
                    ttm_open_price = stock_df.loc[closest_idx, 'Open']
    
                    # Calculate Unrealized PNL & % Return
                    current_value = remaining_qty * latest_close
                    unrealized_pnl = current_value - (ttm_open_price * remaining_qty)
                    percent_change = round((unrealized_pnl / (ttm_open_price * remaining_qty)) * 100, 2)
    
                    unrealized_pnl_data.append({
                        'Industry': industry,
                        'Symbol': ind_symbol,
                        'UnrealizedPNL': unrealized_pnl,
                        'UnrealizedPercentReturn': percent_change
                    })
    
                if unrealized_pnl_data:
                    pnl_df = pd.DataFrame(unrealized_pnl_data)
                    top_symbols = pnl_df.sort_values(by='UnrealizedPNL', ascending=False).head(5)
                    top_symbols_data.extend(top_symbols.to_dict('records'))
    
            top_symbols_df = pd.DataFrame(top_symbols_data)
            top_symbols_df = top_symbols_df[top_symbols_df['UnrealizedPNL'] > 0]
    
            # Generate Sunburst Chart
            fig = px.sunburst(
                top_symbols_df,
                path=['Industry', 'Symbol'],
                values='UnrealizedPercentReturn',
                title="Top 5 Symbols per Industry by Unrealized PNL (TTM)",
                color='Symbol',
            )
    
            fig.update_traces(
                hovertemplate=[
                    "<b>%{label}</b><br>Unrealized PNL = %{customdata:.2f}<br>Unrealized % Return = %{value:.2f}%<br>%{parent}<extra></extra>"
                    if not pd.isna(row['Symbol']) else 
                    "<b>%{label}</b><br>Unrealized % Return = %{value:.2f}%<br>%{parent}<extra></extra>"
                    for _, row in top_symbols_df.iterrows()
                ],
                customdata=top_symbols_df['UnrealizedPNL'].to_numpy()
            )
    
            fig.update_layout(coloraxis_showscale=False, height=600)
    
            # Convert figure to JSON serializable format
            fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
    
            return {"figure": fig_dict}  # Return warnings properly
    
        except Exception as e:
            return {"error": str(e)}  # Ensure proper JSON error format
   

    def create_user_sunburst_with_dropdown(df):
        
        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is

        """
        Generate a sunburst plot with dropdown menu for different aggregated metrics, 
        based on specific conditions:
        - Only show positive Realized PNL in the sunburst plot.
        - Do not show Brokerage Amount in the dropdown if its total sum is 0.
        - Always include Deployed Amount, even with negative or zero values.
        """

        industry_data_with_returns = pd.read_csv(r'src/main/resources/data/Industry_data_with_returns.csv')
        
        df.rename(columns={
            'Deployed_Amount': 'Deployed Amount',
            'Brokerage_Amount': 'Brokerage Amount',
            'Realized_PNL': 'Realized PNL',
            'Unrealized_PNL': 'Unrealized PNL'
        }, inplace=True)


        # Step 1: Aggregate data
        unique_symbols = df['Symbol'].unique()
        aggregated_data = df[df['Symbol'].isin(unique_symbols)].groupby('Symbol').agg({
            'Unrealized PNL': 'sum',
            'Realized PNL': 'sum',
            'Brokerage Amount': 'sum',
            'Deployed Amount': 'sum'
        }).reset_index()

        # Step 2: Merge DataFrames
        merged_df = pd.merge(aggregated_data, industry_data_with_returns, on='Symbol', how='left')
        merged_df['Industry'] = merged_df['Industry'].fillna('Not Known')
        merged_df['Basic_Industry'] = merged_df['Basic_Industry'].fillna('Not Known')

        # Step 3: Create Sunburst Plots Conditionally
        figures = {}
        metrics = ['Realized PNL', 'Brokerage Amount', 'Deployed Amount']
        
        merged_df['Realized PNL'] = pd.to_numeric(merged_df['Realized PNL'], errors='coerce')
        merged_df['Brokerage Amount'] = pd.to_numeric(merged_df['Brokerage Amount'], errors='coerce')
        merged_df['Deployed Amount'] = pd.to_numeric(merged_df['Deployed Amount'], errors='coerce')
        
        # For Realized PNL: Filter to include only positive values
        positive_pnl_df = merged_df[merged_df['Realized PNL'] > 0]
        figures['Realized PNL'] = px.sunburst(
            positive_pnl_df,
            path=['Industry', 'Basic_Industry', 'Symbol'],
            values='Realized PNL',
            title="Sunburst Chart for Realized PNL",
            color='Symbol',
            color_discrete_sequence=px.colors.qualitative.Alphabet
        )

        # For Brokerage Amount: Only create chart if the sum > 0
        if merged_df['Brokerage Amount'].sum() > 0:
            figures['Brokerage Amount'] = px.sunburst(
                merged_df,
                path=['Industry', 'Basic_Industry', 'Symbol'],
                values='Brokerage Amount',
                title="Sunburst Chart for Brokerage Amount",
                color='Symbol',
                color_discrete_sequence=px.colors.qualitative.Alphabet
            )

        # For Deployed Amount: Include all data regardless of conditions
        figures['Deployed Amount'] = px.sunburst(
            merged_df,
            path=['Industry', 'Basic_Industry', 'Symbol'],
            values='Deployed Amount',
            title="Sunburst Chart for Deployed Amount",
            color='Symbol',
            color_discrete_sequence=px.colors.qualitative.Alphabet
        )

        # Step 4: Extract Data Traces for Each Metric
        data_traces = []
        for i, metric in enumerate(metrics):
            if metric in figures:  # Add only if the figure was created
                for trace in figures[metric].data:
                    trace.visible = (i == 0)  # Make only the first plot visible by default
                    data_traces.append(trace)

        # Step 5: Create the Figure with All Data Traces
        fig = go.Figure(data=data_traces)

        # Step 6: Add Dropdown Menu Dynamically
        buttons = []
        current_index = 0
        for metric in metrics:
            if metric in figures:  # Add dropdown option only if the figure exists
                num_traces = len(figures[metric].data)
                visible = [False] * len(data_traces)
                for j in range(num_traces):
                    visible[current_index + j] = True
                buttons.append(dict(label=metric,
                                    method="update",
                                    args=[{"visible": visible},
                                        {"title": f"Sunburst Chart for {metric}"}]))
                current_index += num_traces

        # Add dropdown menu to the figure
        fig.update_layout(
            updatemenus=[{
                "buttons": buttons,
                "direction": "down",
                "showactive": True,
                'x': 1.2,
                'xanchor': 'right',
                'y': 1.2,
                'yanchor': 'top'
            }]
        )

        fig.update_layout(height=600) 


        # Convert to JSON
        fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))

        return {
            "figure": fig_dict               
            }




    # @staticmethod
    # # use portfolio data
    # def create_user_sunburst_with_dropdown(df):
    #
    #
    #     def convert_to_serializable(obj):
    #         if isinstance(obj, (np.ndarray, pd.Series)):
    #             return obj.tolist()  # Convert NumPy array to list
    #         elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
    #             return obj.isoformat()  # Convert datetime to string
    #         elif isinstance(obj, dict):
    #             return {key: convert_to_serializable(value) for key, value in obj.items()}
    #         elif isinstance(obj, list):
    #             return [convert_to_serializable(item) for item in obj]
    #         else:
    #             return obj  # Return other types as-is
    #
    #
    #     try:
    #         """
    #         Generate a sunburst plot with dropdown menu for different aggregated metrics.
    #
    #         Parameters:
    #         - df: DataFrame containing the original data.
    #         - industry_data_with_returns: DataFrame containing industry information for each symbol.
    #
    #         Returns:
    #         - fig: Plotly figure object with the sunburst plot and dropdown menu.
    #         """
    #
    #         industry_data_with_returns = pd.read_csv(r'src/main/resources/data/Industry_data_with_returns.csv')
    #
    #
    #         # Aggregate data
    #         unique_symbols = df['Symbol'].unique()
    #         aggregated_data = df[df['Symbol'].isin(unique_symbols)].groupby('Symbol').agg({
    #             'Unrealized PNL': 'sum',
    #             'Realized PNL': 'sum',
    #             'Brokerage Amount': 'sum',
    #             'Deployed Amount': 'sum'
    #         }).reset_index()
    #
    #         # Merge DataFrames
    #         merged_df = pd.merge(aggregated_data, industry_data_with_returns, on='Symbol', how='left')
    #
    #         # Create Sunburst Plots
    #         figures = {}
    #         metrics = ['Realized PNL', 'Brokerage Amount', 'Deployed Amount']
    #
    #         for metric in metrics:
    #             figures[metric] = px.sunburst(
    #                 merged_df,
    #                 path=['Industry', 'Basic_Industry', 'Symbol'],
    #                 values=metric,
    #                 title=f"Sunburst Chart for {metric}",
    #                 color='Symbol',
    #             )
    #
    #             # # Add conditional hover template
    #             # figures[metric].update_traces(
    #             #     hovertemplate=[ "<b>%{label}</b>" if lev in merged_df['Industry'].values else
    #             #                 ("<b>%{label}</b>" if lev in merged_df['Basic_Industry'].values else
    #             #                     ("<b>%{label}</b><br>Industry: %{parent}<br>Basic Industry: %{customdata[0]}<br>Value: %{value:.2f}" if lev in merged_df['Symbol'].values else ""))
    #             #                 for lev in merged_df['Industry'].values + merged_df['Basic_Industry'].values + merged_df['Symbol'].values ],
    #             #                     customdata=merged_df[['Basic_Industry']].to_numpy())
    #
    #             figures[metric].update_layout(coloraxis_showscale=False)
    #
    #         # Extract data traces from each figure
    #         data_traces = []
    #         for i, metric in enumerate(metrics):
    #             for trace in figures[metric].data:
    #                 trace.visible = (i == 0)  # Make only the first plot visible by default
    #                 data_traces.append(trace)
    #
    #         # Create the figure with all data traces
    #         fig = go.Figure(data=data_traces)
    #
    #         # Add Dropdown Menu
    #         buttons = []
    #         num_traces_per_metric = len(figures[metrics[0]].data)
    #         for i, metric in enumerate(metrics):
    #             visible = [False] * len(data_traces)
    #             for j in range(num_traces_per_metric):
    #                 visible[i * num_traces_per_metric + j] = True
    #             buttons.append(dict(label=metric,
    #                                 method="update",
    #                                 args=[{"visible": visible},
    #                                     {"title": f"Sunburst Chart for {metric}"}]))
    #
    #         # Add dropdown menu
    #         fig.update_layout(
    #             updatemenus=[{
    #                 "buttons": buttons,
    #                 "direction": "down",
    #                 "showactive": True,
    #                 'x':1.0,  # Adjust for right alignment
    #                 'xanchor':"right",
    #                 'y':1.1,  # Position slightly above the plot
    #                 'yanchor':"top",
    #             }]
    #         )
    #
    #         fig.update_layout(height=600)  # Hide color scale
    #
    #         # Convert to JSON
    #         fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
    #
    #         return {
    #             "figure": fig_dict               
    #             }
    #
    #
    #     except Exception as e:           
    #         return json.dumps({"error": str(e)})
    #



    @staticmethod
    # use portfolio data
    def generate_combined_bubble_chart(portfolio_df):

        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is


        try:
            
            portfolio_df.rename(columns={
                'Deployed_Amount': 'Deployed Amount',
                'Brokerage_Amount': 'Brokerage Amount',
                'Realized_PNL': 'Realized PNL',
                'Unrealized_PNL': 'Unrealized PNL',
                'Remaining_Qty' : 'Remaining Qty'
            }, inplace=True)
            
            portfolio_df.reset_index(inplace = True)

            industry_data = pd.read_csv(r'src/main/resources/data/Industry_data_with_returns.csv')
            pe_data = pd.read_csv(r'src/main/resources/data/pe_data.csv')

            industry_data_with_returns = pd.merge(industry_data,pe_data,on='Symbol',how='left')

            # Ensure 'Symbol' is a string in both DataFrames
            industry_data_with_returns['Symbol'] = industry_data_with_returns['Symbol'].astype(str)
            portfolio_df['Symbol'] = portfolio_df['Symbol'].astype(str)
            
            
            

            # First Bubble Chart
            def generate_bubble_chart(industry_data_with_returns, portfolio_df):
                industry_data_with_returns = industry_data_with_returns.dropna(subset=['trailingPE', 'bookValue'])

                unique_symbols = portfolio_df['Symbol'].unique()
                unique_industries = industry_data_with_returns[industry_data_with_returns['Symbol'].isin(unique_symbols)]['Basic_Industry'].unique()
                filtered_data = industry_data_with_returns[industry_data_with_returns['Basic_Industry'].isin(unique_industries)]
                
                # filtered_data['bookValue'] = filtered_data['bookValue'].astype('int')
                filtered_data = filtered_data[filtered_data['bookValue'] > 0]

                top_symbols_by_industry = filtered_data.groupby('Basic_Industry', group_keys=False).apply(
                    lambda df: df.nlargest(10, 'bookValue')
                ).reset_index(drop=True)
                

                # Create the bubble chart
                fig1 = px.scatter(
                    top_symbols_by_industry,
                    x='trailingPE',
                    y='bookValue',
                    size='bookValue',
                    color='Symbol',
                    hover_name='Symbol',
                    labels={
                        'trailingPE': 'PE Ratio',
                        'bookValue': 'Book Value',
                    },
                    color_discrete_sequence=px.colors.qualitative.Alphabet
                )

                # Add update menus for industries
                industries = top_symbols_by_industry['Basic_Industry'].unique()
                update_buttons = [
                    {
                        "label": industry,
                        "method": "update",
                        "args": [
                            {"visible": (top_symbols_by_industry['Basic_Industry'] == industry).tolist() + [False] * len(top_symbols_by_industry)},
                            {"title": f"Industry Bubble Chart - {industry}"}
                        ],
                    }
                    for industry in industries
                ]

                fig1.update_layout(
                    template='plotly_white',
                    updatemenus=[
                        {
                            "buttons": update_buttons,
                            "direction": "down",
                            "showactive": True,
                            "x": 1.3,
                            "xanchor": "right",
                            "y": 1.1,
                            "yanchor": "top",
                        }
                    ]
                )

                max_book_value = top_symbols_by_industry['bookValue'].max()
                fig1.update_traces(marker=dict(sizemode='area', sizeref=2.*max_book_value/(250.**2)))
                return fig1

            # Second Bubble Chart
            def plot_bubble_chart(portfolio_df, industry_data_with_returns):
                
                portfolio_df['Date'] = pd.to_datetime(portfolio_df['Date'])
                latest_date = portfolio_df['Date'].max()
                latest_data = portfolio_df[portfolio_df['Date'] == latest_date]
                
                latest_data['Remaining Qty'] = pd.to_numeric(latest_data['Remaining Qty'], errors='coerce')
                
                filtered_latest_data = latest_data[latest_data['Remaining Qty'] > 0]
                

                merged_df = pd.merge(filtered_latest_data, industry_data_with_returns[['Symbol', 'trailingPE', 'bookValue']], on='Symbol', how='left')
                fig2 = px.scatter(
                    merged_df,
                    x='trailingPE',
                    y='bookValue',
                    size='Remaining Qty',
                    hover_name='Symbol',
                    title='Bubble Chart of PE vs Book Value',
                    labels={'trailingPE': 'PE Ratio', 'bookValue': 'Book Value'},
                    color='Symbol',
                    size_max=100,
                    template='plotly_white'
                )
                return fig2

            # Generate individual plots
            fig1 = generate_bubble_chart(industry_data_with_returns, portfolio_df)
            fig2 = plot_bubble_chart(portfolio_df, industry_data_with_returns)

            # Combine plots with dropdown
            combined_fig = Figure()

            # Add traces from both figures to the combined figure
            for trace in fig1.data:
                combined_fig.add_trace(trace)
            for trace in fig2.data:
                combined_fig.add_trace(trace)

            # Adjust visibility: Show fig1 by default, hide fig2
            for trace in fig1.data:
                trace.visible = True
            for trace in fig2.data:
                trace.visible = False

            combined_fig.update_layout(
                template = 'plotly_white',
                height = 600,
                title={
        #             'text': "Your Chart Title",
                    'x': 0.5,  # Center horizontally
                    'y': 0.9,  # Adjust vertical position
                    'xanchor': 'center',
                    'yanchor': 'top',
                    'font':{'size':26},
                },

                xaxis_title="PE Ratio",
                yaxis_title="Book Value",

                updatemenus=[
                    # Top-level dropdown for switching between plots
                    {
                        "buttons": [
                            {
                                "label": "Industry Bubble Chart",
                                "method": "update",
                                "args": [
                                    {"visible": [True] * len(fig1.data) + [False] * len(fig2.data)},
                                    {"title": "Industry Bubble Chart"}
                                ],
                            },
                            {
                                "label": "Current Holding Bubble Chart",
                                "method": "update",
                                "args": [
                                    {"visible": [False] * len(fig1.data) + [True] * len(fig2.data)},
                                    {"title": "Current Holding Bubble Chart"}
                                ],
                            },
                        ],
                        "direction": "down",
                        "showactive": True,
                        "x": 0,
                        "xanchor": "left",
                        "y": 1.1,
                        "yanchor": "top",
                    },
                    # Internal dropdowns for the first plot (from fig1)
                    *fig1.layout.updatemenus  # Include fig1's dropdown menus
                ]
            )

            # Convert to JSON
            # fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
            fig_dict = json.loads(json.dumps(combined_fig.to_dict(), default=convert_to_serializable))

            
            return {
                "figure": fig_dict               
                }
    

        except Exception as e:           
            return json.dumps({"error": str(e)})
        



    @staticmethod
    # use transaction tab
    def create_invested_amount_plot(df):


        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is


        try:
            
            

            data_sheet = df.copy()
            
            data_sheet['Qty'] = pd.to_numeric(data_sheet['Qty'], errors='coerce')
            data_sheet['Mkt_Price'] = pd.to_numeric(data_sheet['Mkt_Price'], errors='coerce')
            data_sheet['Mkt_Value'] = data_sheet['Qty'] * data_sheet['Mkt_Price']

            
            data_sheet = data_sheet[data_sheet['Exchange'] != 'BSE']
            data_sheet['Trade_Date'] = pd.to_datetime(data_sheet['Trade_Date'])
            data_sheet.sort_values(by='Trade_Date',ascending=True,inplace=True)
            data_sheet['Mkt_Value'] = data_sheet['Qty'] * data_sheet['Mkt_Price']

            buy_transactions = data_sheet[data_sheet['Order_Type']=='B']

            # Group by Scrip Name and Month, then sum the Market Value
            buy_transactions['Month'] = buy_transactions['Trade_Date'].dt.to_period('M')
            turnover_df = buy_transactions.groupby(['Scrip_Name', 'Month'])['Mkt_Value'].sum().reset_index()

            # Rename the 'Mkt value' column to 'Turnover'
            turnover_df.rename(columns={'Mkt_Value': 'Turnover'}, inplace=True)


            def create_invested_table_for_all(df):

                data_sheet = df.copy()
                data_sheet['Trade_Date'] = pd.to_datetime(data_sheet['Trade_Date'])

                def create_invested_table(data_sheet1):

                    # Step 1: Group data by Scrip_Name, Order_Type, and Date to calculate aggregated values
                    avg_price = data_sheet1['Mkt_Price'].mean()

                    agged_data = (
                        data_sheet1.groupby(['Trade_Date', 'Scrip_Name', 'Order_Type'])
                        .agg({'Qty': 'sum', 'Mkt_Value': 'sum'})
                        .reset_index()
                    )

                    # Step 2: Group data by Scrip_Name to calculate net quantities and average prices
                    summary = (
                        data_sheet1.groupby(['Scrip_Name', 'Order_Type'])
                        .agg({'Qty': 'sum', 'Mkt_Value': 'sum'})
                        .unstack(fill_value=0)
                    )


                    # Adding default columns if they do not exist
                    if ('Qty', 'B') not in summary.columns:
                        summary[('Qty', 'B')] = 0
                    if ('Mkt_Value', 'B') not in summary.columns:
                        summary[('Mkt_Value', 'B')] = 0
                    if ('Qty', 'S') not in summary.columns:
                        summary[('Qty', 'S')] = 0
                    if ('Mkt_Value', 'S') not in summary.columns:
                        summary[('Mkt_Value', 'S')] = 0

                    # Flatten the column MultiIndex
                    summary.columns = [f'{lvl1}_{lvl2}' for lvl1, lvl2 in summary.columns]
                    summary.reset_index(inplace=True)


                    # Rename columns to maintain structure
                    summary = summary.rename(columns={
                        'Scrip_Name': 'Scrip_Name',
                        'Qty_B': 'Qty_Buy',
                        'Mkt_Value_B': 'MktValue_Buy',
                        'Qty_S': 'Qty_Sell',
                        'Mkt_Value_S': 'MktValue_Sell'
                    })

                    summary['Net_Qty'] = summary['Qty_Buy'] - summary['Qty_Sell']
                    summary['Avg_Buy_Price'] = avg_price

                    # Step 3: Identify short positions
                    short_positions = summary[summary['Net_Qty'] < 0]


                    # Prepare the new table (Sheet2 format)
                    transactions = []

                    # Add a "Buy" transaction for short positions if they exist
                    for scrip, row in short_positions.iterrows():
                        transactions.append({
                            'Scrip_Name': row['Scrip_Name'],
                            'Order_Type': 'B',
                            'x (Mkt_Value)': -row['Net_Qty'] * row['Avg_Buy_Price'],
                            'y(cumsum of x where sells are not considered)': 0,  # Placeholder, will update later
                            'qty': -row['Net_Qty'],
                            'Date': None
                        })

                    # Add aggregated transactions from the grouped data to the table
                    for _, row in agged_data.iterrows():
                        transactions.append({
                            'Scrip_Name': row['Scrip_Name'],
                            'Order_Type': row['Order_Type'],
                            'x (Mkt_Value)': row['Mkt_Value'] if row['Order_Type'] == 'B' else -row['Mkt_Value'],
                            'y(cumsum of x where sells are not considered)': 0,  # Placeholder, will update later
                            'qty': row['Qty'] if row['Order_Type'] == 'B' else -row['Qty'],
                            'Date': row['Trade_Date']
                        })

                    # Create a DataFrame for the new table
                    sheet2_table = pd.DataFrame(transactions)

                    # Step 4: Calculate cumulative sum of "y" column for consecutive buys only
                    y_cumsum = 0
                    for idx, row in sheet2_table.iterrows():
                        min_date = sheet2_table['Date'].min()
                        earlier_date = min_date - pd.Timedelta(days=1)
                        # Check if the prediction date is a weekend
                        if earlier_date.weekday() == 5:  # Saturday
                            earlier_date += pd.Timedelta(days=2)  # Move to Monday
                        elif earlier_date.weekday() == 6:  # Sunday
                            earlier_date += pd.Timedelta(days=1)  # Move to Monday
                        sheet2_table['Date'].fillna(earlier_date, inplace=True)

                        if row['Order_Type'] == 'B':
                            y_cumsum += row['x (Mkt_Value)']
                        else:  # Reset the cumulative sum if a sell transaction is encountered
                            y_cumsum = 0

                        if row['Order_Type'] == 'B':
                            sheet2_table.at[idx, 'y(cumsum of x where sells are not considered)'] = y_cumsum
                        else:
                            sheet2_table.at[idx, 'y(cumsum of x where sells are not considered)'] = abs(row['x (Mkt_Value)'])

                    return sheet2_table


                # Step 1: Find unique scrip names
                unique_scrips = data_sheet['Scrip_Name'].unique()

                # Step 2: Process each scrip separately and append the results
                final_results = pd.DataFrame()
                for scrip in unique_scrips:
                    filtered_data = data_sheet[data_sheet['Scrip_Name'] == scrip]
                    result = create_invested_table(filtered_data)
                    final_results = pd.concat([final_results, result])

                return final_results




            final_results = create_invested_table_for_all(data_sheet)
        #     print(final_results[final_results['Scrip_Name']=='UNIVERSAL CABLES LTD'])

            # calculate invested amount
            def calculate_monthly_invested_amount(df):
                results = []

                unique_scrips = df['Scrip_Name'].unique()

                for scrip in unique_scrips:
                    scrip_df = df[df['Scrip_Name'] == scrip]
                    scrip_df = scrip_df.sort_values(by='Date', ascending=False)

                    # Group by month
                    scrip_df['Month'] = scrip_df['Date'].dt.to_period('M')

                    grouped = scrip_df.groupby('Month')
                    invested_amounts = {}

                    last_invested_amount = 0

                    for month, group in grouped:
                        b_transactions = group[group['Order_Type'] == 'B']
                        if not b_transactions.empty:
                            latest_b_transaction = b_transactions.iloc[0]
                            last_invested_amount = latest_b_transaction['y(cumsum of x where sells are not considered)']
                        invested_amounts[month] = last_invested_amount

                    # Forward fill missing months with the last known invested amount
                    all_months = pd.period_range(start=scrip_df['Date'].min().to_period('M'), end=scrip_df['Date'].max().to_period('M'))
                    invested_amounts_filled = {month: invested_amounts.get(month, last_invested_amount) for month in all_months}

                    for month, amount in invested_amounts_filled.items():
                        results.append({'Scrip_Name': scrip, 'Month': month, 'Invested Amount': amount})

                final_results_df = pd.DataFrame(results)
                return final_results_df

            invested_amt_df = calculate_monthly_invested_amount(final_results)
        #     print(invested_amt_df[invested_amt_df['Scrip_Name']=='UNIVERSAL CABLES LTD'])

            def plot_latest_invested_amount(invested_df, turnover_df):
                # Merge the DataFrames
                merged_df = pd.merge(invested_df, turnover_df, on=['Scrip_Name', 'Month'], how='left')
                merged_df['Turnover'].ffill(inplace=True)

                # Extract unique months and years
                unique_months = merged_df['Month'].unique()
                unique_months = sorted(unique_months)

                # Create a dictionary for month-year combinations in the desired format
                month_year_dict = {str(month): month.strftime("%B-%Y") for month in unique_months}

                # Initialize figure
                fig = go.Figure()

                # Add traces for each month
                for month in unique_months:
                    month_str = str(month)
                    month_df = merged_df[merged_df['Month'] == month]

                    fig.add_trace(go.Bar(
                        x=month_df['Scrip_Name'],
                        y=month_df['Invested Amount'],
                        name=f'{month_year_dict[month_str]} - Invested Amount',
                        visible=False,
                        marker=dict(color='#38d430')
                    ))

                    fig.add_trace(go.Bar(
                        x=month_df['Scrip_Name'],
                        y=month_df['Turnover'],
                        name=f'{month_year_dict[month_str]} - Turnover',
                        visible=False,
                        marker=dict(color='#ffab4d')
                    ))

                # Make the first month visible
                for trace in fig.data[:2]:
                    trace.visible = True

                # Create dropdown menu
                dropdown_buttons = [
                    {'label': month_year_dict[str(month)], 'method': 'update', 'args': [
                        {'visible': [i // 2 == idx for i in range(len(unique_months) * 2)]},
                        {'title': f'Invested Amount and Turnover for {month_year_dict[str(month)]}'}
                    ]}
                    for idx, month in enumerate(unique_months)
                ]

                # Update layout with dropdown menu
                fig.update_layout(
                    updatemenus=[{
                        'buttons': dropdown_buttons,
                        'direction': 'down',
                        'showactive': True
                    }],
                    title=f'Invested Amount and Turnover for {month_year_dict[str(unique_months[0])]}',
                    xaxis_title='Scrip Name',
                    yaxis_title='Amount',
                    barmode='group',
                    template='plotly_white'
                )


                return fig


            fig = plot_latest_invested_amount(invested_amt_df,turnover_df)



            # Convert to JSON
            fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
            
            return {
                "figure": fig_dict               
                }
    

        except Exception as e:           
            return json.dumps({"error": str(e)})
        


    @staticmethod
    # use portfolio data 
    def classify_stocks_risk_return(data):

        def convert_to_serializable(obj):
            if isinstance(obj, (np.ndarray, pd.Series)):
                return obj.tolist()  # Convert NumPy array to list
            elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, datetime.date)):
                return obj.isoformat()  # Convert datetime to string
            elif isinstance(obj, dict):
                return {key: convert_to_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(item) for item in obj]
            else:
                return obj  # Return other types as-is


        try:
            df = data.copy()
            
            df.rename(columns={
                'Deployed_Amount': 'Deployed Amount',
                'Brokerage_Amount': 'Brokerage Amount',
                'Realized_PNL': 'Realized PNL',
                'Unrealized_PNL': 'Unrealized PNL',
                'Remaining_Qty' : 'Remaining Qty',
                'Unrealized_%_Return': 'Unrealized % Return'
            }, inplace=True)
            
            # Convert 'Unrealized % Return' to numeric
            df["Unrealized % Return"] = df["Unrealized % Return"].str.replace("%", "").astype(float)

            # Compute Stock-Wise Risk & Return Metrics
            metrics = df.groupby("Symbol").agg(
                Mean_Return=("Unrealized % Return", "mean"),
                Volatility=("Unrealized % Return", "std"),
                Max_Drawdown=("Unrealized % Return", lambda x: (x - x.cummax()).min()),
            ).reset_index()
            metrics["Sharpe_Ratio"] = metrics["Mean_Return"] / (metrics["Volatility"] + 1e-6)

            # Define target labels using median values
            return_median = metrics["Mean_Return"].median()
            risk_median = metrics["Volatility"].median()

            def categorize(row):
                if row["Mean_Return"] > return_median and row["Volatility"] < risk_median:
                    return "High Return, Low Risk"
                elif row["Mean_Return"] > return_median and row["Volatility"] >= risk_median:
                    return "High Return, High Risk"
                elif row["Mean_Return"] <= return_median and row["Volatility"] < risk_median:
                    return "Low Return, Low Risk"
                else:
                    return "Low Return, High Risk"

            metrics["Category"] = metrics.apply(categorize, axis=1)

            # Classification Model Setup
            X = metrics[["Mean_Return", "Volatility", "Sharpe_Ratio", "Max_Drawdown"]]
            y = metrics["Category"]

            # Train-test split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )

            # Feature scaling
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)

            # Train Decision Tree
            clf = DecisionTreeClassifier(random_state=42)
            clf.fit(X_train_scaled, y_train)

            # Make predictions
            y_pred = clf.predict(X_test_scaled)

            # Enhanced Visualization
            fig = px.scatter(
                metrics,
                x="Volatility",
                y="Mean_Return",
                color="Category",
                hover_name="Symbol",
                title="<b style='font-size:24px'>Stock Risk-Return Analysis</b><br>" +
                    "<sup style='font-size:14px;color:#666'>Decision Tree Classifier | Accuracy: {:.1f}%</sup>".format(
                        100*clf.score(X_test_scaled, y_test)
                    ),
                labels={
                    "Volatility": "<b>Risk (Volatility) →</b>",
                    "Mean_Return": "<b>Average Return →</b>"
                },
                color_discrete_map={
                    "High Return, Low Risk": "#4CAF50",  # Green
                    "High Return, High Risk": "#FF9800",  # Orange
                    "Low Return, Low Risk": "#2196F3",    # Blue
                    "Low Return, High Risk": "#F44336"    # Red
                },
                height=600,
                template="plotly_white+presentation"
            )

            # Add quadrant lines
            fig.add_shape(type="line",
                x0=risk_median, y0=metrics["Mean_Return"].min(),
                x1=risk_median, y1=metrics["Mean_Return"].max(),
                line=dict(color="#616161", width=1.5, dash="dashdot")
            )
            fig.add_shape(type="line",
                x0=metrics["Volatility"].min(), y0=return_median,
                x1=metrics["Volatility"].max(), y1=return_median,
                line=dict(color="#616161", width=1.5, dash="dashdot")
            )

            # Quadrant annotations
            annotations = [
                dict(x=risk_median/2, y=return_median*1.5,
                    text="<b>🛡️ Low Risk,<br> Low Return",
                    showarrow=False, font=dict(size=12, color="#2196F3")),
                dict(x=risk_median*1.7, y=return_median*1.5,
                    text="<b>☠️ High Risk,<br> Low Return",
                    showarrow=False, font=dict(size=12, color="#F44336")),
                dict(x=risk_median/2, y=return_median*0.5,
                    text="<b>⭐ Low Risk,<br> High Return",
                    showarrow=False, font=dict(size=12, color="#4CAF50")),
                dict(x=risk_median*1.7, y=return_median*0.5,
                    text="<b>⚠️ High Risk,<br> High Return",
                    showarrow=False, font=dict(size=12, color="#FF9800"))
            ]

            # Custom hover template
            fig.update_traces(
                hovertemplate="<b>%{hovertext}</b><br>" +
                            "<b>Return:</b> %{y:.2f}<br>" +
                            "<b>Risk:</b> %{x:.2f}<br>" +
                            "<b>Sharpe Ratio:</b> %{customdata[0]:.2f}<br>" +
                            "<b>Max Drawdown:</b> %{customdata[1]:.2f}<extra></extra>",
                customdata=metrics[["Sharpe_Ratio", "Max_Drawdown"]],
                marker=dict(size=12, line=dict(width=1, color="DarkSlateGrey")),
                opacity=1
            )

            # Final layout polish
            fig.update_layout(
                font=dict(family="Arial", size=12),
                legend=dict(
                    title=dict(text="<b>Asset Category</b>"),
                    orientation="h",
                    yanchor="top",
                    y=-0.2,
                    xanchor="center",
                    x=0.5
                ),
                xaxis=dict(
                    title=dict(standoff=20),
                    gridcolor="rgba(0,0,0,0.08)",
                    showline=True,
                    linecolor="black"
                ),
                yaxis=dict(
                    title=dict(standoff=20),
                    gridcolor="rgba(0,0,0,0.08)",
                    showline=True,
                    linecolor="black",
                    # tickformat=".0f",  # Ensures whole number formatting
                    # dtick=50  # Controls the interval between tick marks dynamically
                ),
                annotations=annotations + [dict(
                    x=1, y=-0.15,
                    showarrow=False,
                    text=f"Classification Thresholds: Return ≥ {return_median:.2f}% | Risk ≥ {risk_median:.2f}%",
                    xref="paper",
                    yref="paper",
                    font=dict(size=11, color="#666666"))
                ],
                margin=dict(l=60, r=60, b=80, t=100),
                hoverlabel=dict(
                    bgcolor="white",
                    font_size=12,
                    font_family="Arial",
                    bordercolor="black"
                )
            )

            # Convert to JSON
            fig_dict = json.loads(json.dumps(fig.to_dict(), default=convert_to_serializable))
            
            return {
                "figure": fig_dict               
                }
    

        except Exception as e:           
            return json.dumps({"error": str(e)})
        


    def calculate_portfolio_metrics(portfolio_df):

        fundamentals_df = pd.read_csv(r"src/main/resources/data/pe_data.csv")
        fundamentals_df.rename(columns={'trailingPE':"PE","bookValue":"BV","trailingEps":"EPS"},inplace=True)

        industry_df =  pd.read_csv(r"src/main/resources/data/Industry_data_with_returns.csv")


        # Merge portfolio with fundamentals
        portfolio_fundamentals = portfolio_df.merge(fundamentals_df, on='Symbol', how='left')
        portfolio_fundamentals = portfolio_fundamentals.merge(industry_df[['Symbol', 'Sector']], on='Symbol', how='left')
        portfolio_fundamentals = portfolio_fundamentals.dropna(subset=['EPS', 'PE', 'BV'])
        
        portfolio_fundamentals.rename(columns={
                'Deployed_Amount': 'Deployed Amount',
                'Brokerage_Amount': 'Brokerage Amount',
                'Realized_PNL': 'Realized PNL',
                'Unrealized_PNL': 'Unrealized PNL',
                'Remaining_Qty' : 'Remaining Qty',
                'Unrealized_%_Return': 'Unrealized % Return',
                'Market_Value' : 'Market Value'
        }, inplace=True)
                    
        # Calculate total value & total shares
        portfolio_fundamentals['Total Value'] = portfolio_fundamentals['Market Value']
        portfolio_fundamentals['Total Shares'] = portfolio_fundamentals['Remaining Qty']
        
        
        portfolio_fundamentals = portfolio_fundamentals.dropna(subset=['EPS', 'PE', 'BV'])

        # Ensure numeric types
        for col in ['EPS', 'PE', 'BV', 'Total Shares', 'Total Value']:
            portfolio_fundamentals[col] = pd.to_numeric(portfolio_fundamentals[col], errors='coerce')
        
        portfolio_fundamentals.dropna(subset=['EPS', 'PE', 'BV', 'Total Shares', 'Total Value'], inplace=True)  
        
        # Weighted portfolio metrics
        portfolio_eps = (portfolio_fundamentals['EPS'] * portfolio_fundamentals['Total Shares']).sum() / portfolio_fundamentals['Total Shares'].sum()
        portfolio_pe = (portfolio_fundamentals['PE'] * portfolio_fundamentals['Total Value']).sum() / portfolio_fundamentals['Total Value'].sum()
        portfolio_bv = (portfolio_fundamentals['BV'] * portfolio_fundamentals['Total Shares']).sum() / portfolio_fundamentals['Total Shares'].sum()
        
        # Sector Allocation
        sector_allocation = portfolio_fundamentals.groupby('Sector')['Total Value'].sum() / portfolio_fundamentals['Total Value'].sum()
        
        # Convert to dictionary
        portfolio_metrics = {
            'Portfolio EPS': round(portfolio_eps, 2),
            'Portfolio PE': round(portfolio_pe, 2),
            'Portfolio BV': round(portfolio_bv, 2),
            'Sector Allocation': {sector: round(weight * 100, 1) for sector, weight in sector_allocation.items()}
        }
        
        return portfolio_metrics


    # @staticmethod
    # def plot_portfolio_eps_bv_quarterly_all_entries(portfolio_df):
    #     fundamentals_df = pd.read_csv(r"src/main/resources/data/pe_data.csv")
    #     fundamentals_df.rename(columns={'trailingPE': "PE", 'bookValue': "BV", 'trailingEps': "EPS"}, inplace=True)
    #
    #     portfolio_df['Date'] = pd.to_datetime(portfolio_df['Date'])
    #     portfolio_df['Quarter'] = portfolio_df['Date'].dt.to_period('Q').astype(str)
    #
    #     merged_df = portfolio_df.merge(fundamentals_df[['Symbol', 'EPS', 'BV']], on='Symbol', how='left')
    #     merged_df = merged_df.dropna(subset=['EPS', 'BV'])
    #
    #     merged_df.rename(columns={
    #             'Deployed_Amount': 'Deployed Amount',
    #             'Brokerage_Amount': 'Brokerage Amount',
    #             'Realized_PNL': 'Realized PNL',
    #             'Unrealized_PNL': 'Unrealized PNL',
    #             'Remaining_Qty' : 'Remaining Qty',
    #             'Unrealized_%_Return': 'Unrealized % Return'
    #     }, inplace=True)
    #
    #     merged_df['Remaining Qty'] = pd.to_numeric(merged_df['Remaining Qty'], errors='coerce')
    #
    #     merged_df['Weighted_EPS'] = merged_df['EPS'] * merged_df['Remaining Qty']
    #     merged_df['Weighted_BV'] = merged_df['BV'] * merged_df['Remaining Qty']
    #
    #     def weighted_avg(group, col):
    #         return group[f'Weighted_{col}'].sum() / group['Remaining Qty'].sum()
    #
    #     grouped = merged_df.groupby('Quarter')
    #     quarterly_eps = grouped.apply(lambda x: weighted_avg(x, 'EPS')).reset_index(name='Portfolio_EPS')
    #     quarterly_bv = grouped.apply(lambda x: weighted_avg(x, 'BV')).reset_index(name='Portfolio_BV')
    #
    #     trendline_eps = quarterly_eps['Portfolio_EPS'].rolling(3, min_periods=1).mean()
    #     trendline_bv = quarterly_bv['Portfolio_BV'].rolling(3, min_periods=1).mean()
    #
    #     LOW_EPS_THRESHOLD = 5
    #     LOW_BV_THRESHOLD = 100
    #
    #     max_eps = quarterly_eps['Portfolio_EPS'].max()
    #     min_eps = quarterly_eps['Portfolio_EPS'].min()
    #     annotations_eps = []
    #     for idx, row in quarterly_eps.iterrows():
    #         if row['Portfolio_EPS'] == max_eps:
    #             annotations_eps.append(dict(
    #                 x=row['Quarter'], y=row['Portfolio_EPS'],
    #                 text='Peak Performance', showarrow=True, arrowhead=2,
    #                 ax=0, ay=-40, bgcolor='rgba(46, 204, 113, 0.8)',
    #                 font=dict(color='white')
    #             ))
    #         elif row['Portfolio_EPS'] == min_eps and row['Portfolio_EPS'] < LOW_EPS_THRESHOLD:
    #             annotations_eps.append(dict(
    #                 x=row['Quarter'], y=row['Portfolio_EPS'],
    #                 text='Low Performance Point', showarrow=True, arrowhead=2,
    #                 ax=0, ay=40, bgcolor='rgba(231, 76, 60, 0.8)',
    #                 font=dict(color='white')
    #             ))
    #
    #     max_bv = quarterly_bv['Portfolio_BV'].max()
    #     min_bv = quarterly_bv['Portfolio_BV'].min()
    #     annotations_bv = []
    #     for idx, row in quarterly_bv.iterrows():
    #         if row['Portfolio_BV'] == max_bv:
    #             annotations_bv.append(dict(
    #                 x=row['Quarter'], y=row['Portfolio_BV'],
    #                 text='Peak Book Value', showarrow=True, arrowhead=2,
    #                 ax=0, ay=-40, bgcolor='rgba(52, 152, 219, 0.8)',
    #                 font=dict(color='white')
    #             ))
    #         elif row['Portfolio_BV'] == min_bv and row['Portfolio_BV'] < LOW_BV_THRESHOLD:
    #             annotations_bv.append(dict(
    #                 x=row['Quarter'], y=row['Portfolio_BV'],
    #                 text='Low Book Value Point', showarrow=True, arrowhead=2,
    #                 ax=0, ay=40, bgcolor='rgba(231, 76, 60, 0.8)',
    #                 font=dict(color='white')
    #             ))
    #
    #     fig = go.Figure()
    #
    #     fig.add_trace(go.Scatter(
    #         x=quarterly_eps['Quarter'], y=quarterly_eps['Portfolio_EPS'],
    #         mode='lines+markers+text', name='Portfolio EPS',
    #         line=dict(color='#2ecc71', width=4, shape='spline', smoothing=1.3),
    #         marker=dict(size=12, color='#27ae60', line=dict(width=2, color='white'), symbol='hexagon'),
    #         text=[f'<b>{val:.2f}</b>' for val in quarterly_eps['Portfolio_EPS']],
    #         textposition='top center',
    #         textfont=dict(family="Arial", size=12, color='#2c3e50'),
    #         hovertemplate='<b>Quarter</b>: %{x}<br><b>EPS</b>: %{y:.2f}<br>',
    #         visible=True
    #     ))
    #
    #     fig.add_trace(go.Scatter(x=quarterly_eps['Quarter'], y=quarterly_eps['Portfolio_EPS'],
    #                              fill='tozeroy', mode='none',
    #                              fillcolor='rgba(46, 204, 113, 0.15)', showlegend=False, visible=True))
    #
    #     fig.add_trace(go.Scatter(x=quarterly_eps['Quarter'], y=trendline_eps,
    #                              mode='lines', name='3-Quarter Trend',
    #                              line=dict(color='blue', width=2, dash='dot'),
    #                              hovertemplate='Trend: %{y:.2f}<extra></extra>', visible=True))
    #
    #     fig.add_trace(go.Scatter(x=quarterly_eps['Quarter'], y=[LOW_EPS_THRESHOLD] * len(quarterly_eps),
    #                              mode='lines', name='Low EPS Threshold',
    #                              line=dict(color='red', width=2, dash='dot'), hoverinfo='skip', visible=True))
    #
    #     overall_eps = merged_df['Weighted_EPS'].sum() / merged_df['Remaining Qty'].sum()
    #
    #     eps_annotation = [
    #         dict(
    #             x=1, y=-0.15, xref="paper", yref="paper", xanchor="right", showarrow=False,
    #             text=f"<b style='color:#344cad;'>Weighted EPS of Entire Portfolio:</b> "
    #                  f"<span style='color:{'red' if overall_eps < LOW_EPS_THRESHOLD else 'green'};'><b>{overall_eps:.2f}</b></span>",
    #             font=dict(size=12)
    #         )
    #     ]
    #
    #     fig.update_layout(
    #         title=dict(
    #             text="<b>Your Portfolio’s Earnings Pulse</b><br><sup>Quarterly Weighted EPS / Book Value Trend</sup>",
    #             x=0.03,
    #             y=0.93,
    #             font=dict(size=24, family='Arial', color='#2c3e50')
    #         ),
    #         xaxis=dict(title='<b>Quarter</b>', type='category'),
    #         yaxis=dict(title='<b>Metric Value</b>', zeroline=False),
    #         plot_bgcolor='white',
    #         paper_bgcolor='white',
    #         annotations=annotations_eps + eps_annotation,
    #         height=700
    #     )
    #
    #     # Return Plotly JSON
    #     return json.loads(fig.to_json())


    
        # merged_df.rename(columns={
        #         'Deployed_Amount': 'Deployed Amount',
        #         'Brokerage_Amount': 'Brokerage Amount',
        #         'Realized_PNL': 'Realized PNL',
        #         'Unrealized_PNL': 'Unrealized PNL',
        #         'Remaining_Qty' : 'Remaining Qty',
        #         'Unrealized_%_Return': 'Unrealized % Return'
        # }, inplace=True)
        #
        # merged_df['Remaining Qty'] = pd.to_numeric(merged_df['Remaining Qty'], errors='coerce')

        
    @staticmethod
    def plot_portfolio_eps_bv_quarterly_all_entries(portfolio_df):
            
        fundamentals_df = pd.read_csv(r"src/main/resources/data/pe_data.csv")
        fundamentals_df.rename(columns={'trailingPE':"PE","bookValue":"BV","trailingEps":"EPS"},inplace=True)
    

        portfolio_df['Date'] = pd.to_datetime(portfolio_df['Date'])
        portfolio_df['Quarter'] = portfolio_df['Date'].dt.to_period('Q').astype(str)

        # Merge EPS and BV
        merged_df = portfolio_df.merge(fundamentals_df[['Symbol', 'EPS', 'BV']], on='Symbol', how='left')
        merged_df = merged_df.dropna(subset=['EPS', 'BV'])
        
        merged_df.rename(columns={
            'Deployed_Amount': 'Deployed Amount',
            'Brokerage_Amount': 'Brokerage Amount',
            'Realized_PNL': 'Realized PNL',
            'Unrealized_PNL': 'Unrealized PNL',
            'Remaining_Qty' : 'Remaining Qty',
            'Unrealized_%_Return': 'Unrealized % Return'
        }, inplace=True)
    
        merged_df['Remaining Qty'] = pd.to_numeric(merged_df['Remaining Qty'], errors='coerce')

        # Weighted values
        merged_df['Weighted_EPS'] = merged_df['EPS'] * merged_df['Remaining Qty']
        merged_df['Weighted_BV'] = merged_df['BV'] * merged_df['Remaining Qty']

        # Group by quarter and compute weighted EPS & BV
        def weighted_avg(group, col):
            return group[f'Weighted_{col}'].sum() / group['Remaining Qty'].sum()

        grouped = merged_df.groupby('Quarter')
        quarterly_eps = grouped.apply(lambda x: weighted_avg(x, 'EPS')).reset_index(name='Portfolio_EPS')
        quarterly_bv = grouped.apply(lambda x: weighted_avg(x, 'BV')).reset_index(name='Portfolio_BV')

        # Trendlines
        trendline_eps = quarterly_eps['Portfolio_EPS'].rolling(3, min_periods=1).mean()
        trendline_bv = quarterly_bv['Portfolio_BV'].rolling(3, min_periods=1).mean()

        # Thresholds
        LOW_EPS_THRESHOLD = 5
        LOW_BV_THRESHOLD = 100

        # Annotations for EPS
        max_eps = quarterly_eps['Portfolio_EPS'].max()
        min_eps = quarterly_eps['Portfolio_EPS'].min()
        annotations_eps = []
        for idx, row in quarterly_eps.iterrows():
            if row['Portfolio_EPS'] == max_eps:
                annotations_eps.append(dict(
                    x=row['Quarter'], y=row['Portfolio_EPS'],
                    text='Peak Performance', showarrow=True, arrowhead=2,
                    ax=0, ay=-40, bgcolor='rgba(46, 204, 113, 0.8)',
                    font=dict(color='white')
                ))
            elif row['Portfolio_EPS'] == min_eps and row['Portfolio_EPS'] < LOW_EPS_THRESHOLD:
                annotations_eps.append(dict(
                    x=row['Quarter'], y=row['Portfolio_EPS'],
                    text='Low Performance Point', showarrow=True, arrowhead=2,
                    ax=0, ay=40, bgcolor='rgba(231, 76, 60, 0.8)',
                    font=dict(color='white')
                ))

        # Annotations for BV
        max_bv = quarterly_bv['Portfolio_BV'].max()
        min_bv = quarterly_bv['Portfolio_BV'].min()
        annotations_bv = []
        for idx, row in quarterly_bv.iterrows():
            if row['Portfolio_BV'] == max_bv:
                annotations_bv.append(dict(
                    x=row['Quarter'], y=row['Portfolio_BV'],
                    text='Peak Book Value', showarrow=True, arrowhead=2,
                    ax=0, ay=-40, bgcolor='rgba(52, 152, 219, 0.8)',
                    font=dict(color='white')
                ))
            elif row['Portfolio_BV'] == min_bv and row['Portfolio_BV'] < LOW_BV_THRESHOLD:
                annotations_bv.append(dict(
                    x=row['Quarter'], y=row['Portfolio_BV'],
                    text='Low Book Value Point', showarrow=True, arrowhead=2,
                    ax=0, ay=40, bgcolor='rgba(231, 76, 60, 0.8)',
                    font=dict(color='white')
                ))

        # Base Figure
        fig = go.Figure()

        # EPS Trace
        fig.add_trace(go.Scatter(
            x=quarterly_eps['Quarter'], y=quarterly_eps['Portfolio_EPS'],
            mode='lines+markers+text', name='Portfolio EPS',
            line=dict(color='#2ecc71', width=4, shape='spline', smoothing=1.3),
            marker=dict(size=12, color='#27ae60', line=dict(width=2, color='white'), symbol='hexagon'),
            text=[f'<b>{val:.2f}</b>' for val in quarterly_eps['Portfolio_EPS']],
            textposition='top center',
            textfont=dict(family="Arial", size=12, color='#2c3e50'),
            hovertemplate='<b>Quarter</b>: %{x}<br><b>EPS</b>: %{y:.2f}<br>',
            visible=True
        ))

        # EPS Fill Area
        fig.add_trace(go.Scatter(
            x=quarterly_eps['Quarter'], y=quarterly_eps['Portfolio_EPS'],
            fill='tozeroy', mode='none',
            fillcolor='rgba(46, 204, 113, 0.15)', showlegend=False, visible=True
        ))

        # EPS Trendline
        fig.add_trace(go.Scatter(
            x=quarterly_eps['Quarter'], y=trendline_eps,
            mode='lines', name='3-Quarter Trend',
            line=dict(color='blue', width=2, dash='dot'),
            hovertemplate='Trend: %{y:.2f}<extra></extra>',
            visible=True
        ))

        # EPS Threshold Line
        fig.add_trace(go.Scatter(
            x=quarterly_eps['Quarter'], y=[LOW_EPS_THRESHOLD]*len(quarterly_eps),
            mode='lines', name='Low EPS Threshold',
            line=dict(color='red', width=2, dash='dot'),
            hoverinfo='skip', visible=True
        ))

        # BV Trace
        fig.add_trace(go.Scatter(
            x=quarterly_bv['Quarter'], y=quarterly_bv['Portfolio_BV'],
            mode='lines+markers+text', name='Portfolio Book Value',
            line=dict(color='#09b1ec', width=4, shape='spline', smoothing=1.3),
            marker=dict(size=12, color='#0477a0', line=dict(width=2, color='white'), symbol='circle'),
            text=[f'<b>{val:.2f}</b>' for val in quarterly_bv['Portfolio_BV']],
            textposition='top center',
            textfont=dict(family="Arial", size=12, color='#2c3e50'),
            hovertemplate='<b>Quarter</b>: %{x}<br><b>Book Value</b>: %{y:.2f}<br>',
            visible=False
        ))

        # BV Fill Area
        fig.add_trace(go.Scatter(
            x=quarterly_bv['Quarter'], y=quarterly_bv['Portfolio_BV'],
            fill='tozeroy', mode='none',
            fillcolor='rgba(52, 152, 219, 0.15)', showlegend=False, visible=False
        ))

        # BV Trendline
        fig.add_trace(go.Scatter(
            x=quarterly_bv['Quarter'], y=trendline_bv,
            mode='lines', name='3-Quarter BV Trend',
            line=dict(color='#4b9e0c', width=2, dash='dot'),
            hovertemplate='Trend: %{y:.2f}<extra></extra>',
            visible=False
        ))

        # BV Threshold Line
        fig.add_trace(go.Scatter(
            x=quarterly_bv['Quarter'], y=[LOW_BV_THRESHOLD]*len(quarterly_bv),
            mode='lines', name='Low BV Threshold',
            line=dict(color='red', width=2, dash='dot'),
            hoverinfo='skip', visible=False
        ))



        # Layout & Axis
        fig.update_layout(
            title=dict(
                text="<b>Your Portfolio’s Earnings Pulse</b><br><sup>Quarterly Weighted EPS / Book Value Trend</sup>",
                x=0.03,
                y=0.93,
                font=dict(size=24, family='Arial', color='#2c3e50')
            ),
            xaxis=dict(title='<b>Quarter</b>', gridcolor='rgba(220, 220, 220, 0.5)',
                    linecolor='#bdc3c7', tickfont=dict(color='#586161'), type='category'),
            yaxis=dict(title='<b>Metric Value</b>', gridcolor='rgba(220, 220, 220, 0.3)',
                    linecolor='#bdc3c7', tickformat=".2f", zeroline=False),
            plot_bgcolor='white',
            paper_bgcolor='white',
            margin=dict(l=50, r=50, b=80, t=100),
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1,
                        bgcolor='rgba(255, 255, 255, 0.8)', bordercolor='#ecf0f1', borderwidth=1),
            hoverlabel=dict(bgcolor='rgba(255,255,255,1)', font_size=14,
                            font_family="Arial", font_color='black', bordercolor='rgba(52, 73, 94, 0.8)'),
            template='plotly_white'
        )

        # Add portfolio-wide EPS and BV annotation (for EPS by default)
        overall_eps = merged_df['Weighted_EPS'].sum() / merged_df['Remaining Qty'].sum()
        overall_bv = merged_df['Weighted_BV'].sum() / merged_df['Remaining Qty'].sum()

        # Annotations
        eps_annotation = [
            dict(
                x=1, y=-0.15, xref="paper", yref="paper", xanchor="right", showarrow=False,
                text=f"<b style='color:#344cad;'>Weighted EPS of Entire Portfolio:</b> "
                    f"<span style='color:{'red' if overall_eps < LOW_EPS_THRESHOLD else 'green'};'><b>{overall_eps:.2f}</b></span>",
                font=dict(size=12)
            )
        ]

        bv_annotation = [
            dict(
                x=1, y=-0.15, xref="paper", yref="paper", xanchor="right", showarrow=False,
                text=f"<b style='color:#344cad;'>Weighted Book Value of Entire Portfolio:</b> "
                    f"<span style='color:{'red' if overall_bv < LOW_BV_THRESHOLD else 'green'};'><b>{overall_bv:.2f}</b></span>",
                font=dict(size=12)
            )
        ]

        # Set initial state with EPS annotation & title
        fig.update_layout(
            height=700,
            annotations=annotations_eps + eps_annotation,
            title_text="<b>Your Portfolio’s Earnings Pulse</b><br><sup>Quarterly Weighted EPS Trend</sup>"
        )

        # Dropdown Menu
        fig.update_layout(
            updatemenus=[
                dict(
                    type="dropdown",
                    x=1.1,
                    y=1.25,
                    showactive=True,
                    active=0,
                    buttons=[
                        dict(label="EPS", method="update", args=[
                            {"visible": [True, True, True, True, False, False, False, False]},
                            {"annotations": annotations_eps + eps_annotation,
                            "title.text": "<b>Your Portfolio’s Earnings Pulse</b><br><sup>Quarterly Weighted EPS Trend</sup>"}
                        ]),
                        dict(label="Book Value", method="update", args=[
                            {"visible": [False, False, False, False, True, True, True, True]},
                            {"annotations": annotations_bv + bv_annotation,
                            "title.text": "<b>Your Portfolio’s Book Value Trend</b><br><sup>Quarterly Weighted Book Value</sup>"}
                        ])
                    ]
                )
            ]
        )

         # Return Plotly JSON
        return json.loads(fig.to_json())
    
    
    
# ----- Own Portfolio Code 


    @staticmethod
    def generate_actual_date_replacements(transactions_df):
    
        def create_name_symbol_mapping(df):
    
            def normalize_ScripNames(text, keep_nums=True):
                if keep_nums:
                    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)  # Remove special characters and keep numbers
                else:
                    text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove special characters and numbers
                text = text.lower()  # Lower the text
    
                char_to_replace = {'ltd': '', 'limited': '', 'eng': '', 'engineering': ''}
                for key, value in char_to_replace.items():
                    text = text.replace(key, value)
    
                normalized_text = ' '.join(text.split())  # Remove whitespace
                return normalized_text
    
            def search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer):
                vector = vectorizer.transform([normalized_ScripName]).toarray()
                cos_sim_scores = cosine_similarity(vector, nse_vectors)[0]
                return np.argmax(cos_sim_scores), np.max(cos_sim_scores)
    
    
            # Identify if `Scrip_Name` contains symbols or company names
            def is_symbol(value):
                # Condition 1: Check if the value exists in the SYMBOL column
                if value in nse_scrip_list['SYMBOL'].values:
                    return True
    
                # Condition 2: Symbols are usually uppercase and without spaces
                if re.fullmatch(r'^[A-Z0-9&.-]+$', value):
                    return True  # Likely a symbol
    
                return False  # Likely a company name
    
    
    
            # nse_scrip_list = pd.read_csv(r'D:/VSCode/MTM_faster/data/new_portfolio_equity_list.csv')
            nse_scrip_list = pd.read_csv(r'src/main/resources/data/portf_data/new_portfolio_equity_list.csv')
    
            # Preprocess NSE data: Normalize names
            nse_scrip_list['Normalized_ScripName'] = nse_scrip_list['Name of Company'].apply(normalize_ScripNames)
    
    
            df['Is_Symbol'] = df['Scrip_Name'].apply(is_symbol)
    
            # Step 2: If `Scrip_Name` contains symbols, rename it and map company names
            if df['Is_Symbol'].all():  # If all values are symbols
                df.rename(columns={'Scrip_Name': 'Symbol'}, inplace=True)
                df['Scrip_Name'] = df['Symbol'].map(dict(zip(nse_scrip_list['SYMBOL'], nse_scrip_list['Name of Company'])))
    
                # Find rows where Scrip_Name is NaN
                missing_scrip_names = df[df['Scrip_Name'].isna()]
    
                if not missing_scrip_names.empty:
                    # Print the symbols that are being dropped
                    print("These symbols could not be mapped to a Scrip_Name and will be dropped:")
                    print(missing_scrip_names['Symbol'].tolist())
    
                    # Drop rows where Scrip_Name is NaN
                    df = df.dropna(subset=['Scrip_Name']).reset_index(drop=True)
    
            else:
                # Step 3: Apply Name → Symbol Mapping (for rows with company names)
                df['Normalized_ScripName'] = df['Scrip_Name'].apply(normalize_ScripNames)
    
                # Vectorize the normalized scrip names for similarity search
                vectorizer = CountVectorizer().fit(nse_scrip_list['Normalized_ScripName'])
                nse_vectors = vectorizer.transform(nse_scrip_list['Normalized_ScripName']).toarray()
    
                # Create mapping dictionary
                name_to_symbol = dict(zip(nse_scrip_list['Normalized_ScripName'], nse_scrip_list['SYMBOL']))
                df['Symbol'] = df['Normalized_ScripName'].map(name_to_symbol)
    
                # Handle missing symbols using cosine similarity
                missing_symbols = df[df['Symbol'].isna()]
                for i, row in missing_symbols.iterrows():
                    normalized_ScripName = row['Normalized_ScripName']
                    scrip_index, similarity_score = search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer)
    
                    if similarity_score > 0.8:  # Threshold to consider a valid match
                        matched_symbol = nse_scrip_list.iloc[scrip_index]['SYMBOL']
                        df.at[i, 'Symbol'] = matched_symbol
    
    
            # Step 4: Check for remaining unmatched symbols
            df['Symbol'].fillna('Unknown', inplace=True)
            df.drop(columns=['Is_Symbol','Normalized_ScripName'],inplace=True)
            return df
    
    
        transaction_tab = create_name_symbol_mapping(transactions_df)
    
        def calculate_current_holdings(transaction_tab):
            """
            Returns remaining (un‑sold) lots using FIFO matching, dropping any short sells.
            Output includes buy date, quantity, and buy-side market price.
    
            Input cols:
            - 'Trd Dt', 'Symbol', 'Buy/Sell', 'Qty', 'Mkt Price'
    
            Output:
            - 'Symbol', 'Buy Date', 'Remaining Qty', 'Buy Price'
            """
            df = transaction_tab.copy()
            # print(df.columns)
            df = df[df['Exchange'] == "NSE"]
            df['Mkt Value'] = df['Mkt_Price'] * df['Qty']
            df['Trade_Date'] = pd.to_datetime(df['Trade_Date'])
            df['Order_Type'] = df['Order_Type'].str.strip().str.upper()
            df = df.sort_values(['Symbol', 'Trade_Date']).reset_index(drop=True)
    
            queues = {}  # scrip_name -> deque of {'date': dt, 'qty': qty, 'price': float}
            for _, row in df.iterrows():
                s = row['Symbol']
                side = row['Order_Type']
                q = int(row['Qty'])
                date = row['Trade_Date']
                price = float(row['Mkt_Price'])
                value = float(row['Mkt Value'])
    
                if s not in queues:
                    queues[s] = deque()
    
                if side == 'B':
                    queues[s].append({'date': date, 'qty': q, 'price': price,'value':value})
                elif side == 'S':
                    to_sell = q
                    while to_sell > 0 and queues[s]:
                        lot = queues[s][0]
                        if lot['qty'] > to_sell:
                            lot['qty'] -= to_sell
                            to_sell = 0
                        else:
                            to_sell -= lot['qty']
                            queues[s].popleft()
                else:
                    continue
    
            rows = []
            for scrip, q in queues.items():
                for lot in q:
                    rows.append({
                        'Symbol': scrip,
                        'Date': lot['date'],
                        'Remaining Qty': lot['qty'],
                        'Buy Price': lot['price'],
                        'Market Value':lot['value']
                    })
    
            result = pd.DataFrame(rows)
            return result.sort_values(['Symbol', 'Date']).reset_index(drop=True)
        
        
        
        holdings_df = calculate_current_holdings(transaction_tab)
        holdings_df["Deployed Amount"] = holdings_df["Remaining Qty"] * holdings_df["Buy Price"]
    
    
        def get_latest_date_from_db(mkt_db):
            """
            Fetch the latest available trading date from the database.
            """
            return mkt_db._get_lastest_date()
    
    
        def get_market_data_for_date(mkt_db, date):
            """
            Fetch market data (historical prices) for the given date from the DB.
            Parameters:
                mkt_db: instance of MktDB
                date: datetime.date or string 'YYYY-MM-DD'
            Returns:
                DataFrame with columns ['Symbol', 'Close', ...]
            """
            # Ensure date string is in 'YYYY-MM-DD' format
            date_str = date if isinstance(date, str) else date.strftime('%Y-%m-%d')
            return mkt_db.fetch_historical_data(start_date=date_str, end_date=date_str)
    
    
        def generate_portfolio_replacements(latest_data):
            # Connect to DB and initialize market DB helper
            conn, cursor = DBHandler.get_connection()
            mkt_db = MktDB(conn, cursor)
    
            # Load fundamentals & industry
            # fundamentals_df = pd.read_csv(r"D:/VSCode/MTM_faster/data/pe_data.csv")
            fundamentals_df = pd.read_csv(r"src/main/resources/data/pe_data.csv")
            fundamentals_df.rename(columns={
                'trailingPE':'PE',
                'bookValue':'BV',
                'trailingEps':'EPS'
            }, inplace=True)
            # industry_df = pd.read_csv(r"D:/VSCode/MTM_faster/data/Industry_data_with_returns.csv")
            industry_df = pd.read_csv(r"src/main/resources/data/Industry_data_with_returns.csv")
    
            # Filter & annotate purchase_date
            filtered = latest_data[latest_data['Remaining Qty'] > 0].copy()
            filtered['purchase_date'] = (
                pd.to_datetime(filtered['Date'], dayfirst=True)
                .dt.strftime('%Y-%m-%d')  # change to ISO format for DB queries
            )
    
            # Merge fundamentals & industry
            port = (
                filtered
                .merge(fundamentals_df, on='Symbol', how='left')
                .merge(industry_df[['Symbol','Basic_Industry']], on='Symbol', how='left')
            )
            port.dropna(subset=['EPS','PE','BV'], inplace=True)
    
            # Today's market data from DB
            latest_date = get_latest_date_from_db(mkt_db)
            today_df = get_market_data_for_date(mkt_db, latest_date)
            price_today_map = today_df.set_index('Symbol')['Close'].to_dict()
            

    
            # Portfolio-level metrics (unchanged)
            total_shares = port['Remaining Qty'].sum()
            total_value  = port['Market Value'].sum()
            current_metrics = {
                'eps': (port['EPS'] * port['Remaining Qty']).sum() / total_shares,
                'pe':  (port['PE']  * port['Market Value']).sum()  / total_value,
                'bv':  (port['BV']  * port['Remaining Qty']).sum() / total_shares,
            }
    
            # Build per-lot data
            lot_data = []
            for _, row in port.iterrows():
                qty      = int(row['Remaining Qty'])
                mv       = round(row['Market Value'], 2)
                invested = float(row['Deployed Amount'])
                gain     = mv - invested
    
                pur_date = row['purchase_date']
                # Historical prices on purchase_date from DB
                hist_df = get_market_data_for_date(mkt_db, pur_date)
                hist_map = hist_df.set_index('Symbol')['Close'].to_dict() if hist_df is not None else {}
    
                # find same-industry symbols
                sector_symbols = industry_df.loc[
                    industry_df['Basic_Industry'] == row['Basic_Industry'], 'Symbol'
                ]
                valid_cands = fundamentals_df[fundamentals_df['Symbol'].isin(sector_symbols)]
                valid_cands = valid_cands[valid_cands['Symbol'] != row['Symbol']]
    
                opts = []
                for _, c in valid_cands.iterrows():
                    sym        = c['Symbol']
                    price_now  = price_today_map.get(sym)
                    price_then = hist_map.get(sym)
                    if price_now is None or price_then is None:
                        continue
    
                    new_qty      = int(mv / price_now)
                    if new_qty < 1:
                        continue
                    extra_amount = round(mv - new_qty * price_now, 2)
                    gain_cand    = round((price_now - price_then) * new_qty, 2)
                    pct_cand     = round((gain_cand / (price_then * new_qty) * 100), 2)
    
                    opts.append({
                        'symbol': sym,
                        'current_price': round(price_now,2),
                        'price_on_purchase_date': round(price_then,2),
                        'eps': float(c['EPS']),
                        'pe': float(c['PE']),
                        'bv': float(c['BV']),
                        'new_qty': new_qty,
                        'extra': extra_amount,
                        'capital_gain': gain_cand,
                        'percent_return': pct_cand
                    })
    
                lot_data.append({
                    'symbol': row['Symbol'],
                    'qty': qty,
                    'value': mv,
                    'invested': invested,
                    'gain': gain,
                    'purchase_date': pur_date,
                    'eps': row['EPS'],
                    'pe': row['PE'],
                    'bv': row['BV'],
                    'replacements': opts
                })
    
            # === AGGREGATION ===
            aggregated_holdings = []
            aggregated_repls    = {}
            lots_by_symbol = defaultdict(list)
            for lot in lot_data:
                lots_by_symbol[lot['symbol']].append(lot)
    
            for symbol, lots in lots_by_symbol.items():
                total_qty      = sum(l['qty'] for l in lots)
                dates          = [l['purchase_date'] for l in lots]
                date_min, date_max = min(dates), max(dates)
                date_range     = f"{date_min}-{date_max}" if date_min!=date_max else date_min
    
                total_value    = sum(l['value'] for l in lots)
                # latest_price = price_today_map.get(symbol)
                # total_value  = total_qty * latest_price if latest_price else 0    
                total_invested = sum(l['invested'] for l in lots)
                total_gain     = sum(l['gain'] for l in lots)
                percent_return = (total_gain / total_invested * 100) if total_invested>0 else 0
    
                weighted_eps = sum(l['eps']*l['qty'] for l in lots) / total_qty
                weighted_pe  = sum(l['pe']*l['qty']  for l in lots) / total_qty
                weighted_bv  = sum(l['bv']*l['qty']  for l in lots) / total_qty
    
                aggregated_holdings.append({
                    'symbol': symbol,
                    'qty': total_qty,
                    'value': total_value,
                    'invested_amount': total_invested,
                    'capital_gain': total_gain,
                    'percent_return': round(percent_return,2),
                    'date_range': date_range,
                    'eps': round(weighted_eps,2),
                    'pe': round(weighted_pe,2),
                    'bv': round(weighted_bv,2)
                })
    
                rep_entries = defaultdict(list)
                for lot in lots:
                    for rep in lot['replacements']:
                        rep_entries[rep['symbol']].append(rep)
    
                agg_opts = []
                for rep_sym, entries in rep_entries.items():
                    new_qty_sum    = sum(e['new_qty'] for e in entries)
                    extra_sum      = sum(e['extra']    for e in entries)
                    gain_sum       = sum(e['capital_gain'] for e in entries)
                    percent_return = (gain_sum / total_value * 100) if total_value>0 else 0
                    base = entries[0]
                    agg_opts.append({
                        'symbol': rep_sym,
                        'new_qty': new_qty_sum,
                        'extra': round(extra_sum,2),
                        'capital_gain': round(gain_sum,2),
                        'percent_return': round(percent_return,2),
                        'current_price': base['current_price'],
                        'eps': base['eps'],
                        'pe': base['pe'],
                        'bv': base['bv']
                    })
    
                aggregated_repls[symbol] = agg_opts
    
            return {
                'current_metrics': current_metrics,
                'current_holdings': aggregated_holdings,
                'replacement_options': aggregated_repls
            }
            
        final_df = generate_portfolio_replacements(holdings_df)
        return final_df
    
    
    
    
    
    



    @staticmethod
    def generate_portfolio_replacements(portfolio_df):
        """
        Returns a dict with keys:
          - current_metrics
          - current_holdings
          - replacement_options
    
        Database replaces CSV-based market data lookups.
        """
    
    
        def get_latest_date_from_db(mkt_db):
            """
            Fetch the latest available trading date from the database.
            """
            return mkt_db._get_lastest_date()
    
    
        def get_market_data_for_date(mkt_db, date):
            """
            Fetch market data (historical prices) for a single date from the database.
    
            Parameters:
                mkt_db: instance of MktDB
                date: string 'YYYY-MM-DD' or datetime.date
    
            Returns:
                DataFrame with at least ['Symbol','Close']
            """
            date_str = date.strftime('%Y-%m-%d') if not isinstance(date, str) else date
            df = mkt_db.fetch_historical_data(start_date=date_str, end_date=date_str)
            return df if df is not None else pd.DataFrame(columns=['Symbol','Close'])
    
    
    
        # Initialize database connection and helper
        conn, cursor = DBHandler.get_connection()
        mkt_db = MktDB(conn, cursor)
    
        # Load static fundamentals and industry reference files
        fundamentals_df = pd.read_csv(r"src/main/resources/data/pe_data.csv")
        fundamentals_df.rename(columns={'trailingPE':'PE','bookValue':'BV','trailingEps':'EPS'}, inplace=True)
        industry_df = pd.read_csv(r"src/main/resources/data/Industry_data_with_returns.csv")
    
        # Prepare latest portfolio snapshot
        portfolio_df['Date'] = pd.to_datetime(portfolio_df['Date'], dayfirst=True)
        latest_date = portfolio_df['Date'].max()
        filtered = portfolio_df[portfolio_df['Date']==latest_date].copy()
    
        # Clean numeric columns
        filtered['Remaining Qty'] = pd.to_numeric(filtered.get('Remaining Qty', filtered.get('Remaining_Qty')), errors='coerce')
        filtered['Market Value']   = pd.to_numeric(filtered.get('Market Value', filtered.get('Market_Value')), errors='coerce')
        filtered['Deployed Amount']= pd.to_numeric(filtered.get('Deployed Amount', filtered.get('Deployed_Amount')), errors='coerce')
        filtered = filtered[filtered['Remaining Qty']>0]
        filtered['purchase_date'] = filtered['Date'].dt.strftime('%Y-%m-%d')
    
        # Merge reference data
        port = (
            filtered
            .merge(fundamentals_df, on='Symbol', how='left')
            .merge(industry_df[['Symbol','Basic_Industry']], on='Symbol', how='left')
        )
        port.dropna(subset=['EPS','PE','BV'], inplace=True)
    
        # Fetch today's market prices from DB
        db_latest = get_latest_date_from_db(mkt_db)
        today_df = get_market_data_for_date(mkt_db, db_latest)
        price_today = today_df.set_index('Symbol')['Close'].to_dict()
    
        # Compute portfolio-level metrics
        total_shares = port['Remaining Qty'].sum()
        total_value  = port['Market Value'].sum()
        current_metrics = {
            'eps': (port['EPS'] * port['Remaining Qty']).sum() / total_shares,
            'pe':  (port['PE']  * port['Market Value']).sum() / total_value,
            'bv':  (port['BV']  * port['Remaining Qty']).sum() / total_shares
        }
    
        # Build current_holdings
        current_holdings = []
        for _, row in port.iterrows():
            qty  = int(row['Remaining Qty'])
            mv   = round(row['Market Value'],2)
            inv  = float(row['Deployed Amount'])
            cost = inv/qty if qty else 0
            gain = mv - inv
            pct  = (gain/inv*100) if inv else 0
            current_holdings.append({
                'symbol': row['Symbol'],
                'qty': qty,
                'value': mv,
                'eps': row['EPS'],
                'pe': row['PE'],
                'bv': row['BV'],
                'base_symbol': row['Symbol'],
                'extra': 0.0,
                'invested_amount': round(inv,2),
                'cost_price': round(cost,2),
                'purchase_date': row['purchase_date'],
                'capital_gain': round(gain,2),
                'percent_return': round(pct,2)
            })
    
        # Build replacement_options
        replacement_options = {}
        for holding in current_holdings:
            base = holding['symbol']
            sector = port.loc[port['Symbol']==base, 'Basic_Industry'].iloc[0]
            orig_val = holding['value']
            pur_date = holding['purchase_date']
    
            # Historical prices on purchase_date
            hist_df = get_market_data_for_date(mkt_db, pur_date)
            hist_map = hist_df.set_index('Symbol')['Close'].to_dict()
    
            # Candidate pool
            sector_syms = industry_df[industry_df['Basic_Industry']==sector]['Symbol']
            cands = fundamentals_df[fundamentals_df['Symbol'].isin(sector_syms) & (fundamentals_df['Symbol']!=base)]
    
            opts = []
            for _, c in cands.iterrows():
                sym = c['Symbol']
                price_now = price_today.get(sym)
                price_then = hist_map.get(sym)
                if price_now is None: continue
                qty_new = int(orig_val/price_now)
                if qty_new<1: continue
                extra_amt = round(orig_val - qty_new*price_now,2)
                if price_then:
                    gain_c = round((price_now-price_then)*qty_new,2)
                    pct_c  = round(gain_c/(price_then*qty_new)*100,2)
                else:
                    gain_c, pct_c = None, None
                opts.append({
                    'symbol': sym,
                    'price': round(price_now,2),
                    'eps': c['EPS'],
                    'pe': c['PE'],
                    'bv': c['BV'],
                    'extra': extra_amt,
                    'capital_gain': gain_c,
                    'percent_return': pct_c
                })
            replacement_options[base] = opts
    
        return {
            'current_metrics': current_metrics,
            'current_holdings': current_holdings,
            'replacement_options': replacement_options
        }
        






   
if __name__ == "__main__":
    try:
        # print(f"Received Arguments: {sys.argv}")  # REMOVE THIS WHEN RETURNING JSON OUTPUT
    
        if len(sys.argv) != 4:
            print(json.dumps({"error": "Invalid number of arguments"}))
            sys.exit(1)
    
        # Read and parse JSON safely
        with open(sys.argv[1], 'r', encoding="utf-8") as file1:
            raw_data1 = file1.read().strip()
            # print(f"Raw JSON 1: {raw_data1[:500]}")
            try:
                results1Json = json.loads(raw_data1)
            except json.JSONDecodeError as e:
                print(json.dumps({"error": f"JSON Decode Error in File 1: {str(e)}"}))
                sys.exit(1)
    
        with open(sys.argv[2], 'r', encoding="utf-8") as file2:
            raw_data2 = file2.read().strip()
            try:
                results2Json = json.loads(raw_data2)
            except json.JSONDecodeError as e:
                print(json.dumps({"error": f"JSON Decode Error in File 2: {str(e)}"}))
                sys.exit(1)
    
        graphType = sys.argv[3]
        
        plot_result = VisualizeInsights.generate_graph(results1Json, results2Json, graphType)
    
        # Ensure correct JSON response
        print(json.dumps(plot_result, indent=4))
    
    except json.JSONDecodeError as je:
        print(json.dumps({"error": f"JSON Decode Error: {str(je)}"}))
    except Exception as e:
        print(json.dumps({"error": f"Exception occurred: {str(e)}"}))


# if __name__ == "__main__":
#     try:
#         # print(f"Received Arguments: {sys.argv}")
#
#         if len(sys.argv) != 4:
#             print(json.dumps({"error": "Invalid number of arguments"}))
#             sys.exit(1)
#
#         with open(sys.argv[1], 'r') as file1:
#             results1Json = json.load(file1)
#
#         with open(sys.argv[2], 'r') as file2:
#             results2Json = json.load(file2)
#
#         # Properly parse the JSON arguments
#         # results1Json = json.loads(sys.argv[1])
#         # results2Json = json.loads(sys.argv[2])
#         graphType = sys.argv[3]
#
#         # print(f"Parsed results1Json: {results1Json[:2]}")  # Debug first 2 elements
#         # print(f"Parsed results2Json: {results2Json[:2]}")
#         # print(f"Parsed graphType: {graphType}")
#
#         # Generate the graph
#         plot_result = VisualizeInsights.generate_graph(results1Json, results2Json, graphType)
#         print(plot_result)
#
#         # json_result = json.dumps(plot_result, indent=4)  # Ensures correct formatting
#         #
#         # print(json_result)  # Check the output
#
#     except Exception as e:
#         print(json.dumps({"error": f"Exception occurred: {str(e)}"}))



# if __name__ == "__main__":
#     if len(sys.argv) != 4:
#         print(json.dumps({"error": "Invalid arguments"}))
#     else:
#         results1_csv = sys.argv[1]
#         results2_csv = sys.argv[2]
#         graph_type = sys.argv[3]
#
#         plot_result = VisualizeInsights.generate_graph(results1_csv, results2_csv, graph_type)
#
#         # Ensure we return JSON output
#         if plot_result:
#            print(json.dumps(plot_result, default=str))
#         else:
#             print(json.dumps({"error": "Graph generation failed"}))

  
    
# if __name__ == "__main__":
#     if len(sys.argv) != 4:
#         print("Usage: python portfolio_visualizations.py <results1.csv> <results2.csv> <graph_type>")
#     else:
#         results1_csv = sys.argv[1]
#         results2_csv = sys.argv[2]
#         graph_type = sys.argv[3]
#
#         # Call the method correctly using the class name
#         plot_result = VisualizeInsights.generate_graph(results1_csv, results2_csv, graph_type)
#         # print(plot_result)
#         # print(json.dumps(plot_result))
#         print(plot_result)
#         # Print output in JSON format if applicable




