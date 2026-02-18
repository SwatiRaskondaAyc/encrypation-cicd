import numpy as np
import pandas as pd
import os
import plotly.express as px
import plotly.graph_objs as go
import plotly.subplots as sp
import plotly.figure_factory as ff
from babel.numbers import format_decimal, format_currency
from collections import deque
import datetime
import json
import sys

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
    
def top_10_Scrips_combined():
    
    try:
        # Attempt to read CSV file
        portfolio_df = pd.read_csv('src/main/resources/data/portf_data/RESULTS1.CSV')

        latest_date = portfolio_df['Date'].max()
        latest_data = portfolio_df[portfolio_df['Date']==latest_date]

        ''' Combining the visual of Top 10 Scrips by Brokerage, Realized PNL, and Unrealized PNL with a dropdown '''
        # Top 10 by Brokerage
        top10_brokerage = latest_data.nlargest(10, 'Brokerage Amount')
        top10_brokerage['Scrip'] = top10_brokerage['Scrip'].str.replace(' ', '<br>')

        trace_brokerage = go.Bar(
            x=top10_brokerage['Scrip'],
            y=(top10_brokerage['Brokerage Amount'] / 100000),  # Convert to lakhs
            text=top10_brokerage['Brokerage Amount'].round(),
            textposition='auto',
            name='Top 10 Scrips by Brokerage',
            marker_color='#a0e548',
            visible=True  # Initially visible
        )

        # Top 10 by Realized PNL
        top10_realized_pnl = latest_data.nlargest(10, 'Realized PNL')
        top10_realized_pnl['Scrip'] = top10_realized_pnl['Scrip'].str.replace(' ', '<br>')

        trace_realized_pnl = go.Bar(
            x=top10_realized_pnl['Scrip'],
            y=top10_realized_pnl['Realized PNL'] / 100000,  # Convert to lakhs
            text=top10_realized_pnl['Realized PNL'].round(),
            textposition='auto',
            name='Top 10 Scrips by Realized PNL',
            marker_color='#e45f2b',
            visible=False  # Initially hidden
        )

        # Top 10 by Unrealized PNL
        top10_unrealized_pnl = latest_data.nlargest(10, 'Unrealized PNL')
        top10_unrealized_pnl['Scrip'] = top10_unrealized_pnl['Scrip'].str.replace(' ', '<br>')

        trace_unrealized_pnl = go.Bar(
            x=top10_unrealized_pnl['Scrip'],
            y=top10_unrealized_pnl['Unrealized PNL'] / 100000,  # Convert to lakhs
            text=top10_unrealized_pnl['Unrealized PNL'].round(),
            textposition='auto',
            name='Top 10 Scrips by Unrealized PNL',
            marker_color='#f6c445',
            visible=False  # Initially hidden
        )

        # Create the figure with all traces
        fig = go.Figure(data=[
                trace_brokerage,        # Initially visible
                trace_realized_pnl,    # Initially hidden
                trace_unrealized_pnl    # Initially hidden
            ])

        # Update layout
        fig.update_layout(
            title=dict(text='Top 10 Scrips by Brokerage',  # Default title
                    font=dict(size=20, color='black', family='Arial'),  # Title font properties
                    x=0.5,  # Center title
                    xanchor='center',  # Center alignment
                    yanchor='top'  # Anchor title at the top
                ),
            xaxis=dict(title='Scrip'),
            yaxis=dict(title='Amount (in Lakhs)'),
            height=500,  # Adjust height as needed
            autosize=True,
            updatemenus=[{
                'buttons': [
                    {
                        'label': 'Top 10 Scrips by Brokerage',
                        'method': 'update',
                        'args': [{'visible': [True, False, False]},
                                                         {'title': 'Top 10 Scrips by Brokerage'}]  # Show brokerage only
                    },
                    {
                        'label': 'Top 10 Scrips by Realized PNL',
                        'method': 'update',
                        'args': [{'visible': [False, True, False]},
                                 {'title': 'Top 10 Scrips by Realized PNL'} ]  # Show realized PNL only
                    },
                    {
                        'label': 'Top 10 Scrips by Unrealized PNL',
                        'method': 'update',
                        'args': [{'visible': [False, False, True]},
                                 {'title': 'Top 10 Scrips by Unrealized PNL'}]  # Show unrealized PNL only
                    }
                ],
                'direction': 'down',
                'showactive': True,
                'x': 1.2,
                'xanchor': 'right',
                'y': 1.2,
                'yanchor': 'top'
            }]
        )

        fig_dict = fig.to_dict()
        
        fig_searlization = convert_ndarray(fig_dict)
        # Return the figure in JSON format
        return {
            #json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
            "figure": fig_searlization
            }
    except Exception as e:
        return json.dumps({"error": str(e)})
    
if __name__ == "__main__":
    # Import sys module to use command-line arguments
    json_path = sys.argv[1]
    result = top_10_Scrips_combined()
    print(json.dumps(result))


