# import pandas as pd
#
# class NseDataActions:
#     @staticmethod
#     def get_nse_scrips_list():
#         """Returns:
#         A List of symbols (nse_symbols_list) and a List of tuples (nse_scrips_list)
#         for use on a web page.
#         """
#         nse_scrips_df = pd.read_csv(r'src/main/resources/EquityHub/NSE_Equity_list.csv')
#         col_names = [col.strip().capitalize() for col in nse_scrips_df.columns]  # Clean column names
#         nse_scrips_df.columns = col_names
#         nse_symbols_list = nse_scrips_df['Symbol'].to_list()
#         nse_scrips_list = nse_scrips_df[['Name of company', 'Symbol']].apply(tuple, axis=1).to_list()
#
#         return nse_symbols_list, nse_scrips_list
#
#     @staticmethod
#     def check_symbol_in_list(symbol):
#         """Checks if a given symbol exists in the list of NSE symbols."""
#         nse_symbols_list, _ = NseDataActions.get_nse_scrips_list()
#         if symbol.upper() in nse_symbols_list:  # Case-insensitive match
#             return f"Stock symbol '{symbol}' found in the list."
#         else:
#             return f"Stock symbol '{symbol}' not found in the list."
#
#
# if __name__ == "__main__":
#     # Test functionality
#     symbols, scrips = NseDataActions.get_nse_scrips_list()
#     print("Symbols:", symbols)
#     print("Scrips:", scrips)
#
#     # Example check
#     # symbol_to_check = "RELIANCE"
#     print(NseDataActions.check_symbol_in_list(symbol_to_check))

import pandas as pd

class NseDataActions:
    @staticmethod
    def get_nse_scrips_list():
        """Returns a list of symbols and a list of tuples for use on a web page."""
        nse_scrips_df = pd.read_csv(r'src/main/resources/EquityHub/NSE_Equity_list.csv')
        # nse_scrips_df = pd.read_csv('EquityHub/NSE_Equity_list.csv')
        col_names = [col.strip().capitalize() for col in nse_scrips_df.columns]  # Clean column names
        nse_scrips_df.columns = col_names
        nse_symbols_list = nse_scrips_df['Symbol'].to_list()
        nse_scrips_list = nse_scrips_df[['Name of company', 'Symbol']].apply(tuple, axis=1).to_list()
        
        return nse_symbols_list, nse_scrips_list

    @staticmethod
    def check_symbol_in_list(symbol):
        """Checks if a given symbol exists in the list of NSE symbols."""
        nse_symbols_list, _ = NseDataActions.get_nse_scrips_list()
        if symbol.upper() in nse_symbols_list:  # Case-insensitive match
            return f"Stock symbol '{symbol}' found in the list."
        else:
            return f"Stock symbol '{symbol}' not found in the list."

if __name__ == "__main__":
    # Test functionality
    symbols, scrips = NseDataActions.get_nse_scrips_list()
    print("Symbols:", symbols)
    print("Scrips:", scrips)

    # Example symbol check
    
    print(NseDataActions.check_symbol_in_list(symbol_to_check))


