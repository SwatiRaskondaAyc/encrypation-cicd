# import numpy as np
# import pandas as pd
# import os
# import sys
# import json
# from datetime import datetime
# import warnings
#
# warnings.filterwarnings("ignore")
#
# class OwnPortfolio:
#
#     @staticmethod
#     def get_data_for_portfolio_building():
#         # Paths
#         market_data_folder = r"src/main/resources/data/portf_data/market_bhav"
#         fundamentals_file = r"src/main/resources/data/pe_data.csv"
#
#         def get_latest_csv(folder_path):
#             csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]
#             latest_file = max(csv_files, key=lambda x: datetime.strptime(x.split('.')[0], '%d-%m-%Y'))
#             return os.path.join(folder_path, latest_file)
#
#         # Load price data
#         price_df = pd.read_csv(get_latest_csv(market_data_folder))
#
#         # Load fundamentals
#         fundamentals_df = pd.read_csv(fundamentals_file)
#         fundamentals_df.rename(columns={
#             'trailingPE': "pe",
#             'bookValue': "bv",
#             'trailingEps': "eps"
#         }, inplace=True)
#
#         # # Merge
#         # merged_df = price_df.merge(fundamentals_df, on='Symbol', how='left')
#         #
#         # # Replace NaNs with None
#         # merged_df = merged_df.where(pd.notnull(merged_df), None)
#         #
#         # # Convert to JSON-serializable dict
#         # stock_data = merged_df.to_dict(orient='records')
#
#         # Merge
#         merged_df = price_df.merge(fundamentals_df, on='Symbol', how='left')
#
#         # Replace NaNs and infinite values with None
#         merged_df = merged_df.replace([np.nan, np.inf, -np.inf], None)
#         merged_df = merged_df.where(pd.notnull(merged_df), None)
#
#         # Convert to JSON-serializable dict
#         stock_data = merged_df.to_dict(orient='records')
#
#
#         return stock_data
#
#
# if __name__ == "__main__":
#     try:
#         plot_result = OwnPortfolio.get_data_for_portfolio_building()
#         # print(json.dumps(plot_result, allow_nan=False))
#         print(json.dumps({"portfolio_data": plot_result}, allow_nan=False))
#
#
#     except json.JSONDecodeError as je:
#         print(json.dumps({"error": f"JSON Decode Error: {str(je)}"}))
#     except ValueError as ve:
#         print(json.dumps({"error": f"Value Error: {str(ve)}"}))
#     except Exception as e:
#         print(json.dumps({"error": f"Exception occurred: {str(e)}"}))






import numpy as np
import pandas as pd
import os
import sys
import json
from datetime import datetime, date
import warnings
from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler


warnings.filterwarnings("ignore")

def convert_to_serializable(obj):
    if isinstance(obj, (np.ndarray, pd.Series)):
        return obj.tolist()  # Convert NumPy array to list
    elif isinstance(obj, (pd.Timestamp, np.datetime64, datetime, date)):
        return obj.isoformat()  # Convert datetime to string
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    else:
        return obj  # Return other types as-is

class OwnPortfolio:

    @staticmethod
    def get_data_for_portfolio_building():

        # Initialize DB connection
        conn, cursor = DBHandler.get_connection()
        mkt_db = MktDB(conn, cursor)

        # Load static fundamentals file
        fundamentals_file = r"src/main/resources/data/pe_data.csv"

        # Fetch latest market data from DB
        # 1) Get latest trading date
        latest_date = mkt_db._get_lastest_date()  # returns a datetime.date
        # 2) Fetch closing prices for that date
        price_df = mkt_db.fetch_historical_data(
            start_date=latest_date.strftime('%Y-%m-%d'),
            end_date=latest_date.strftime('%Y-%m-%d')
        )

        # Load fundamentals and rename
        fundamentals_df = pd.read_csv(fundamentals_file)
        fundamentals_df.rename(columns={
            'trailingPE': "pe", 'bookValue': "bv", 'trailingEps': "eps"
        }, inplace=True)

        # Merge on Symbol
        merged_df = price_df.merge(fundamentals_df, on='Symbol', how='left')

        # Replace NaNs and infinite values with None for JSON safety
        merged_df = merged_df.replace([np.nan, np.inf, -np.inf], None)
        merged_df = merged_df.where(pd.notnull(merged_df), None)

        # Convert to JSON-serializable list of dicts
        stock_data = merged_df.to_dict(orient='records')

        return stock_data

if __name__ == "__main__":
    try:
       plot_result = OwnPortfolio.get_data_for_portfolio_building()
       serializable_result = convert_to_serializable(plot_result)
       print(json.dumps({"portfolio_data": serializable_result}, allow_nan=False))

    except json.JSONDecodeError as je:
        print(json.dumps({"error": f"JSON Decode Error: {str(je)}"}))
    except ValueError as ve:
        print(json.dumps({"error": f"Value Error: {str(ve)}"}))
    except Exception as e:
        print(json.dumps({"error": f"Exception occurred: {str(e)}"}))

