
import pandas as pd
import numpy as np
import os
from datetime import datetime
from dateutil import parser
from incomplete_scrips import IncompleteScrips


class UserFileHandler:


    @staticmethod
    def load_file(file_path):
        """Loads the user-uploaded file into a DataFrame."""
        try:
            if file_path.endswith('.csv'):
                transaction_tab = pd.read_csv(file_path)
            else:
                transaction_tab = pd.read_excel(file_path)

            return transaction_tab
        except Exception as e:
            raise ValueError(f"Error loading file: {str(e)}")




    @staticmethod
    def get_preview(transaction_tab):
        """Returns a preview of the data."""
        if transaction_tab is not None:
            column_names = transaction_tab.columns.tolist()
            snippet = transaction_tab.head(3).to_dict(orient='records')
            message = 'Here is Your Uploaded File'
            return column_names, snippet, message
        else:
            return None, None, "No file loaded."

    # @staticmethod
    # def transform_transaction_tab(transaction_tab):
    #     """Transforms the DataFrame according to the provided feature mappings."""
    #     # column_mappings = dict(list(feature_mappings.items())[:-1])
    #     # aggregated_taxes_columns = feature_mappings['Aggregated_Taxes']
    #
    #     non_nse_scrips = []  # Ensure these are always defined
    #     nse_scrips = []
    #     short_qty_table = pd.DataFrame()  # Assuming short_qty_table should be a DataFrame
    #
    #     try:
    #         # Rename columns based on user mappings
    #         # transaction_tab.rename(columns=column_mappings, inplace=True)
    #
    #         # transaction_tab['Trade_Date'] = pd.to_datetime(transaction_tab['Trade_Date'])
    #
    #         # Convert data types
    #         transaction_tab['Trade_Date'] = UserFileHandler.parse_dates(transaction_tab['Trade_Date'])
    #         # transaction_tab['Exchange'] = transaction_tab['Exchange'].astype(str)
    #         # transaction_tab['Scrip_Name'] = transaction_tab['Scrip_Name'].astype(str)
    #         # transaction_tab['Order_Type'] = transaction_tab['Order_Type'].astype(str)
    #         # transaction_tab['Qty'] = transaction_tab['Qty'].astype(int)
    #         # transaction_tab['Mkt_Price'] = transaction_tab['Mkt_Price'].astype(float)
    #         # transaction_tab['Brok_Amt'] = transaction_tab['Brok_Amt'].astype(float)
    #         # transaction_tab['Aggregated_Taxes'] = transaction_tab['Aggregated_Taxes'].astype(float)
    #         # Adding calculated column
    #
    #         transaction_tab['CustomQty'] = transaction_tab.apply(
    #             lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
    #
    #         transaction_tab['CumulativeQty'] = transaction_tab.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()
    #
    #
    #         # Select only the required features
    #         # required_features = list(column_mappings.values()) + ['Aggregated_Taxes','CustomQty','CumulativeQty']
    #         # transaction_tab = transaction_tab[required_features]
    #
    #         # df_for_short_position = self.transaction_tab
    #
    #         # Checking for discrepancies in transactions
    #         incomplete_scrips = set(transaction_tab.query("`CumulativeQty` < 0")['Scrip_Name'])
    #         # print(incomplete_scrips)
    #         # print(type(incomplete_scrips))
    #
    #         # Only process incomplete transactions if there are any incomplete scrips
    #         if incomplete_scrips:
    #             # print('there are incomplete scrips, processing them')
    #             trans_tab,non_nse_scrips,nse_scrips,short_qty_table = IncompleteScrips.process_incomplete_transactions(transaction_tab)
    #         else:
    #             # print('there are NOT incomplete scrips')
    #             trans_tab = transaction_tab  # No changes, just return the original transaction_tab
    #             non_nse_scrips = []  # Make sure these are initialized
    #             nse_scrips = []      # Initialize these lists
    #             short_qty_table = []  # Initialize this variable
    #
    #         trans_tab['Trade_Date'] = UserFileHandler.parse_dates(trans_tab['Trade_Date'])
    #
    #         #remove incomplete scrips
    #         # transaction_tab = transaction_tab[~transaction_tab['Scrip_Name'].isin(incomplete_scrips)]
    #         # self.transaction_tab = self.transaction_tab[self.transaction_tab]
    #
    #
    #         return trans_tab,non_nse_scrips,nse_scrips,short_qty_table
    #
    #
    #     except Exception as e:
    #         return None, None,None, f"An error occurred during transformation: {str(e)}"


    @staticmethod
    def transform_transaction_tab(transaction_tab):
        """Transforms the DataFrame according to the provided feature mappings."""
        non_nse_scrips = []  # Ensure these are always defined
        nse_scrips = []
        short_qty_table = pd.DataFrame()  # Assuming short_qty_table should be a DataFrame
        trans_tab = pd.DataFrame()  # Assuming short_qty_table should be a DataFrame


        try:
            # Rename columns based on user mappings


            # Convert data types
            transaction_tab['Trade_Date'] = UserFileHandler.parse_dates(transaction_tab['Trade_Date'])
            transaction_tab['CustomQty'] = transaction_tab.apply(
                lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
            transaction_tab['CumulativeQty'] = transaction_tab.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()

            # Checking for discrepancies in transactions
            incomplete_scrips = set(transaction_tab.query("`CumulativeQty` < 0")['Scrip_Name'])


            # Only process incomplete transactions if there are any incomplete scrips
            if incomplete_scrips:
                trans_tab,non_nse_scrips,nse_scrips,short_qty_table = IncompleteScrips.process_incomplete_transactions(transaction_tab)
            else:
                trans_tab = transaction_tab  # No changes, just return the original transaction_tab
                # non_nse_scrips = []  # Make sure these are initialized
                # nse_scrips = []     # Initialize these lists
                # short_qty_table = None  # Initialize this variable

            trans_tab['Trade_Date'] = UserFileHandler.parse_dates(trans_tab['Trade_Date'])

            #remove incomplete scrips
            # transaction_tab = transaction_tab[~transaction_tab['Scrip_Name'].isin(incomplete_scrips)]
            # self.transaction_tab = self.transaction_tab[self.transaction_tab]

            return trans_tab,non_nse_scrips,nse_scrips,short_qty_table


        except Exception as e:
            return trans_tab,non_nse_scrips,nse_scrips,short_qty_table
        
    @staticmethod
    def parse_date(date_str):
        try:
            return parser.parse(date_str)
        except Exception as e:
            raise ValueError(f"Error parsing dates: {str(e)}")


    @staticmethod
    def parse_dates(date_column):
        """Parses date column to detect date format automatically."""
        # Replace '/' with '-' for consistency
        date_column = date_column.astype(str).str.replace("/", "-")

        try:
            # First try parsing with dayfirst=True
            return pd.to_datetime(date_column, dayfirst=True, infer_datetime_format=True)
        except ValueError:
            # If parsing fails, try without dayfirst
            return pd.to_datetime(date_column, infer_datetime_format=True)

        

    @staticmethod
    def find_incomplete_scrips(transaction_tab):
        transaction_tab['CustomQty'] = transaction_tab.apply(
            lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
        
        transaction_tab['CumulativeQty'] = transaction_tab.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()

        incomplete_scrips = set(transaction_tab.query("`CumulativeQty` < 0")['Scrip_Name'])

        return incomplete_scrips




