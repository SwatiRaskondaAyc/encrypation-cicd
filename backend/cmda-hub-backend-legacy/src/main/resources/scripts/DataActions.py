import os,shutil
import pandas as pd
# from nselib import capital_market

class DataActions:

    @staticmethod
    def slice_nse_fetched_data(df1Y):
        last_workday = df1Y['Date'].max()  # Get last share market working date

        df6M = df1Y.loc[(df1Y.Date >= last_workday - pd.DateOffset(months=6)) & (df1Y.Date <= last_workday)]#.reset_index(drop=True) # Last 6 Months
        df1M = df1Y.loc[(df1Y.Date >= last_workday - pd.DateOffset(months=1)) & (df1Y.Date <= last_workday)]#.reset_index(drop=True) # Last 1 Month
        df1W = df1Y.loc[(df1Y.Date >= last_workday - pd.DateOffset(days=7))   & (df1Y.Date <= last_workday)]#.reset_index(drop=True)   # Last 1 Week
        df1D = pd.DataFrame(df1Y.iloc[-1]).T
        
        return df1Y, df6M, df1M, df1W, df1D
    
    # @staticmethod
    # def extract_stock_info(user_selection):
    #     print(user_selection)
    #     stock_symbol, stock_name = user_selection.split('-')
    #     stock_symbol, stock_name = stock_symbol.strip(), stock_name.strip()
    #     print(stock_symbol, stock_name)
    #     return  stock_symbol, stock_name   
    
    @staticmethod
    def extract_stock_info(user_selection):
        # print(f"Raw Input: {user_selection}")  # Debugging Print
        try:
            stock_symbol, stock_name = user_selection.split('-')
            stock_symbol, stock_name = stock_symbol.strip(), stock_name.strip()
            # print(f"Extracted Symbol: {stock_symbol}, Extracted Name: {stock_name}")  # Debugging Print
            return stock_symbol, stock_name
        except ValueError:
            print(f"Error: Invalid format for symbol input: {user_selection}")
            return "", ""
    
    # @staticmethod
    # def extract_stock_info(symbol):
    #     """Splits the symbol string into stock symbol and name."""
    #     try:
    #         stock_symbol, stock_name = map(str.strip, symbol.split('-'))
    #         return stock_symbol.upper(), stock_name
    #     except ValueError:
    #         raise ValueError(f"Invalid symbol format: {symbol}. Expected 'SYMBOL - NAME' format.")



    @staticmethod
    def transform_nselib_data(df):
        """Perform data transformations on the input DataFrame."""

        # Rename columns to match expected column names
        df.columns = ['Symbol', 'Series', 'Date', 'Prev Close', 'Open', 'High', 'Low', 'Last Price',
                    'Close', 'Average Price', 'Total Traded Quantity','Total Traded Value',
                    'No. of Trades', 'Deliverable Qty', '% Dly Qty to Traded Qty']

        # Converting Data Types as Requirements
        df['Date'] = pd.to_datetime(df['Date'], format="%d-%b-%Y")  # Set index to Date
        df = df.set_index('Date')

        # Define a mapping of required types and conversion functions
        type_mapping = {
            'Prev Close': float, 'Open': float, 'High': float, 'Low': float,
            'Last Price': float, 'Close': float, 'Average Price': float,
            'Total Traded Quantity': int, 'No. of Trades': int,
            'Deliverable Qty': int, '% Dly Qty to Traded Qty': float
        }

        for column, required_type in type_mapping.items():
            # Convert the column to string type before using .str methods
            if df[column].dtype != object:
                df[column] = df[column].astype(str)

            if required_type == float:
                df[column] = pd.to_numeric(df[column].str.replace(',', ''), downcast='float', errors='coerce')
            elif required_type == int:
                df[column] = pd.to_numeric(df[column].str.replace(',', ''), downcast='integer', errors='coerce')
            elif column == '% Dly Qty to Traded Qty':
                df[column] = pd.to_numeric(df[column].str.replace({',': '', '%': ''}), downcast='float', errors='coerce')

        # Data Cleaning
        df = df.query("Series=='EQ'").copy()  # Filter only equity series data
        df = df[df['High'] != df['Low']].copy()  # Filter rows where High != Low

        # Data Extraction
        df['Spread'] = df['Open'] - df['Close']

        return df


    @staticmethod
    def _move_file_to_data_directory():
        """
        Move the file from the root directory to the data directory.
        """
        # Define the paths
        root_file_path = 'file.csv'  # Update with the actual file name
        data_directory = 'data'  # Update with the name of your data directory
        
        # Check if the data directory exists, create it if not
        if not os.path.exists(data_directory):
            os.makedirs(data_directory)
        
        # Define the destination file path
        destination_file_path = os.path.join(data_directory, os.path.basename(root_file_path))
        
        # Move the file to the data directory
        shutil.move(root_file_path, destination_file_path)

    
