# from cmda_data_manager.data_fetcher.mkt_db import MktDB
# from cmda_data_manager.utils.db_handler import DBHandler
# import pandas as pd
#
# # Establish database connection
# conn, cursor = DBHandler.get_connection()
# mkt_db = MktDB(conn, cursor)
#
# # Define test parameters
# test_symbol = "TCS"  # Replace with an actual symbol in your database
# start_date = "2024-01-01"
# end_date = "2024-02-01"
#
# # Fetch data for the given symbol
# df = mkt_db.fetch_daily_tf_data(symbols=[test_symbol], start_date=start_date, end_date=end_date)
#
# # Display results
# if df is not None and not df.empty:
#     print(f"Data fetched successfully for {test_symbol}:")
#     print(df.info())  # Display first few rows
# else:
#     print(f"No data found for {test_symbol} in the given date range.")



import sys
import json
import pandas as pd
from DescriptiveVisualization import DescriptiveVisualization
from DataActions import DataActions
from market_summary import DescriptiveStats
from nse_data import NseDataActions
from ML_algorithms import PricePrediction
from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler
import datetime as dt
import warnings
warnings.filterwarnings('ignore')

# mkt_db.
def generate_plot(symbol, plot_type):
    
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
        # Load the CSV file into Stock_df
        # Stock_df = pd.read_csv(stock_file_path)
        # if 'Unnamed: 0' in Stock_df.columns:
        #     Stock_df.drop(columns='Unnamed: 0',inplace=True)
        #
        # Stock_df['Spread'] = Stock_df['Open'] - Stock_df['Close']
        # Stock_df['Date'] = pd.to_datetime(Stock_df['Date'])
        # cutoff_date = pd.to_datetime('now') - pd.DateOffset(years=1)
        # Stock_df = Stock_df[Stock_df['Date'] >= cutoff_date]
        # print(cutoff_date)


        stock_json = Stock_df.to_json(orient='records', date_format='iso')


        # df1Y, df6M, df1M, df1W, df1D = NseDataActions.get_nse_scrip_1y_data(stock_symbol)

        df1Y, df6M, df1M, df1W, df1D = DataActions.slice_nse_fetched_data(Stock_df)
        # print(df1D)

        # (prediction_date,predicted_open) = Price_Prediction.predict_for_open_price(df1Y,for_open=True)
        # (prediction_date2,predicted_open2) = Price_Prediction.extra_tree_sensex(df1Y)
        #
        # print(prediction_date,predicted_open,prediction_date2,predicted_open2)



    # Generate the appropriate visualization based on plot type
        # if plot_type == "candle_breach":
        #    return DescriptiveVisualization.candle_breach_analysis(json.loads(stock_json))
        #
        # elif plot_type == "candle_spread":
        #     return DescriptiveVisualization.candle_spread_distribution(json.loads(stock_json))
        if plot_type == "candle_spread":
           return DescriptiveVisualization.candle_spread_distribution(json.loads(stock_json))

        elif plot_type == "candle_breach":
            return DescriptiveVisualization.candle_breach_analysis(json.loads(stock_json))

        elif plot_type == "last_traded_price":
            return DescriptiveVisualization.last_traded_price_box_plot(json.loads(stock_json))

        elif plot_type == "avg_box":
            return DescriptiveVisualization.create_avg_box_plot(json.loads(stock_json))

        elif plot_type == "worm_plot":
            return DescriptiveVisualization.create_worm_plot(json.loads(stock_json))

        elif plot_type == "macd_plot":
            return DescriptiveVisualization.create_macd_plot(json.loads(stock_json))

        elif plot_type == "sensex_vs_stock_corr_bar":
            return DescriptiveVisualization.sensex_vs_stock_corr_bar(json.loads(stock_json),stock_symbol)

        elif plot_type == "sensex_vs_stock_corr":
            return DescriptiveVisualization.sensex_vs_stock_corr(json.loads(stock_json),stock_symbol)

        elif plot_type == "corr_heatmap":
            return DescriptiveVisualization.corr_heatmap(json.loads(stock_json),stock_symbol)

        elif plot_type == "delivrey_rate_gauge":
            return DescriptiveVisualization.delivery_rate_gauge(json.loads(stock_json))

        elif plot_type == "predict_volatility":
            return DescriptiveVisualization.predict_volatility(json.loads(stock_json))

        elif plot_type == "industry_bubble":
            return DescriptiveVisualization.create_industry_bubble_plot(stock_symbol)
        
        elif plot_type == "technical_plot":
            return DescriptiveVisualization.create_technical_plot(json.loads(stock_json))

        else:
            return {"error": f"Unknown plot type: {plot_type}"}

    except Exception as e:
        return {"error": f"Error processing request: {str(e)}"}


if __name__ == "__main__":
  # Ensure command-line arguments are passed correctly
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing required arguments: <plot_type> <symbol>"}))
        sys.exit(1)
    
    plot_type = sys.argv[1]
    symbol = " ".join(sys.argv[2:])  # Join the remaining arguments as the full symbol string
    
    # plot_type = sys.argv[1]
    # symbol = " ".join(sys.argv[2:])  # Join the remaining arguments as the full symbol string

    # symbol = " ".join(sys.argv[1:])
    # plot_type =  sys.argv[3] # Join the remaining arguments as the full symbol string

    # Generate plot data
    plot_result = generate_plot(symbol, plot_type)

    # Output result in JSON format
    print(json.dumps(plot_result, default=str))









