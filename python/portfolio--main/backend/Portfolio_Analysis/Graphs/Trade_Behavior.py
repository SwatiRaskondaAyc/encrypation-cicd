"""
Trade Behavior Analysis Module (Redefined)

Purpose:
For every stock ever owned, display a daily bar graph of performance.
- Y-Axis: Unrealized Profit for that day
- X-Axis: Timeline (First Buy -> Last Sell)
- Sell Day Coloring:
  - Bearish Candle -> GOOD SELL (Green)
  - Bullish Candle -> BAD SELL (Red)

Uses:
- RepeatedCalc for P/L timeline
- Candle Classifier for Sell Days
- Fincode Mapper for data fetching
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

from Portfolio_Analysis.Calculations.repeated_calc import RepeatedCalc
from mtm.repo.price_action import PriceAction
# from mtm.candle_patterns.classifier import classify_candle
from File_Handler.utils.fincode_mapper import get_symbol_fincode_mapping

logger = logging.getLogger(__name__)


def analyze_trade_behavior(transaction_df: pd.DataFrame):
    """
    Main entry point for Trade Behavior analysis.
    Returns:
        dict with graph_data (per-stock daily bars)
    """
    try:
        # 1. Calculate Daily P/L Timeline using RepeatedCalc
        calc = RepeatedCalc(transaction_df)
        results_df = calc.calculate_results()
        
        if results_df.empty:
            return {"error": "No portfolio history generated"}
            
        fifo_df = calc.get_fifo_table()
        
        # 2. Prepare Data
        # Get all unique symbols in history
        symbols = results_df['Symbol'].unique().tolist()
        min_date = results_df['Date'].min()
        max_date = results_df['Date'].max()
        
        # Extend max_date by 7 days to analyze missed opportunity
        fetch_max_date = max_date + timedelta(days=7)
        if fetch_max_date > datetime.now():
            fetch_max_date = datetime.now()
        
        # Map to Fincodes for OHLC Fetch
        sym_to_fin, fin_to_sym = get_symbol_fincode_mapping(symbols)
        mapped_symbols = list(sym_to_fin.keys()) if sym_to_fin else symbols
        
        # Fetch OHLC for Candle Analysis
        ohlc_df = pd.DataFrame()
        try:
            price_repo = PriceAction(symbols=mapped_symbols)
            # Fetch with a buffer for candle patterns if needed
            ohlc_df = price_repo.fetch_historical_data(mapped_symbols, min_date, fetch_max_date)
        except Exception as e:
            logger.error(f"OHLC fetch failed: {e}")
            
        # Create lookup for OHLC: (Symbol, Date) -> Row
        ohlc_lookup = {}
        if not ohlc_df.empty:
            ohlc_df['Date'] = pd.to_datetime(ohlc_df['Date'])
            ohlc_df = ohlc_df.drop_duplicates(subset=['Symbol', 'Date'], keep='last')
            # Sort for slicing
            ohlc_df = ohlc_df.sort_values(['Symbol', 'Date'])
            ohlc_lookup = ohlc_df.set_index(['Symbol', 'Date']).to_dict('index')
            
        # 3. Process Per Stock
        stocks_data = {}
        
        for symbol in symbols:
            stock_timeline = results_df[results_df['Symbol'] == symbol].sort_values('Date').copy()
            stock_sells = fifo_df[fifo_df['Symbol'] == symbol].copy() if not fifo_df.empty else pd.DataFrame()
            
            # Identify and Aggregate Sell Dates
            sell_map = {} # Date -> {quantity, avg_price}
            if not stock_sells.empty:
                stock_sells['Sell_Date'] = pd.to_datetime(stock_sells['Sell_Date'])
                # Calculate Weighted Average Sell Price per Date
                stock_sells['Total_Sell_Val'] = stock_sells['Sell_Qty'] * stock_sells['Sell_Price']
                daily_sells = stock_sells.groupby('Sell_Date').agg({
                    'Sell_Qty': 'sum',
                    'Total_Sell_Val': 'sum'
                }).reset_index()
                daily_sells['Avg_Price'] = daily_sells['Total_Sell_Val'] / daily_sells['Sell_Qty']
                
                for _, row in daily_sells.iterrows():
                    d_key = row['Sell_Date'].normalize() # Ensure timestamp matches
                    sell_map[d_key] = {
                        'qty': row['Sell_Qty'],
                        'price': row['Avg_Price']
                    }
                    
            sell_dates = set(sell_map.keys())
            
            bars = []
            
            first_buy = stock_timeline['Date'].min()
            last_sell = stock_timeline['Date'].max() # Or actual last sell date
            
            cumulative_pnl = 0
            
            for _, row in stock_timeline.iterrows():
                date = row['Date'] # Timestamp
                
                # Default: Holding Bar
                bar_type = 'hold'
                classification = 'Holding'
                candle_color = 'neutral'
                reason = ""
                potential_gain = 0
                missed_profit_msg = ""
                
                pnl = row['Unrealized_PNL']
                
                # Check for Sell
                # normalize date for comparison
                check_date = date.normalize()
                is_sell_day = check_date in sell_dates
                
                # Note: RepeatedCalc results show 'Qty' REMAINING at EOD. 
                # For display, we want the timeline of holding.
                qty = row['Qty']
                
                # If we sold everything today, Qty is 0 and Unrealized P/L is 0.
                # To make the bar visible, we should show the REALIZED P/L locked in today.
                if is_sell_day and qty < 0.001 and abs(pnl) < 0.001:
                     # Use the Total Realized P/L for this stock up to this point?
                     # Or just the P/L realized on this specific day?
                     # The row['Realized_PNL'] is CUMULATIVE realized P/L.
                     # But for the graph, showing the Cumulative Realized P/L as the "Exit Value" makes sense.
                     pnl = row['Realized_PNL']
                
                if is_sell_day:
                    sell_info = sell_map[check_date]
                    sold_qty = sell_info['qty']
                    sell_price = sell_info['price']
                    
                    # 7-Day Lookahead Logic (Simplified per user request)
                    # "if the stock values goes higher than at point where the person sold it then it was bad sell"
                    # "if the profit does not go higher than where he sold it then he made a good sell"
                    
                    # Get future data
                    future_mask = (ohlc_df['Symbol'] == symbol) & (ohlc_df['Date'] > date) & (ohlc_df['Date'] <= date + timedelta(days=7))
                    future_data = ohlc_df.loc[future_mask]
                    
                    missed_profit_msg = ""
                    potential_gain = 0
                    
                    if not future_data.empty:
                        # Use Max(Close) to avoid intraday noise per user complaint
                        max_future_close = future_data['Close'].max()
                        
                        if max_future_close > sell_price:
                            # Bad Sell: Price went higher later
                            bar_type = 'bad_sell'
                            classification = 'Bad Sell'
                            candle_color = 'red'
                            
                            diff = max_future_close - sell_price
                            missed_gain = diff * sold_qty
                            potential_gain = round(missed_gain, 2)
                            
                            reason = f"Price closed higher (Max: {round(max_future_close, 2)}) in next 7 days."
                            missed_profit_msg = f"Missed Profit: ₹{potential_gain} (High: ₹{round(max_future_close,2)})"
                        else:
                            # Good Sell: Price stayed same or went lower
                            bar_type = 'good_sell'
                            classification = 'Good Sell'
                            candle_color = 'green'
                            reason = f"Price did not close higher than {round(sell_price, 2)} in next 7 days."
                            missed_profit_msg = "Great timing! No missed profit."
                    else:
                        # No future data (sold today or very recently)
                        bar_type = 'good_sell' 
                        classification = 'Sell (Recent)'
                        candle_color = 'neutral'
                        reason = "Not enough future data to analyze."
                
                bars.append({
                    "date": date.strftime('%Y-%m-%d'),
                    "pnl": round(pnl, 2),
                    "qty": qty,
                    "type": bar_type,
                    "classification": classification,
                    "candle_color": candle_color,
                    "reason": reason,
                    "missed_profit": missed_profit_msg
                })

                # Check if this was a FULL EXIT. 
                # If so, inject Ghost Bars IMMEDIATELY and break loop to stop drawing flat line.
                if is_sell_day and qty < 0.001:
                    # Generate Ghost Bars for next 7 days
                    # User request: "show if the the user hadent sond any stock... how much profit or loss would he be in"
                    # This means we need to Calculate Hypothetical UNREALIZED P/L based on original Buy Average.
                    
                    # Recover Implied Buy Average from the data right before exit (or current row if using realized)
                    # Use sell_info for quantity reference.
                    # We need the cost basis. 
                    # Realized PNL on this trade = (Sell_Price - Buy_Avg) * Sold_Qty
                    # Buy_Avg = Sell_Price - (Realized_PNL / Sold_Qty)
                    
                    sell_info = sell_map[check_date]
                    ref_qty = sell_info['qty']
                    ref_price = sell_info['price'] # This is Sell Price
                    
                    # 'row' here has Realized_PNL for the *cumulative* position? 
                    # If this is the last day, Realized_PNL is total P/L.
                    # This might get tricky if multiple buys/sells. 
                    # Simplified assumption: For the Ghost Bar visualization of "This Exited Position",
                    # we want to see the trend relative to the EXIT.
                    # BUT user specifically said "how much profit or loss would he be in". 
                    # That implies continuity from previous bars. 
                    
                    # Let's try to infer Cost Basis from the previous day's Unrealized P/L if possible, 
                    # OR just derive it from the Sell:
                    # If we made a profit of X on the sell, and price drops by Y, profit becomes X-Y.
                    # So: Hypothetical_PNL = Realized_PNL_At_Exit + (Current_Price - Sell_Price) * Qty
                    # This maintains exact continuity with the "Red/Green" bar which shows Realized_PNL.
                    
                    base_pnl = pnl # The realized P/L shown on the sell bar
                    
                    curr_date = date + timedelta(days=1)
                    days_added = 0
                    
                    while days_added < 7:
                        ohlc_item = ohlc_lookup.get((symbol, curr_date))
                        if ohlc_item:
                            close_price = ohlc_item['Close']
                            
                            # Difference from Sell Price
                            price_diff_from_sell = close_price - ref_price
                            
                            # Hypothetical Total P/L if we hadn't sold = (Old Profit) + (New Gain/Loss)
                            hypothetical_total_pnl = base_pnl + (price_diff_from_sell * ref_qty)
                            
                            # Color logic: Gray, but maybe hint direction? User asked for gray ghost bars.
                            ghost_type = 'post_exit_bad' if price_diff_from_sell > 0 else 'post_exit_good'
                            
                            bars.append({
                                "date": curr_date.strftime('%Y-%m-%d'),
                                "pnl": round(hypothetical_total_pnl, 2),
                                "qty": 0,
                                "type": ghost_type,
                                "classification": "Post-Exit Analysis (Hypothetical)",
                                "candle_color": "neutral",
                                "reason": f"If held: ₹{round(hypothetical_total_pnl, 2)} (Price: {round(close_price,2)})",
                                "missed_profit": ""
                            })
                            days_added += 1
                        
                        curr_date += timedelta(days=1)
                        if curr_date > datetime.now():
                            break
                    
                    # Stop processing this stock's timeline (ignore subsequent flat realized P/L days)
                    break
                
            # Summary metrics
            total_days = (stock_timeline['Date'].max() - stock_timeline['Date'].min()).days
            final_pnl = stock_timeline.iloc[-1]['Realized_PNL'] + stock_timeline.iloc[-1]['Unrealized_PNL']
            
            stocks_data[symbol] = {
                "bars": bars,
                "summary": {
                    "first_buy": first_buy.strftime('%Y-%m-%d'),
                    "last_activity": last_sell.strftime('%Y-%m-%d'),
                    "days_held": total_days,
                    "final_pnl": round(final_pnl, 2),
                    "is_active": stock_timeline.iloc[-1]['Remaining_Qty'] > 0
                }
            }
            
        return {
            "graph_data": {
                "stocks": stocks_data
            }
        }

    except Exception as e:
        logger.error(f"Trade behavior analysis error: {e}", exc_info=True)
        return {"error": str(e)}
