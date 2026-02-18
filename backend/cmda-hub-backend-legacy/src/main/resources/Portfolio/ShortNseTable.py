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


# # def analyze_data(file_path, platform):
# #
# #     df = pd.read_csv(file_path)
# #
# #     if platform == "Axis Bank":
# #         df = df
# #     elif platform == "Zerodha":
# #         df = df
# #     elif platform =="Other":
# #         df = df
# #
# #
# #     # Check if Trade_Date is stored as a float (Excel serial date)
# #     if pd.api.types.is_numeric_dtype(df["Trade_Date"]):
# #         # print("Detected Excel serial date format. Converting...")
# #         df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], origin='1899-12-30', unit='D')
# #     else:
# #         df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], format='%d-%m-%Y', errors='coerce')
# #
# #     # Check if conversion failed
# #     if df["Trade_Date"].isnull().all():
# #         print("Warning: Trade_Date column could not be converted to datetime.")
# #     else:
# #         df["Trade_Date"] = df["Trade_Date"].dt.strftime('%d-%m-%Y')
# #
# #     return df


def portfolio(df):

    # df=pd.read_csv(file_path)

    response_data = {}
    message = column_names = snippet = None
    non_nse_scrips = nse_scrips = []
    # short_qty_table = []
    short_qty_table = pd.DataFrame()
    is_table_empty = is_non_nse_empty = []
    transaction_tab  = None
    # sample_file_path = r'data\portf_data\temp_results\sample_data.csv'

    if df is not None:
        column_names, snippet, message = UserFileHandler.get_preview(df) 

     # Check if Trade_Date is stored as a float (Excel serial date)
    # if pd.api.types.is_numeric_dtype(df["Trade_Date"]):
    #     # print("Detected Excel serial date format. Converting...")
    #     df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], origin='1899-12-30', unit='D')
    # else:
    #     df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], format='%d-%m-%Y', errors='coerce')
    #
    # # Check if conversion failed
    # if df["Trade_Date"].isnull().all():
    #     print("Warning: Trade_Date column could not be converted to datetime.")
    # else:
    #     df["Trade_Date"] = df["Trade_Date"].dt.strftime('%d-%m-%Y')

    transaction_tab, non_nse_scrips, nse_scrips, short_qty_table = UserFileHandler.transform_transaction_tab(df)

    # Check if the table is empty    

    # is_table_empty = isinstance(short_qty_table, pd.DataFrame) and short_qty_table.empty
    #
    # is_table_empty = short_qty_table.empty)
    # print(short_qty_table)
    if isinstance(short_qty_table, pd.DataFrame):
            is_table_empty = short_qty_table.empty
    else:
            print(f"Error: Expected DataFrame, but got {type(short_qty_table)}")
            return None, None  # Return None to avoid crash


    # Convert to HTML if not empty
    if not is_table_empty:
        short_qty_table = short_qty_table
    else:
        short_qty_table = None


    # Check if the array is empty
    is_non_nse_empty = len(non_nse_scrips) == 0

    # Convert to list if not empty for easier manipulation in the template
    if not is_non_nse_empty:
        # non_nse_scrips = non_nse_scrips.tolist()
        non_nse_scrips = non_nse_scrips.tolist()


    return  non_nse_scrips, short_qty_table


# # def save_and_return_results(file_path, platform):
# #
# #     # Function to convert np.float64 to Python float
# #     def convert_np_floats(obj):
# #         if isinstance(obj, np.float64):
# #             return float(obj)
# #         elif isinstance(obj, dict):
# #             return {k: convert_np_floats(v) for k, v in obj.items()}
# #         elif isinstance(obj, list):
# #             return [convert_np_floats(v) for v in obj]
# #         return obj
# #
# #     # Check if file exists, silently ignore if not found
# #     if not os.path.exists(file_path):
# #         return  # Simply return without printing anything
# #
# #     # print(f"Processing file: {file_path}, Platform: {platform}")
# #
# #     df = analyze_data(file_path, platform)
# #     non_nse_scrips, short_qty_table = portfolio(df)
# #
# #
# #     results_json = {
# #         "nonNseScript": non_nse_scrips,  # Directly using list
# #         "shrtQtytable": short_qty_table 
# #     }
# #
# #     # results_json["nonNseScript"] = [
# #     #     {k: (v.strftime('%Y-%m-%d') if isinstance(v, pd.Timestamp) else v) for k, v in row.items()}
# #     #     for row in results_json["nonNseScript"]
# #     # ]
# #     #
# #     # results_json["shrtQtytable"] = [
# #     #     {k: (v.strftime('%Y-%m-%d') if isinstance(v, pd.Timestamp) else v) for k, v in row.items()}
# #     #     for row in results_json["shrtQtytable"]
# #     # ]
# #     # Print JSON output (this will be captured by Java)
# #     converted_data = convert_np_floats(results_json)
# #     json_output = json.dumps(converted_data, indent=4)  # Pretty print for debugging
# #     print(json_output)  # Check JSON structure

#New Code ----------------------------

def save_and_return_results(file_path):
    if not os.path.exists(file_path):
        print(json.dumps({"error": "JSON file not found"}))
        return

    with open(file_path, 'r') as f:
        data = json.load(f)

    df = pd.DataFrame(data)

    def convert_np_floats(obj):
        if isinstance(obj, np.float64):
            return float(obj)
        elif isinstance(obj, dict):
            return {k: convert_np_floats(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_np_floats(v) for v in obj]
        return obj

    non_nse_scrips, short_qty_table = portfolio(df)

    results_json = {
        "nonNseScript": non_nse_scrips if non_nse_scrips else [],
        "shrtQtytable": short_qty_table.to_dict(orient="records") if short_qty_table is not None else []
    }

    converted_data = convert_np_floats(results_json)
    json_output = json.dumps(converted_data, indent=4)
    print(json_output)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Invalid arguments"}))
    else:
        file_path = sys.argv[1]
        save_and_return_results(file_path)


#----------------------------------------

# def save_and_return_results(file_path):
#
#     # df=pd.read_csv(file_path)
#
#     with open(file_path, 'r') as f:
#         data = json.load(f)
#     df = pd.DataFrame(data)
#
#     # Function to convert np.float64 to Python float
#     def convert_np_floats(obj):
#         if isinstance(obj, np.float64):
#             return float(obj)
#         elif isinstance(obj, dict):
#             return {k: convert_np_floats(v) for k, v in obj.items()}
#         elif isinstance(obj, list):
#             return [convert_np_floats(v) for v in obj]
#         return obj
#
#     # Check if file exists, silently ignore if not found
#     if not os.path.exists(file_path):
#         return  # Simply return without printing anything
#
#
#
#     # **Fixing return order**
#     non_nse_scrips, short_qty_table = portfolio(df)
#
#     results_json = {
#         "nonNseScript": non_nse_scrips if non_nse_scrips else [],
#         "shrtQtytable": short_qty_table.to_dict(orient="records") if short_qty_table is not None else []
#     }
#
#     # Convert any NumPy floats in the dictionary
#     converted_data = convert_np_floats(results_json)
#
#     # **Convert to JSON properly**
#     json_output = json.dumps(converted_data, indent=4)
#     print(json_output)  # Check JSON structure
#
#
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print(json.dumps({"error": "Invalid arguments"}))
#     else:
#         json_file_path = sys.argv[1]
#         if not os.path.exists(json_file_path):
#             print(json.dumps({"error": "JSON file not found"}))
#         else:
#             with open(json_file_path, "r") as f:
#                 json_data = json.load(f)
#                 df = pd.DataFrame(json_data)
#                 save_and_return_results(df)

    
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print(json.dumps({"error": "Invalid arguments"}))
#     else:
#         file_path = sys.argv[1]
#         save_and_return_results(file_path)



#--------------USing Database ------------------------------

# import sys
# import pandas as pd
# import json
# from incomplete_scrips import IncompleteScrips
# from user_file_handler import UserFileHandler
# from portfolio_results_packer import PortfolioResultPacket
# import os
# import numpy as np
# import warnings
# warnings.filterwarnings("ignore")
#
#
# def parse_trade_date_column(df):
#     if "Trade_Date" not in df.columns:
#         print("Warning: 'Trade_Date' column not found in the DataFrame.")
#         return df
#
#     if pd.api.types.is_numeric_dtype(df["Trade_Date"]):
#         df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], origin='1899-12-30', unit='D')
#     else:
#         df["Trade_Date"] = pd.to_datetime(df["Trade_Date"], format='%d-%m-%Y', errors='coerce')
#
#     if df["Trade_Date"].isnull().all():
#         print("Warning: Trade_Date column could not be converted to datetime.")
#     else:
#         df["Trade_Date"] = df["Trade_Date"].dt.strftime('%d-%m-%Y')
#
#     return df
#
#
# def portfolio(df):
#     response_data = {}
#     message = column_names = snippet = None
#     non_nse_scrips = []
#     short_qty_table = pd.DataFrame()
#     transaction_tab = None
#
#     if df is not None:
#         column_names, snippet, message = UserFileHandler.get_preview(df)
#
#     df = parse_trade_date_column(df)
#
#     try:
#         transaction_tab, non_nse_scrips, nse_scrips, short_qty_table = UserFileHandler.transform_transaction_tab(df)
#     except Exception as e:
#         print(f"Error during transform_transaction_tab: {e}")
#         return [], []
#
#     # Handle short_qty_table
#     if not isinstance(short_qty_table, pd.DataFrame):
#         print(f"Warning: Expected short_qty_table as DataFrame, got {type(short_qty_table)}")
#         short_qty_table = pd.DataFrame()
#
#     # Ensure non_nse_scrips is a list
#     if isinstance(non_nse_scrips, np.ndarray):
#         non_nse_scrips = non_nse_scrips.tolist()
#     elif not isinstance(non_nse_scrips, list):
#         non_nse_scrips = list(non_nse_scrips)  # Convert iterable to list safely
#
#     return non_nse_scrips, short_qty_table
#
#
# def convert_np_floats(obj):
#     if isinstance(obj, np.float64):
#         return float(obj)
#     elif isinstance(obj, dict):
#         return {k: convert_np_floats(v) for k, v in obj.items()}
#     elif isinstance(obj, list):
#         return [convert_np_floats(v) for v in obj]
#     return obj
#
#
# def save_and_return_results(file_path):
#     if not os.path.exists(file_path):
#         print(json.dumps({"error": "JSON file not found"}))
#         return
#
#     try:
#         with open(file_path, 'r') as f:
#             data = json.load(f)
#     except Exception as e:
#         print(json.dumps({"error": f"Failed to load JSON: {e}"}))
#         return
#
#     if not isinstance(data, list):
#         print(json.dumps({"error": "Expected list of records in JSON"}))
#         return
#
#     df = pd.DataFrame(data)
#
#     non_nse_scrips, short_qty_table = portfolio(df)
#
#     results_json = {
#         "nonNseScript": non_nse_scrips if non_nse_scrips else [],
#         "shrtQtytable": short_qty_table.to_dict(orient="records") if not short_qty_table.empty else []
#     }
#
#     converted_data = convert_np_floats(results_json)
#     print(json.dumps(converted_data, indent=4))
#
#
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print(json.dumps({"error": "Invalid arguments"}))
#     else:
#         file_path = sys.argv[1]
#         save_and_return_results(file_path)

        