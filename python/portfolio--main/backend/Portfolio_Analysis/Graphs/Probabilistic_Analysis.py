import logging
import pandas as pd
from collections import deque
import plotly.graph_objects as go

# Use your centralized cleaner & utils
from File_Handler.utils.JSON_Cleaner import convert_to_serializable
from File_Handler.utils.utils import normalise_portfolio_columns

logger = logging.getLogger(__name__)

def create_best_trade_plot(transaction_df: pd.DataFrame) -> dict:
    """
    Performs a probabilistic analysis on closed trades to determine the Win/Loss ratio.
    A "Win" is any closed trade with a positive return.
    """
    config = {"displayModeBar": False, "displaylogo": False, "modeBarButtons": [["toImage"]]}

    try:
        if transaction_df.empty:
            return {"error": "Empty transaction data provided."}

        # 1. Per-Trade FIFO Calculation to get all closed trades
        # NOTE: This logic is duplicated from Rebalancing.py.
        # A future refactor could be to have a single FIFO engine that returns this data.
        df = transaction_df.copy()
        df['Trade_Date'] = pd.to_datetime(df['Trade_Date'])
        df['Qty'] = pd.to_numeric(df['Qty'], errors='coerce').fillna(0)
        df['Mkt_Price'] = pd.to_numeric(df['Mkt_Price'], errors='coerce').fillna(0)
        
        symbol_col = 'Symbol' if 'Symbol' in df.columns else 'Scrip_Name'
        df = df.sort_values([symbol_col, 'Trade_Date'])
        
        closed_trades = []
        
        for scrip, group in df.groupby(symbol_col):
            buy_queue = deque()
            for _, row in group.iterrows():
                qty = float(row['Qty'])
                price = float(row['Mkt_Price'])
                typ = str(row['Order_Type']).upper().strip()
                
                if typ.startswith('B'):
                    buy_queue.append({'qty': qty, 'price': price})
                else: # Sell
                    qty_to_sell = qty
                    while qty_to_sell > 0 and buy_queue:
                        buy_lot = buy_queue[0]
                        matched_qty = min(qty_to_sell, buy_lot['qty'])
                        
                        if buy_lot['price'] > 0:
                            roi = (price - buy_lot['price']) / buy_lot['price']
                            closed_trades.append({'Symbol': scrip, 'Return': roi})
                        
                        qty_to_sell -= matched_qty
                        buy_lot['qty'] -= matched_qty
                        if buy_lot['qty'] < 0.0001:
                            buy_queue.popleft()

        if not closed_trades:
            return {"error": "No closed trades found to analyze.", "config": config}

        # 2. Calculate Win/Loss Stats
        trades_df = pd.DataFrame(closed_trades)
        
        win_count = len(trades_df[trades_df['Return'] > 0])
        loss_count = len(trades_df[trades_df['Return'] <= 0])
        total_trades = win_count + loss_count
        
        win_rate = (win_count / total_trades) * 100 if total_trades > 0 else 0

        # 3. Create Pie Chart
        labels = ['Winning Trades', 'Losing Trades']
        values = [win_count, loss_count]
        colors = ['#4CAF50', '#F44336']

        fig = go.Figure(data=[go.Pie(
            labels=labels,
            values=values,
            hole=.4,
            marker_colors=colors,
            hoverinfo='label+percent',
            textinfo='value',
            textfont_size=20
        )])

        fig.update_layout(
            title_text=f"<b>Trade Win/Loss Ratio ({total_trades} Trades)</b>",
            annotations=[dict(
                text=f'<b>{win_rate:.1f}%</b><br>Win Rate',
                x=0.5, y=0.5, font_size=24, showarrow=False
            )],
            showlegend=True,
            height=500,
            template='plotly_white'
        )

        fig_dict = convert_to_serializable(fig.to_dict())
        return {"figure": fig_dict, "config": config}

    except Exception as e:
        logger.error(f"Probabilistic Analysis Error: {e}")
        return {"error": str(e), "config": config}
