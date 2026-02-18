import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
import yfinance as yf

import sys
import json
import pandas as pd
from DescriptiveVisualization import DescriptiveVisualization
from DataActions import DataActions
from market_summary import DescriptiveStats
from nse_data import NseDataActions
from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler
import datetime as dt
import warnings
warnings.filterwarnings('ignore')





class PricePrediction:
    
    @staticmethod
    def predict_for_open_price(df, for_open=True):

        data = df.copy()
        # print(data.tail())
        # List of columns to convert
        columns_to_convert = ['PrevClose', 'Open', 'High',
                            'Low', 'LastPrice', 'Close', 'AveragePrice']
        
        
        for col in columns_to_convert:
            data[col] = data[col].astype(str)

        # Convert columns to numeric
        for col in columns_to_convert:
            data[col] = data[col].str.replace(',', '').astype(float)
            
            
        # Convert datetime column
        data['Date'] = pd.to_datetime(data['Date']).dt.date

        # Percentage change in Close Price
        data['Pct_Change'] = data['Close'].pct_change() * 100  


        # Calculate daily price changes
        delta = data['Close'].diff()

        # Separate gains and losses
        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)

        # Calculate the average gain and loss
        window_length = 14
        avg_gain = gain.rolling(window=window_length, min_periods=1).mean()
        avg_loss = loss.rolling(window=window_length, min_periods=1).mean()

        # Calculate RS and RSI
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        data['RSI'] = rsi


        # Calculate the 12-day and 26-day EMAs
        ema_12 = data['Close'].ewm(span=12, adjust=False).mean()
        ema_26 = data['Close'].ewm(span=26, adjust=False).mean()

        # Calculate MACD line and Signal line
        data['MACD'] = ema_12 - ema_26
        data['Signal_Line'] = data['MACD'].ewm(span=9, adjust=False).mean()

        # Calculate divergence
        data['Divergence'] = (data['MACD'] - data['Signal_Line']).abs()

        # Identify crossover points as trend reversals
        data['Trend_Reversal'] = np.where(
            (data['MACD'] > data['Signal_Line']) & (data['MACD'].shift(1) <= data['Signal_Line']) |
            (data['MACD'] < data['Signal_Line']) & (data['MACD'].shift(1) >= data['Signal_Line']),
            1, 0
        )

        # Mark periods of continuous trend (not near crossover)
        lookback = 5
        data['Continuous_Trend'] = (~data['Trend_Reversal'].rolling(window=lookback).max().fillna(0).astype(bool)).astype(int)

        # Calculate mean divergence for continuous trends and trend reversals
        continuous_divergence = data[data['Continuous_Trend'] == 1]['Divergence']
        reversal_divergence = data[data['Trend_Reversal'] == 1]['Divergence']

        Continuous_Trend_Mean_Divergence = continuous_divergence.mean()
        Reversal_Mean_Divergence = reversal_divergence.mean()
        Threshold_Divergence = Continuous_Trend_Mean_Divergence + continuous_divergence.std()

        # Add features for divergence conditions
        data['Reversal_Imminent'] = np.where(data['Divergence'] < Reversal_Mean_Divergence, 1, 0)
        data['Reversal_Near'] = np.where(
            (data['Divergence'] >= Reversal_Mean_Divergence) & (data['Divergence'] < Continuous_Trend_Mean_Divergence),
            1, 0
        )
        data['Continuous_Trend_Active'] = np.where(data['Divergence'] >= Continuous_Trend_Mean_Divergence, 1, 0)

        # Add directional trends based on MACD and Signal Line
        data['Current_Trend'] = np.where(
            (data['MACD'] > data['Signal_Line']),
            1, 0  # 1 for upward trend, 0 for downward trend
        )






        # Convert a specific column to string
        data['TotalTradedQty'] = data['TotalTradedQty'].astype(str)
        data['TotalTradedValue'] = data['TotalTradedValue'].astype(str)
        data['TotalTrades'] = data['TotalTrades'].astype(str)
        data['DeliverableQty'] = data['DeliverableQty'].astype(str)
        data['DeliveryPercentage'] = data['DeliveryPercentage'].astype(str)


        # remove -
        data['TotalTradedQty'] = data['TotalTradedQty'].str.replace('-', '')  
        data['TotalTradedValue'] = data['TotalTradedValue'].str.replace('-', '')
        data['TotalTrades'] = data['TotalTrades'].str.replace('-', '')
        data['DeliverableQty'] = data['DeliverableQty'].str.replace('-', '')
        data['DeliveryPercentage'] = data['DeliveryPercentage'].str.replace('-', '')


        # remove ,
        data['TotalTradedQty'] = pd.to_numeric(data['TotalTradedQty'].str.replace(',', ''))  
        data['TotalTradedValue'] = pd.to_numeric(data['TotalTradedValue'].str.replace(',', ''))  
        data['TotalTrades'] = pd.to_numeric(data['TotalTrades'].str.replace(',', ''))  
        data['DeliverableQty'] = pd.to_numeric(data['DeliverableQty'].str.replace(',', '')) 
        data['DeliveryPercentage'] = pd.to_numeric(data['DeliveryPercentage'].str.replace(',', ''))  

        # Determine the target column based on the parameter
        target_column = 'Open' if for_open else 'Close'

        data = data.drop(columns=['Symbol', 'Series'])
        data.set_index('Date', inplace=True)
        data[target_column] = data[target_column].shift(-1)  # Shift target column for prediction



        # Prepare data for final prediction
        com_X = data.drop(columns=[target_column]).iloc[1:-1]
        com_y = data[target_column].iloc[1:-1]
        # print(com_X.info())
        # print('-------------------------------------------------------')
        # print(com_y)

        # Prepare data for final prediction
        com_X = data.drop(columns=[target_column]).iloc[1:-1]
        com_y = data[target_column].iloc[1:-1]
        com_X.fillna(0,inplace=True)
        com_y.fillna(0,inplace=True)


        # Define models
        model = ExtraTreesRegressor(random_state=42)
        model.fit(com_X, com_y)
        
        # Get prediction date
        prediction_date = data.index[-1] + pd.Timedelta(days=1)

        # Check if the prediction date is a weekend
        if prediction_date.weekday() == 5:  # Saturday
            prediction_date += pd.Timedelta(days=2)  # Move to Monday
        elif prediction_date.weekday() == 6:  # Sunday
            prediction_date += pd.Timedelta(days=1)  # Move to Monday



        result = model.predict(data.drop(columns=[target_column]).iloc[[-1]])[0]
        result = round(result, 2)
        prediction_date = pd.to_datetime(prediction_date).strftime('%d-%m-%Y')


        return prediction_date, result
    



    @staticmethod
    def extra_tree_sensex(df):

        data = df.copy()


        def fetch_nifty_sensex_data():
            # Download Nifty and Sensex data from Yahoo Finance


            # nifty = pd.read_csv('data/sensex_data/nifty_50.csv')  # Nifty 50 index
            nifty = pd.read_csv(f'src/main/resources/data/sensex_data/nifty_50.csv')
            nifty.reset_index(inplace=True)
            # Extract relevant columns and rename them
            nifty_data = nifty[['Open', 'Close', 'Volume','Date']].rename(columns={
                'Date':'Date',
                'Open': 'Nifty_Open', 
                'Close': 'Nifty_Close', 
                'Volume': 'Nifty_Volume'})
            nifty_data['Nifty_Pct_Change'] = nifty_data['Nifty_Close'].pct_change() * 100  # Calculate percentage change
            nifty_data["Date"] = pd.to_datetime(nifty_data["Date"])




            # sensex = pd.read_csv('data/sensex_data/bse_sensex.csv')   # Sensex index
            sensex = pd.read_csv(f'src/main/resources/data/sensex_data/bse_sensex.csv')
            sensex.reset_index(inplace=True)
            sensex_data = sensex[['Open', 'Close', 'Volume','Date']].rename(columns={
                'Date':'Date',
                'Open': 'Sensex_Open', 
                'Close': 'Sensex_Close', 
                'Volume': 'Sensex_Volume'})
            sensex_data['Sensex_Pct_Change'] = sensex_data['Sensex_Close'].pct_change() * 100  # Calculate percentage change
            sensex_data["Date"] = pd.to_datetime(sensex_data["Date"])



            return nifty_data, sensex_data

        def predict_for_open_price(data, for_open=True):

            # List of columns to convert
            columns_to_convert = ['PrevClose', 'Open', 'High',
                                'Low', 'LastPrice', 'Close', 'AveragePrice']

            for col in columns_to_convert:
                data[col] = data[col].astype(str)

            # Convert columns to numeric
            for col in columns_to_convert:
                data[col] = data[col].str.replace(',', '').astype(float)

            # Convert datetime column
            data['Date'] = pd.to_datetime(data['Date'])

            # Percentage change in Close Price
            data['Pct_Change'] = data['Close'].pct_change() * 100

            # Calculate daily price changes
            delta = data['Close'].diff()

            # Separate gains and losses
            gain = delta.clip(lower=0)
            loss = -delta.clip(upper=0)

            # Calculate the average gain and loss
            window_length = 14
            avg_gain = gain.rolling(window=window_length, min_periods=1).mean()
            avg_loss = loss.rolling(window=window_length, min_periods=1).mean()

            # Calculate RS and RSI
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))
            data['RSI'] = rsi

            # Calculate the 12-day and 26-day EMAs
            ema_12 = data['Close'].ewm(span=12, adjust=False).mean()
            ema_26 = data['Close'].ewm(span=26, adjust=False).mean()

            # Calculate MACD line and Signal line
            data['MACD'] = ema_12 - ema_26
            data['Signal_Line'] = data['MACD'].ewm(span=9, adjust=False).mean()

                        # Calculate divergence
            data['Divergence'] = (data['MACD'] - data['Signal_Line']).abs()

            # Identify crossover points as trend reversals
            data['Trend_Reversal'] = np.where(
                (data['MACD'] > data['Signal_Line']) & (data['MACD'].shift(1) <= data['Signal_Line']) |
                (data['MACD'] < data['Signal_Line']) & (data['MACD'].shift(1) >= data['Signal_Line']),
                1, 0
            )

            # Mark periods of continuous trend (not near crossover)
            lookback = 5
            data['Continuous_Trend'] = (~data['Trend_Reversal'].rolling(window=lookback).max().fillna(0).astype(bool)).astype(int)

            # Calculate mean divergence for continuous trends and trend reversals
            continuous_divergence = data[data['Continuous_Trend'] == 1]['Divergence']
            reversal_divergence = data[data['Trend_Reversal'] == 1]['Divergence']

            Continuous_Trend_Mean_Divergence = continuous_divergence.mean()
            Reversal_Mean_Divergence = reversal_divergence.mean()
            Threshold_Divergence = Continuous_Trend_Mean_Divergence + continuous_divergence.std()

            # Add features for divergence conditions
            data['Reversal_Imminent'] = np.where(data['Divergence'] < Reversal_Mean_Divergence, 1, 0)
            data['Reversal_Near'] = np.where(
                (data['Divergence'] >= Reversal_Mean_Divergence) & (data['Divergence'] < Continuous_Trend_Mean_Divergence),
                1, 0
            )
            data['Continuous_Trend_Active'] = np.where(data['Divergence'] >= Continuous_Trend_Mean_Divergence, 1, 0)

            # Add directional trends based on MACD and Signal Line
            data['Current_Trend'] = np.where(
                (data['MACD'] > data['Signal_Line']),
                1, 0  # 1 for upward trend, 0 for downward trend
            )

            # Convert specific columns to string and remove unwanted characters
            data['TotalTradedQty'] = data['TotalTradedQty'].astype(str).str.replace('-', '').str.replace(',', '')
            data['TotalTradedValue'] = data['TotalTradedValue'].astype(str).str.replace('-', '').str.replace(',', '')
            data['TotalTrades'] = data['TotalTrades'].astype(str).str.replace('-', '').str.replace(',', '')
            data['DeliverableQty'] = data['DeliverableQty'].astype(str).str.replace('-', '').str.replace(',', '')
            data['DeliveryPercentage'] = data['DeliveryPercentage'].astype(str).str.replace('-', '').str.replace(',', '')

            # Convert back to numeric
            data['TotalTradedQty'] = pd.to_numeric(data['TotalTradedQty'])
            data['TotalTradedValue'] = pd.to_numeric(data['TotalTradedValue'])
            data['TotalTrades'] = pd.to_numeric(data['TotalTrades'])
            data['DeliverableQty'] = pd.to_numeric(data['DeliverableQty'])
            data['DeliveryPercentage'] = pd.to_numeric(data['DeliveryPercentage'])

            # Calculate Spread (OpenPrice - ClosePrice)
            data['Spread'] = data['Open'] - data['Close']

            # Fetch Nifty and Sensex Data
            nifty_data, sensex_data = fetch_nifty_sensex_data()

            # Merge Nifty and Sensex data with the stock data
            data = data.merge(nifty_data,on='Date', how="left")
            data = data.merge(sensex_data, on='Date', how="left")

            # data = pd.merge(data, nifty_data[['Date', 'Nifty_Open', 'Nifty_Close', 'Nifty_Volume', 'Nifty_Pct_Change']], on='Date', how='left')
            # data = pd.merge(data, sensex_data[['Date', 'Sensex_Open', 'Sensex_Close', 'Sensex_Volume', 'Sensex_Pct_Change']], on='Date', how='left')


            # Determine the target column based on the parameter
            target_column = 'Open' if for_open else 'Close'

            # Drop unwanted columns
            data = data.drop(columns=['Symbol', 'Series'])
            data.set_index('Date', inplace=True)
            data[target_column] = data[target_column].shift(-1)  # Shift target column for prediction

            # Prepare data for final prediction
            com_X = data.drop(columns=[target_column]).iloc[1:-1]
            com_y = data[target_column].iloc[1:-1]

            com_X = com_X.fillna(com_X.mean())
            com_y = com_y.fillna(com_y.mean())

            # print(com_X.info())
            # print('-------------------------------------------------------')
            # print(com_y)

        

            # Define models
            model = ExtraTreesRegressor(random_state=42)
            model.fit(com_X, com_y)
            
            # Get prediction date
            prediction_date = data.index[-1] + pd.Timedelta(days=1)

            # Check if the prediction date is a weekend
            if prediction_date.weekday() == 5:  # Saturday
                prediction_date += pd.Timedelta(days=2)  # Move to Monday
            elif prediction_date.weekday() == 6:  # Sunday
                prediction_date += pd.Timedelta(days=1)  # Move to Monday

            result = model.predict(data.drop(columns=[target_column]).iloc[[-1]])[0]
            result = round(result, 2)
            prediction_date = pd.to_datetime(prediction_date).strftime('%d-%m-%Y')

            return prediction_date, result

        
        prediction_date, result = predict_for_open_price(data,for_open=True)
        return prediction_date,result

    



    @staticmethod
    def predict_price_direction(df):

        data = df.copy()

                # Convert datetime column
        data['Date'] = pd.to_datetime(data['Date']).dt.date

        # Percentage change in Close Price
        data['Pct_Change'] = data['Close'].pct_change() * 100  


        # Calculate daily price changes
        delta = data['Close'].diff()

        # Separate gains and losses
        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)

        # Calculate the average gain and loss
        window_length = 14
        avg_gain = gain.rolling(window=window_length, min_periods=1).mean()
        avg_loss = loss.rolling(window=window_length, min_periods=1).mean()

        # Calculate RS and RSI
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        data['RSI'] = rsi


        # Calculate the 12-day and 26-day EMAs
        ema_12 = data['Close'].ewm(span=12, adjust=False).mean()
        ema_26 = data['Close'].ewm(span=26, adjust=False).mean()

        # Calculate MACD line and Signal line
        data['MACD'] = ema_12 - ema_26
        data['Signal_Line'] = data['MACD'].ewm(span=9, adjust=False).mean()
    



        data['PriceDiff'] = data['Open']-data['Close']

        data['PriceAction'] = data.apply(lambda row: 1 if row['Open'] < row['Close'] else 0, axis=1)

        test = data[['Date','Open','Close','DeliveryPercentage','MACD','Signal_Line','RSI','PriceAction','PriceDiff']]

        # Step 1: Calculate daily returns
        test['Daily_Return'] = test['Close'].pct_change()

        # Step 2: Calculate rolling volatility
        window = 20  # Define the window size for rolling calculation (e.g., 20 days)
        test['Volatility'] = test['Daily_Return'].rolling(window=window).std()*np.sqrt(window)

        test.dropna(inplace=True)

        test = test[['Date', 'Open', 'Close','PriceDiff','DeliveryPercentage', 'MACD', 'Signal_Line', 'RSI','Volatility','PriceAction']]
        
        test['Spread'] = test['Open']-test['Close']

        median_val = np.median(test['Spread'])
        
        # Get the latest record's PriceDiff
        latest_price_diff = test.iloc[-1]['PriceDiff']

        # Compute interval bounds
        interval_lower = latest_price_diff - median_val
        interval_upper = latest_price_diff + median_val

        # Filter rows where PriceDiff lies within the interval
        filtered_records = test[(test['PriceDiff'] >= interval_lower) & (test['PriceDiff'] <= interval_upper)]
        
        x= filtered_records[(filtered_records['MACD']<=(filtered_records['MACD'].median()+filtered_records['MACD'].std())) 
                    &(filtered_records['MACD']>=(filtered_records['MACD'].median()-filtered_records['MACD'].std()))]
        
        if x.empty:
            x= filtered_records[(filtered_records['RSI']<=(filtered_records['RSI'].median()+filtered_records['RSI'].std())) 
                &(filtered_records['RSI']>=(filtered_records['RSI'].median()-filtered_records['RSI'].std()))]
        

        
        def get_next_day_records(test, x):
    
            # Ensure 'Date' is in datetime format
            test['Date'] = pd.to_datetime(test['Date'])
            x['Date'] = pd.to_datetime(x['Date'])

            # Create a next-day date column in filtered_records
            x['NextDate'] = x['Date'] + pd.Timedelta(days=1)

            # Merge on the next day date
            result_records = pd.merge(
                x[['Date', 'NextDate']],
                test,
                left_on='NextDate',
                right_on='Date',
                suffixes=('', '_next')
            )

            # Drop extra columns
            result_records = result_records.drop(columns=['NextDate'])

            return result_records
        
        result_records = get_next_day_records(test,x)
        
        marginal_prob_macd = result_records['PriceAction'].value_counts(normalize=True)
        
        # Extracting the most probable outcome
        if not marginal_prob_macd.empty:
            most_probable_action = marginal_prob_macd.idxmax()
            probability = marginal_prob_macd.max()  # The highest probability
        else:
            # Handle the case when the series is empty
            most_probable_action = None  # Or any fallback value or logic
            probability=None


        if probability is not None:
            if most_probable_action == 0:
                statement = f"There is a {probability:.2f} probability that the price may decrease after the open."
            else:
                statement = f"There is a {probability:.2f} probability that the price may increase after the open."
        else:
            statement = "Cannot predict whether the price will increase or decrease due to unavailable data."


        return statement 







def generate_prediction(symbol):
    # Validate the input format
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
        # print(today,end_date,start_date)
        Stock_df = mkt_db.fetch_historical_data(symbols=stock_symbol_list, start_date=start_date, end_date=end_date)
        Stock_df['Date'] = pd.to_datetime(Stock_df['Date'])  
        
        Stock_df = Stock_df.sort_values(by='Date',ascending=True)
        Stock_df.rename(columns={'AvgPrice':'AveragePrice','TurnoverInRs':'TotalTradedValue','DeliveryPct':'DeliveryPercentage'},inplace=True)    



        # Perform predictions
        df1Y, df6M, df1M, df1W, df1D = DataActions.slice_nse_fetched_data(Stock_df)
        prediction_date, predicted_open = PricePrediction.predict_for_open_price(df1Y, for_open=True)
        prediction_date2, predicted_open2 = PricePrediction.extra_tree_sensex(df1Y)

        # # Ensure dates are properly formatted
        # if isinstance(prediction_date, datetime):
        #     prediction_date = prediction_date.strftime("%Y-%m-%d")
        # if isinstance(prediction_date2, datetime):
        #     prediction_date2 = prediction_date2.strftime("%Y-%m-%d")

        # Prepare JSON response
        result = {
            "symbol": stock_symbol,
            "company_name": stock_name,
            "prediction1": {
                "date": prediction_date,
                "predicted_open": predicted_open
            },
            "prediction2": {
                "date": prediction_date2,
                "predicted_open": predicted_open2
            }
        }
        return result

    except Exception as e:
        return {"error": f"Error processing request: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Stock symbol is required"}))
        sys.exit(1)

    symbol = " ".join(sys.argv[1:])
    result = generate_prediction(symbol)

    # Output result in JSON format
    print(json.dumps(result))