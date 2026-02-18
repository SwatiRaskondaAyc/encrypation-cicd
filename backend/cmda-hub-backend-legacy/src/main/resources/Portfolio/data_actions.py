import os,shutil
import pandas as pd
import glob
from datetime import datetime
from utils import PUtils
from data_logger import logger


from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler

class PDataActions:

    @staticmethod
    def column_transformations_calculations(transaction_tab):
        ''' Transforms Trade Dates to Date type and Calculates columns CustomQty, CumulativeQty
        '''
        logger.info("Transforming data creating columns CustomQty and CumulativeQty ...")
        transaction_tab.reset_index(inplace=True)
        transaction_tab['Trade_Date'] = transaction_tab['Trade_Date'].apply(PUtils.parse_date)
        #  pd.to_datetime(transaction_tab['Trade_Date'])

        # Adding Calculated Columns
        transaction_tab['CustomQty'] = transaction_tab.apply(lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
        transaction_tab['CumulativeQty'] = transaction_tab.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()
        return transaction_tab

    @staticmethod
    def filter_transaction_tab(transaction_tab):
        logger.info("dropping the incompolete scrips ...")
        ''' Droping the Series which do have a Discripancy in the Transactions '''
        incomplete_scrips = set(transaction_tab.query("`CumulativeQty`<0")['Scrip_Name'])
        transaction_tab = transaction_tab[~transaction_tab['Scrip_Name'].isin(incomplete_scrips)]

        return transaction_tab, incomplete_scrips      
    
    #
    # @staticmethod
    # def get_Calendar_with_month_dates(transaction_tab):
    #
    #
    #
    #     logger.info("Creating the calender for portofolio table ...")
    #    # Specify the path to your folder
    #     # folder_path = r'data/portf_data/market_bhav/'
    #     folder_path = r'src/main/resources/data/portf_data/market_bhav/'
    #
    #     # Use glob to find all CSV files in the folder
    #     csv_files = glob.glob(os.path.join(folder_path, '*.csv'))
    #
    #     # Create a list to hold the dates as datetime objects
    #     dates = []
    #
    #     # Iterate over the CSV files and extract the dates
    #     for file in csv_files:
    #         # Extract the file name without the path
    #         file_name = os.path.basename(file)
    #         # Remove the '.csv' extension
    #         date_str = file_name.replace('.csv', '')
    #         # Convert the string to a datetime object and append to the list
    #         dates.append(datetime.strptime(date_str, '%d-%m-%Y'))
    #
    #     # Find the max date from the datetime objects
    #
    #     if not dates:
    #         logger.error("No market data CSV files found in the directory.")
    #         return pd.Series()  # Return an empty series instead of breaking
    #
    #     max_date = max(dates)
    #
    #     # Output the latest date in the original format 'dd-mm-yyyy'
    #     # print("Latest date:", max_date.strftime('%d-%m-%Y'))
    #
    #     ''' Creating a Calendar with Month end Dates between the first transaction and last transction'''
    #     transaction_tab['Trade_Date'] = pd.to_datetime(transaction_tab['Trade_Date'])
    #     start_date = transaction_tab['Trade_Date'].min()
    #     end_date = max_date
    #     Calendar = pd.Series(pd.date_range(start_date, end_date, freq='ME'))
    #     Calendar.loc[len(Calendar)] = max_date
    #     # print('start date',start_date)
    #
    #
    #
    #
    #     # # Get unique dates from the 'Trade_Date' column
    #     # unique_dates = transaction_tab['Trade_Date'].unique()
    #     # Calendar = pd.Series(pd.to_datetime(unique_dates)).sort_values().reset_index(drop=True)
    #
    #     # # Adding the max_date to the Calendar if not already present
    #     # if pd.to_datetime(end_date) not in Calendar.values:
    #     #     Calendar.loc[len(Calendar)] = pd.to_datetime(end_date)
    #
    #     # print('Start date:', start_date)
    #     # print('Calendar:')
    #     # print(Calendar)
    #
    #
    #
    #     return Calendar





    @staticmethod
    def get_Calendar_with_month_dates(transaction_tab):
        logger.info("Creating the calendar for the portfolio table ...")
    
        # Establish database connection
        conn, cursor = DBHandler.get_connection()
        mkt_db = MktDB(conn, cursor)
    
        # Fetch the latest available date from the database
        max_date = mkt_db._get_lastest_date()
    
        # Handle case where no date is found in the database
        if max_date is None:
            logger.error("No market data found in the database.")
            return pd.Series()  # Return an empty series instead of breaking
    
        ''' Creating a Calendar with Month-end Dates between the first transaction and last transaction '''
        transaction_tab['Trade_Date'] = pd.to_datetime(transaction_tab['Trade_Date'])
        start_date = transaction_tab['Trade_Date'].min()
        end_date = max_date
        Calendar = pd.Series(pd.date_range(start_date, end_date, freq='ME'))
        Calendar.loc[len(Calendar)] = max_date
            
        return Calendar
