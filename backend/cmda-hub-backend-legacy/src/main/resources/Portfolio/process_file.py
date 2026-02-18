import sys
import pandas as pd
import json
from incomplete_scrips import IncompleteScrips
from user_file_handler import UserFileHandler
from portfolio_results_packer import PortfolioResultPacket
import os
import numpy as np
import warnings
warnings.filterwarnings("ignore")


def analyze_data(file_path, platform):
    
    df = pd.read_csv(file_path)
        
    if platform == "Axis Bank":
        df = df
    elif platform == "Zerodha":
        df = df
    elif platform =="Other":
        df = df
        
        
        


    # Check if Trade_Date is stored as a float (Excel serial date)
    if pd.api.types.is_numeric_dtype(df["Trade_Date"]):
        # print("Detected Excel serial date format. Converting...")
        df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], origin='1899-12-30', unit='D')
    else:
        df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], format='%d-%m-%Y', errors='coerce')

    # Check if conversion failed
    if df["Trade_Date"].isnull().all():
        print("Warning: Trade_Date column could not be converted to datetime.")
    else:
        df["Trade_Date"] = df["Trade_Date"].dt.strftime('%d-%m-%Y')

    return df





def portfolio(df):
    # df=pd.read_csv(file_path)
    response_data = {}
    message = column_names = snippet = None
    latest_portfolio_snippet = latest_portfolio_insights =  None
    unique_scrip_names = []
    portfolio_data = []
    non_nse_scrips = nse_scrips = []
    # short_qty_table = []
    short_qty_table = pd.DataFrame()
    is_table_empty = is_non_nse_empty = []
    transaction_tab  = None
    temp_file_path = None  # Default initialization
    # sample_file_path = r'data\portf_data\temp_results\sample_data.csv'

    if df is not None:
        column_names, snippet, message = UserFileHandler.get_preview(df) 
        

    transaction_tab, non_nse_scrips, nse_scrips, short_qty_table = UserFileHandler.transform_transaction_tab(df)

    # Check if the table is empty    
    
    # is_table_empty = isinstance(short_qty_table, pd.DataFrame) and short_qty_table.empty
    #
    # is_table_empty = short_qty_table.empty)
    # print(short_qty_table)
    
    
    # if isinstance(short_qty_table, pd.DataFrame):
    #         is_table_empty = short_qty_table.empty
    # else:
    #         print(f"Error: Expected DataFrame, but got {type(short_qty_table)}")
    #         return None, None  # Return None to avoid crash
    #
    #
    #
    # # Convert to HTML if not empty
    # if not is_table_empty:
    #     short_qty_table = short_qty_table
    # else:
    #     short_qty_table = None


    # Check if the array is empty
    # is_non_nse_empty = len(non_nse_scrips) == 0
    #
    # # Convert to list if not empty for easier manipulation in the template
    # if not is_non_nse_empty:
    #     # non_nse_scrips = non_nse_scrips.tolist()
    #     non_nse_scrips = non_nse_scrips.tolist()
        
        
    # print("short table ",short_qty_table,non_nse_scrips)

    portfolio_fifo_results = PortfolioResultPacket.get_portfolio_fifo_results(transaction_tab)  


    portfolio_fifo_results_df = pd.DataFrame.from_dict({
        (pd.to_datetime(date, dayfirst=True), stock): data
        for date, stocks in portfolio_fifo_results.items()
        for stock, data in stocks.items()
    }, orient='index')
    


    portfolio_fifo_results_df.index.names = ['Date', 'Scrip']

    portfolio_fifo_results_df.reset_index(inplace=True)
    
    portfolio_fifo_results_df.set_index(['Date', 'Scrip'], inplace=True)

    unique_scrip_names = portfolio_fifo_results_df.index.get_level_values('Scrip').unique().tolist()
    
    portfolio_fifo_results_df.reset_index(inplace=True)
    
    
    latest_date = portfolio_fifo_results_df["Date"].max()
    # latest_data = portfolio_fifo_results_df[portfolio_fifo_results_df["Date"] == latest_date]
    latest_data = portfolio_fifo_results_df[portfolio_fifo_results_df["Date"] == latest_date].copy()
    # Filter data where Remaining Qty > 0
    filtered_latest_data = latest_data[latest_data['Remaining Qty'] > 0]
    # print(filtered_latest_data[['Symbol','Remaining Qty','Realized PNL']])


    return portfolio_fifo_results_df, transaction_tab

def save_and_return_results(file_path, platform):
    
    # Function to convert np.float64 to Python float
    def convert_np_floats(obj):
        if isinstance(obj, np.float64):
            return float(obj)
        elif isinstance(obj, dict):
            return {k: convert_np_floats(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_np_floats(v) for v in obj]
        return obj
    
    # Check if file exists, silently ignore if not found
    if not os.path.exists(file_path):
        return  # Simply return without printing anything

    # print(f"Processing file: {file_path}, Platform: {platform}")
    
    df = analyze_data(file_path, platform)
    portfolio_fifo_results_df, transaction_tab = portfolio(df)
    
    results_json = {
        "portfolio_results": portfolio_fifo_results_df.to_dict(orient="records"),
        "transactions": transaction_tab.to_dict(orient="records"),
    } 
     
     # Convert Timestamp objects to string
    results_json["portfolio_results"] = [
        {k: (v.strftime('%Y-%m-%d') if isinstance(v, pd.Timestamp) else v) for k, v in row.items()}
        for row in results_json["portfolio_results"]
    ]
    
    results_json["transactions"] = [
        {k: (v.strftime('%Y-%m-%d') if isinstance(v, pd.Timestamp) else v) for k, v in row.items()}
        for row in results_json["transactions"]
    ]
    
    # Print JSON output (this will be captured by Java)
    converted_data = convert_np_floats(results_json)
    json_output = json.dumps(converted_data, indent=4)  # Pretty print for debugging
    print(json_output)  # Check JSON structure

    
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Invalid arguments"}))
    else:
        file_path = sys.argv[1]
        platform = sys.argv[2]
        save_and_return_results(file_path, platform)
# if __name__ == "__main__":
#
#     file_path = sys.argv[1]
#     platform = sys.argv[2]  # Join the remaining arguments as the full symbol string
#     # Import sys module to use command-line arguments
#     transaction_tab = analyze_data(file_path, platform)
#
#     result = portfolio(transaction_tab)
#     print(json.dumps(result))
