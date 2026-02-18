# import sys
# import pandas as pd
#
# def check_stock_in_csv(symbol):
#     try:
#         # Load the CSV file
#         df = pd.read_csv("src/main/resources/EquityHub/NSE_Equity_list.csv")
#         # Check if the symbol exists
#         if symbol in df['Symbol'].values:
#             return f"Stock symbol {symbol} found in the CSV."
#         else:
#             return f"Stock symbol {symbol} not found in the CSV."
#     except Exception as e:
#         return f"Error reading CSV: {str(e)}"
#
#
#
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("Error: Stock symbol argument is missing.")
#         sys.exit(1)
#
#     symbol = sys.argv[1]
#     result = check_stock_in_csv(symbol)
#     print(result)


# from nse_data import NseDataActions
# import sys
#
# def get_stock_info(symbol):
#     """Check if the given symbol exists in the NSE symbols list."""
#     try:
#         # Call the method to check if the symbol exists
#         result = NseDataActions.check_symbol_in_list(symbol)
#         return result
#
#
#
#
#     except Exception as e:
#         return f"Error: {str(e)}"
#
# if __name__ == "__main__":
#     # Example user input
#     # user_input = "RELIANCE"
#     symbol = sys.argv[1]
#     result = get_stock_info(symbol)
#     print(result)

import sys
from nse_data import NseDataActions
from DescResultPacket import DescResultPacket
from DataActions import DataActions

def get_stock_info(symbol):
    try:
        # Validate the input format
        if '-' not in symbol:
            return f"Invalid format: {symbol}. Expected 'SYMBOL - NAME' format."

        # Extract symbol and name
        stock_symbol, stock_name = DataActions.extract_stock_info(symbol)

        # Check if the symbol exists in the database/list
        result = NseDataActions.check_symbol_in_list(stock_symbol)
        if "not found" in result:
            return result
        else:
            return f"Stock symbol {stock_symbol} ({stock_name}) found in the list."
    except Exception as e:
        return f"Error: {str(e)}"

def get_descriptive_analysis(symbol, percent_change_sensex=None):
    """Fetch descriptive analysis and related data."""
    try:
        # Ensure symbol has a separator; add it manually if not
        if '-' not in symbol:
            symbol += " - Unknown"  # Add a default name if missing
        
        # Fetch descriptive analysis
        master_dict = DescResultPacket.get_descriptive_analysis_and_data(symbol, percent_change_sensex)
        # return result
        # print(master_dict.keys())
        # values_dict = master_dict['values_dict']
        # plots_dict = master_dict['plots_dict']
        
        return master_dict
    except Exception as e:
        return f"Error fetching descriptive analysis: {str(e)}"

if __name__ == "__main__":
    # Example user input
    symbol = sys.argv[1]  # Get symbol from command line argument (from React/Java Spring backend)
    percent_change_sensex = float(sys.argv[2]) if len(sys.argv) > 2 else None  # Optional percent_change_sensex

    # Check if symbol is valid
    symbol_check_result = get_stock_info(symbol)
    print(symbol_check_result)

    if "not found" not in symbol_check_result:
        # Fetch and print descriptive analysis if symbol is valid
        descriptive_analysis = get_descriptive_analysis(symbol, percent_change_sensex)
        print(descriptive_analysis)
