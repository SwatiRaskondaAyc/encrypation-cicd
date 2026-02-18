# import sys
# import json
# import pandas as pd
# from DescriptiveVisualization import DescriptiveVisualization
# from DataActions import DataActions
# from market_summary import DescriptiveStats
# from nse_data import NseDataActions
#
#
# def generate_values(symbol):
#     # Validate the input format
#     if '-' not in symbol:
#         return {"error": f"Invalid format: {symbol}. Expected 'SYMBOL - NAME' format."}
#
#     nse_symbols_list, nse_scrips_list = NseDataActions.get_nse_scrips_list()
#
#     try:
#         stock_symbol, stock_name = DataActions.extract_stock_info(symbol)
#         # print(stock_symbol)
#         stock_file_path = f"src/main/resources/EquityHub/NSE_data/{stock_symbol}.csv"
#
#         # Load the CSV file into Stock_df
#         Stock_df = pd.read_csv(stock_file_path)
#         if 'Unnamed: 0' in Stock_df.columns:
#             Stock_df.drop(columns='Unnamed: 0', inplace=True)
#         Stock_df['Spread'] = Stock_df['Open'] - Stock_df['Close']
#         Stock_df['Date'] = pd.to_datetime(Stock_df['Date'])
#         cutoff_date = pd.to_datetime('now') - pd.DateOffset(years=1)
#         Stock_df = Stock_df[Stock_df['Date'] >= cutoff_date]
#
#     except Exception as e:
#         return {"error": f"Error processing request: {str(e)}"}
#
#     def pack_values(Stock_df, stock_name, stock_symbol):
#         values_dict = {}
#
#         # Use stock_symbol instead of user_selection
#         face_value_df = pd.read_csv(r'src/main/resources/EquityHub/Face_value_Equity_list.csv', index_col='Symbol')
#
#         face_value = face_value_df.loc[stock_symbol, 'Face value'] if stock_symbol in face_value_df.index else None
#
#         values_dict['User_Selection'] = {
#             'stock_name': stock_name,
#             'stock_symbol': stock_symbol,
#             'selected_period': 'Previous Day',
#             'face_value': face_value
#         }
#
#         # Add the market summary
#         values_dict['MarketSummary'] = DescriptiveStats.marketSummary(Stock_df)
#         # print("Successfully calculated market summary values ...")
#
#         return values_dict
#
#     values_dict = pack_values(Stock_df, stock_name, stock_symbol)  # Use Stock_df instead of df1Y
#     return values_dict  # Ensure function returns the dictionary
#
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print(json.dumps({"error": "Missing required argument: <symbol>"}))
#         sys.exit(1)
#
#     symbol = " ".join(sys.argv[1:])  # Extract symbol correctly
#     plot_result = generate_values(symbol)
#
#     print(json.dumps(plot_result, default=str))

import sys
import json
import pandas as pd
from pathlib import Path
from DescriptiveVisualization import DescriptiveVisualization
from DataActions import DataActions
from market_summary import DescriptiveStats
from nse_data import NseDataActions
from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler
import datetime as dt
import warnings
warnings.filterwarnings('ignore')

def generate_values(symbol):
    
    conn, cursor = DBHandler.get_connection()
    # if conn is None:
        # print(json.dumps({"error": "Database connection failed"}))
        # sys.exit(1)
    mkt_db = MktDB(conn, cursor)

    # Validate the input format
    if '-' not in symbol:
        return {"error": f"Invalid format: {symbol}. Expected 'SYMBOL - NAME' format."}

    # # print(f"Raw Symbol Argument: {symbol}")
    # stock_symbol, stock_name = DataActions.extract_stock_info(symbol)
    # print(f"Extracted Symbol: {stock_symbol}, Extracted Name: {stock_name}")


    nse_symbols_list, nse_scrips_list = NseDataActions.get_nse_scrips_list()
   
    try:
        stock_symbol, stock_name = DataActions.extract_stock_info(symbol)
        # stock_file_path = f"EquityHub/NSE_data/{stock_symbol}.csv"
        # stock_file_path = f"src/main/resources/EquityHub/NSE_data/{stock_symbol}.csv"
        # Ensure all dates are converted to pandas Timestamps
        # print(stock_symbol)
        stock_symbol_list = [stock_symbol] if isinstance(stock_symbol, str) else list(stock_symbol)

        today = pd.Timestamp.today().normalize()  # Converts to Timestamp with time reset to 00:00:00
        end_date = today.strftime('%Y-%m-%d')
        start_date = (today - pd.DateOffset(years=1)).strftime('%Y-%m-%d')
        
        Stock_df = mkt_db.fetch_historical_data(symbols=stock_symbol_list, start_date=start_date, end_date=end_date)
        Stock_df['Date'] = pd.to_datetime(Stock_df['Date'])  
        Stock_df.rename(columns={'AvgPrice':'AveragePrice','TurnoverInRs':'TotalTradedValue','DeliveryPct':'DeliveryPercentage'},inplace=True) 
        Stock_df = Stock_df.sort_values(by='Date',ascending=True)
    except Exception as e:
        return {"error": f"Error processing request: {str(e)}"}

    def pack_values(Stock_df, stock_name, stock_symbol):
        values_dict = {}
    
        
        # face_value_file = f"EquityHub/Face_value_Equity_list.csv"
        face_value_file = f"src/main/resources/EquityHub/Face_value_Equity_list.csv"
        
        if face_value_file:
            face_value_df = pd.read_csv(face_value_file, index_col='Symbol')
            face_value = face_value_df.loc[stock_symbol, 'Face value'] if stock_symbol in face_value_df.index else None
        else:
            face_value = None
            

        values_dict['User_Selection'] = {
            'stock_name': stock_name,
            'stock_symbol': stock_symbol,
            'selected_period': 'Previous Day',
            'face_value': face_value
        }

        # Add market summary
        values_dict['MarketSummary'] = DescriptiveStats.marketSummary(Stock_df)

        return values_dict


    values_dict = pack_values(Stock_df, stock_name, stock_symbol)
    return values_dict

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing required argument: <symbol>"}))
        sys.exit(1)

    symbol = " ".join(sys.argv[1:])  # Correctly extract symbol
    # print(f"Received args: {sys.argv}")  # Debugging log

    result = generate_values(symbol)
    print(json.dumps(result, default=str))
