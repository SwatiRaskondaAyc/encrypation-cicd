import pandas as pd
import pandas as pd
import datetime
from collections import defaultdict, deque
from utils import PUtils
from data_logger import logger


from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler

class PortfolioResults:
    #
    # @staticmethod
    # def create_portfolio_results_by_month(transaction_tab, Calendar, nse_scrips_df, nse_ScripName_list ):
    #     logger.info("Initiating the process to create the portfolio table ...")
    #     portfolio_fifo_results = {}  # portfolio Results Dict
    #     for end_date in Calendar:
    #         date_string = end_date.strftime('%d-%m-%Y')  # Original date string
    #         successful_retrieval = False  # Flag to track successful data retrieval
    #         temp_date = end_date  # Temporary date to adjust if needed
    #
    #         while not successful_retrieval:
    #             # print(temp_date)
    #             try:
    #                 # Attempt to extract price action data for the current date
    #                 temp_date_string = temp_date.strftime('%d-%m-%Y')
    #                 # file_path = r"data/portf_data/market_bhav/" + temp_date_string + ".csv"
    #                 file_path = r"src/main/resources/data/portf_data/market_bhav/" + temp_date_string + ".csv"
    #                 nse_scrip_values_df = pd.read_csv(file_path, index_col=0)
    #
    #                 # If successful, set the flag to True and break the loop
    #                 successful_retrieval = True
    #             except Exception as e:
    #                 # print(f"Error on {temp_date_string}: {e}")  # log the exception if needed
    #                 # print(temp_date_string, file_path)
    #                 # If there's an error, move to the previous day
    #                 temp_date -= datetime.timedelta(days=1)
    #
    #         transactions = transaction_tab.query(f"`Trade_Date` <= '{end_date}'")
    #         # Define a dictionary to hold FIFO queues for each Scrip_Name
    #         portfolio_fifo_results[date_string] = {}
    #         balance_dict = defaultdict(deque)
    #
    #         holdings_curr_qty = transactions.groupby(by='Scrip_Name')\
    #                                     .agg(CurrentQty=('CustomQty','sum'))              # stocks with their current qty values
    #         holdings_in_transactions = holdings_curr_qty.index.to_list()                      # stocks in the transactions
    #         holdings_on_end_date = holdings_curr_qty.query("`CurrentQty`>0").index.to_list()  # stocks still holding as of this month end date
    #
    #         for Scrip_Name in holdings_in_transactions:
    #             scrip_transactions = transactions[transactions['Scrip_Name'] == Scrip_Name]  # till date stock transactions
    #
    #             if scrip_transactions['Exchange'].unique()=='BSE':
    #                 # print('BSE-STock!!!')
    #                 continue
    #
    #             deployed_amount = 0
    #             realized_pnl = 0
    #             remaining_qty = 0
    #             brok_amt = 0
    #             invested_amount = scrip_transactions.query("Order_Type == 'B'").eval('Qty * Mkt_Price').sum()
    #             turn_over = scrip_transactions.eval('Qty * Mkt_Price').sum()
    #
    #             for _, trade in scrip_transactions.iterrows():
    #                 Order_Type = trade['Order_Type']
    #                 qty = trade['Qty']
    #                 Mkt_Price = trade['Mkt_Price']
    #                 brok_amt+= trade['Brok_Amt']
    #
    #                 if Order_Type == 'B':
    #                     # UpTrade_Date deployed amount & remaining quantity
    #                     deployed_amount += qty * Mkt_Price
    #                     # turn_over += deployed_amount
    #                     remaining_qty += qty
    #                     balance_dict[Scrip_Name].append((qty, Mkt_Price))  # Add to the balance queue
    #
    #                 elif Order_Type == 'S':
    #                     # Calculate the realized PNL using FIFO method
    #                     qty_to_sell = abs(qty)
    #                     sell_Mkt_Price = Mkt_Price
    #                     sell_qty = qty_to_sell
    #
    #                     while sell_qty > 0:   # Profits calculated using FIFO market prices
    #                         balance_qty, balance_Mkt_Price = balance_dict[Scrip_Name][0]
    #
    #                         if sell_qty < balance_qty:
    #                             # Partial sell from the first balance entry
    #                             realized_pnl += sell_qty * (sell_Mkt_Price - balance_Mkt_Price)
    #                             deployed_amount -= sell_qty * balance_Mkt_Price
    #                             balance_dict[Scrip_Name][0] = (balance_qty - sell_qty, balance_Mkt_Price)
    #                             sell_qty = 0
    #
    #                         else:                      # Handles both, when sell_qty is same as balance_qty or greater
    #                             # Full sell of the first balance entry
    #                             realized_pnl += balance_qty * (sell_Mkt_Price - balance_Mkt_Price)
    #                             deployed_amount -= balance_qty * balance_Mkt_Price
    #                             sell_qty -= balance_qty
    #                             balance_dict[Scrip_Name].popleft()
    #                     remaining_qty -= qty_to_sell
    #
    #             # Calculate current value and unrealized PNL
    #             if Scrip_Name not in holdings_on_end_date:
    #
    #                 normalized_ScripName = PUtils.normalize_ScripNames(Scrip_Name)
    #                 # Get the scrip_index to extract scrip_symbol from nse_scrips_df
    #                 try:
    #                     scrip_index = nse_ScripName_list.index(normalized_ScripName)
    #                 except:
    #                     scrip_index = PUtils.search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list)
    #
    #                 scrip_symbol = nse_scrips_df.iloc[scrip_index]['SYMBOL']
    #
    #                 current_value=0
    #                 unrealized_pnl=0
    #                 symbol  = scrip_symbol
    #             else:
    #                 normalized_ScripName = PUtils.normalize_ScripNames(Scrip_Name)
    #                 # Get the scrip_index to extract scrip_symbol from nse_scrips_df
    #                 try:
    #                     scrip_index = nse_ScripName_list.index(normalized_ScripName)
    #                 except:
    #                     scrip_index = PUtils.search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list)
    #
    #                 scrip_symbol = nse_scrips_df.iloc[scrip_index]['SYMBOL']
    #
    #                 # stock_file_path = f"data/NSE_data/{scrip_symbol}.csv"
    #                 # if stock_file_path == True:
    #
    #
    #                 #     df1 = pd.read_csv(stock_file_path)
    #
    #                 #     scrip_current_Price = df1['Close'].iloc[-1]
    #                 #     current_value = remaining_qty * scrip_current_Price
    #                 #     unrealized_pnl = current_value - deployed_amount
    #                 # else:
    #
    #                 if 'SYMBOL' in nse_scrip_values_df.columns:
    #                     symbol_column = 'SYMBOL'
    #                 else:
    #                     symbol_column = 'Symbol'
    #
    #                 if 'SERIES' in nse_scrip_values_df.columns:
    #                     series_column = 'SERIES'
    #                 else:
    #                     series_column = 'Series'
    #
    #                 if 'CLOSE_PRICE' in nse_scrip_values_df.columns:
    #                     close_column = 'CLOSE_PRICE'
    #                 else:
    #                     close_column = 'Close'
    #
    #                 # print(Scrip_Name)
    #                 # print(scrip_symbol)
    #
    #
    #                 # scrip_current_Price = nse_scrip_values_df.query(f"{symbol_column}=='{scrip_symbol}' & {series_column} in ['EQ','BE']")[close_column].iloc[0]
    #                 scrip_current_Price = nse_scrip_values_df.query(f"{symbol_column}=='{scrip_symbol}' & {series_column} in ['EQ','BE']")[close_column].iloc[0]
    #                 current_value = remaining_qty * scrip_current_Price
    #                 unrealized_pnl = current_value - deployed_amount
    #                 symbol = scrip_symbol
    #
    #
    #             # Calculate and add percentage return where 'Deployed Amount' is not zero
    #             if deployed_amount != 0:
    #                 percent_change = round(((current_value - deployed_amount) / deployed_amount) * 100, 2)
    #                 percent_change_str = f"{percent_change} %"
    #             else:
    #                 percent_change = None  # or set to 0 if preferred
    #
    #
    #             # Append results to the portfolio DataFrame
    #             portfolio_fifo_results[date_string][Scrip_Name] = {
    #
    #
    #                     "Symbol":symbol,
    #                     "Remaining Qty": remaining_qty,
    #                     "Deployed Amount": round(deployed_amount,4),
    #                     "Market Value": current_value,
    #                     "Unrealized % Return": percent_change_str,
    #                     "Unrealized PNL": round(unrealized_pnl,4),
    #                     "Realized PNL": realized_pnl,
    #                     "Brokerage Amount": brok_amt,
    #                     "Invested Amount": invested_amount,
    #                     "Turn Over Amount": turn_over,
    #
    #
    #             }
    #     logger.info("successfully created portfolio result table...")
    #     return portfolio_fifo_results
    
    
    
    
    
    # @staticmethod
    # def create_portfolio_results_by_month(transaction_tab, Calendar, nse_scrips_df, nse_ScripName_list ):
    #
    #     conn, cursor = DBHandler.get_connection()
    #     mkt_db = MktDB(conn, cursor)
    #
    #
    #     symbol_changes_df= pd.read_csv(r"src/main/resources/data/portf_data/SymbolChange.csv")
    #
    #
    #     # print("this is trans tab")
    #     # print(transaction_tab)
    #
    #
    #
    #     logger.info("Initiating the process to create the portfolio table ...")
    #     portfolio_fifo_results = {}  # portfolio Results Dict
    #     for end_date in Calendar:
    #         date_string = end_date.strftime('%d-%m-%Y')  # Original date string
    #         successful_retrieval = False  # Flag to track successful data retrieval
    #         temp_date = end_date  # Temporary date to adjust if needed
    #
    #         while not successful_retrieval:
    #             # print(temp_date)
    #             try:
    #                 # Attempt to extract price action data for the current date
    #                 temp_date_string = temp_date.strftime('%d-%m-%Y')
    #                 file_path = r"src/main/resources/data/portf_data/market_bhav/" + temp_date_string + ".csv"
    #                 nse_scrip_values_df = pd.read_csv(file_path, index_col=0)
    #
    #                 # If successful, set the flag to True and break the loop
    #                 successful_retrieval = True
    #             except Exception as e:
    #                 # print(f"Error on {temp_date_string}: {e}")  # log the exception if needed
    #                 # print(temp_date_string, file_path)
    #                 # If there's an error, move to the previous day
    #                 temp_date -= datetime.timedelta(days=1)
    #
    #         transactions = transaction_tab.query(f"`Trade_Date` <= '{end_date}'")
    #         # Define a dictionary to hold FIFO queues for each Scrip_Name
    #         portfolio_fifo_results[date_string] = {}
    #         balance_dict = defaultdict(deque)
    #
    #         holdings_curr_qty = transactions.groupby(by='Scrip_Name')\
    #                                     .agg(CurrentQty=('CustomQty','sum'))              # stocks with their current qty values
    #         holdings_in_transactions = holdings_curr_qty.index.to_list()                      # stocks in the transactions
    #         holdings_on_end_date = holdings_curr_qty.query("`CurrentQty`>0").index.to_list()  # stocks still holding as of this month end date
    #
    #         for Scrip_Name in holdings_in_transactions:
    #             scrip_transactions = transactions[transactions['Scrip_Name'] == Scrip_Name]  # till date stock transactions
    #
    #             if scrip_transactions['Exchange'].unique()=='BSE':
    #                 # print('BSE-STock!!!')
    #                 continue
    #
    #             deployed_amount = 0
    #             realized_pnl = 0
    #             remaining_qty = 0
    #             brok_amt = 0
    #             invested_amount = scrip_transactions.query("Order_Type == 'B'").eval('Qty * Mkt_Price').sum()
    #             turn_over = scrip_transactions.eval('Qty * Mkt_Price').sum()
    #
    #             for _, trade in scrip_transactions.iterrows():
    #                 Order_Type = trade['Order_Type']
    #                 qty = trade['Qty']
    #                 Mkt_Price = trade['Mkt_Price']
    #                 brok_amt+= trade['Brok_Amt']
    #
    #                 if Order_Type == 'B':
    #                     # UpTrade_Date deployed amount & remaining quantity
    #                     deployed_amount += qty * Mkt_Price
    #                     # turn_over += deployed_amount
    #                     remaining_qty += qty
    #                     balance_dict[Scrip_Name].append((qty, Mkt_Price))  # Add to the balance queue
    #
    #                 elif Order_Type == 'S':
    #                     # Calculate the realized PNL using FIFO method
    #                     qty_to_sell = abs(qty)
    #                     sell_Mkt_Price = Mkt_Price
    #                     sell_qty = qty_to_sell
    #
    #                     while sell_qty > 0:   # Profits calculated using FIFO market prices
    #                         balance_qty, balance_Mkt_Price = balance_dict[Scrip_Name][0]
    #
    #                         if sell_qty < balance_qty:
    #                             # Partial sell from the first balance entry
    #                             realized_pnl += sell_qty * (sell_Mkt_Price - balance_Mkt_Price)
    #                             deployed_amount -= sell_qty * balance_Mkt_Price
    #                             balance_dict[Scrip_Name][0] = (balance_qty - sell_qty, balance_Mkt_Price)
    #                             sell_qty = 0
    #
    #                         else:                      # Handles both, when sell_qty is same as balance_qty or greater
    #                             # Full sell of the first balance entry
    #                             realized_pnl += balance_qty * (sell_Mkt_Price - balance_Mkt_Price)
    #                             deployed_amount -= balance_qty * balance_Mkt_Price
    #                             sell_qty -= balance_qty
    #                             balance_dict[Scrip_Name].popleft()
    #                     remaining_qty -= qty_to_sell
    #
    #             # Calculate current value and unrealized PNL
    #             if Scrip_Name not in holdings_on_end_date:
    #
    #                 normalized_ScripName = PUtils.normalize_ScripNames(Scrip_Name)
    #                 # Get the scrip_index to extract scrip_symbol from nse_scrips_df
    #                 try:
    #                     scrip_index = nse_ScripName_list.index(normalized_ScripName)
    #                 except:
    #                     scrip_index = PUtils.search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list)
    #
    #                 scrip_symbol = nse_scrips_df.iloc[scrip_index]['SYMBOL']
    #
    #                 current_value=0
    #                 unrealized_pnl=0
    #                 symbol  = scrip_symbol
    #             else:
    #                 normalized_ScripName = PUtils.normalize_ScripNames(Scrip_Name)
    #                 # Get the scrip_index to extract scrip_symbol from nse_scrips_df
    #                 try:
    #                     scrip_index = nse_ScripName_list.index(normalized_ScripName)
    #                 except:
    #                     scrip_index = PUtils.search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list)
    #
    #                 scrip_symbol = nse_scrips_df.iloc[scrip_index]['SYMBOL']
    #                 # print(Scrip_Name)
    #                 # print(scrip_symbol)
    #
    #
    #
    #                 scrip_symbol = PortfolioResults.update_symbol_if_changed(scrip_symbol, temp_date, symbol_changes_df)
    #                 # print("NEW SYMBOL",scrip_symbol)
    #
    #                 if 'SYMBOL' in nse_scrip_values_df.columns:
    #                     symbol_column = 'SYMBOL'
    #                 else:
    #                     symbol_column = 'Symbol'
    #
    #                 if 'SERIES' in nse_scrip_values_df.columns:
    #                     series_column = 'SERIES'
    #                 else:
    #                     series_column = 'Series'
    #
    #                 if 'CLOSE_PRICE' in nse_scrip_values_df.columns:
    #                     close_column = 'CLOSE_PRICE'
    #                 else:
    #                     close_column = 'Close'
    #
    #
    #                 # scrip_current_Price = nse_scrip_values_df.query(f"{symbol_column}=='{scrip_symbol}' & {series_column} in ['EQ','BE']")[close_column].iloc[0]
    #                 scrip_current_Price = nse_scrip_values_df.query(f"{symbol_column}=='{scrip_symbol}' & {series_column} in ['EQ','BE']")[close_column].iloc[0]
    #                 current_value = remaining_qty * scrip_current_Price
    #                 unrealized_pnl = current_value - deployed_amount
    #                 symbol = scrip_symbol
    #
    #
    #
    #
    #             # Calculate and add percentage return where 'Deployed Amount' is not zero
    #             if deployed_amount != 0:
    #                 percent_change = round(((current_value - deployed_amount) / deployed_amount) * 100, 2)
    #                 percent_change_str = f"{percent_change} %"
    #             else:
    #                 percent_change = None  # or set to 0 if preferred
    #
    #
    #             # Append results to the portfolio DataFrame
    #             portfolio_fifo_results[date_string][Scrip_Name] = {
    #
    #
    #                     "Symbol":symbol,
    #                     "Remaining Qty": remaining_qty,
    #                     "Deployed Amount": round(deployed_amount,4),
    #                     "Market Value": current_value,
    #                     "Unrealized % Return": percent_change_str,
    #                     "Unrealized PNL": round(unrealized_pnl,4),
    #                     "Realized PNL": realized_pnl,
    #                     "Brokerage Amount": brok_amt,
    #                     "Invested Amount": invested_amount,
    #                     "Turn Over Amount": turn_over,
    #
    #
    #             }
    #     logger.info("successfully created portfolio result table...")
    #     return portfolio_fifo_results
    
    
    
    #
    # @staticmethod
    # def create_portfolio_results_by_month(transaction_tab, Calendar, nse_scrips_df, nse_ScripName_list):
    #
    #     conn, cursor = DBHandler.get_connection()
    #     mkt_db = MktDB(conn, cursor)
    #
    #     symbol_changes_df = pd.read_csv(r"src/main/resources/data/portf_data/SymbolChange.csv")
    #
    #     logger.info("Initiating the process to create the portfolio table ...")
    #     portfolio_fifo_results = {}  # portfolio Results Dict
    #
    #     for end_date in Calendar:
    #         date_string = end_date.strftime('%d-%m-%Y')  # Original date string
    #
    #         # First, get transactions up to the end_date and identify the scrips that are part of the user's transaction tab.
    #         transactions = transaction_tab.query(f"`Trade_Date` <= '{end_date}'")
    #         holdings_curr_qty = transactions.groupby(by='Scrip_Name')\
    #                                         .agg(CurrentQty=('CustomQty', 'sum'))
    #         holdings_in_transactions = holdings_curr_qty.index.to_list()
    #         # Only consider those with positive quantity as of end_date (i.e. still held)
    #         holdings_on_end_date = holdings_curr_qty.query("`CurrentQty` > 0").index.to_list()
    #
    #         # Build a list of symbols to fetch for DB call.
    #         symbols_to_fetch = []
    #         symbol_map = {}  # maps Scrip_Name to scrip_symbol for quick lookup
    #         for scrip in holdings_on_end_date:
    #             normalized_ScripName = PUtils.normalize_ScripNames(scrip)
    #             try:
    #                 scrip_index = nse_ScripName_list.index(normalized_ScripName)
    #             except Exception:
    #                 scrip_index = PUtils.search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list)
    #             scrip_symbol = nse_scrips_df.iloc[scrip_index]['SYMBOL']
    #             # Update the symbol if it has changed using your lookup
    #             scrip_symbol = PortfolioResults.update_symbol_if_changed(scrip_symbol, end_date, symbol_changes_df)
    #             symbols_to_fetch.append(scrip_symbol)
    #             symbol_map[scrip] = scrip_symbol
    #
    #         # Now fetch market data only for those symbols using the DB
    #         successful_retrieval = False  # Flag to track successful data retrieval
    #         temp_date = end_date  # Temporary date to adjust if needed
    #         nse_scrip_values_df = None
    #
    #         while not successful_retrieval:
    #             try:
    #                 # Use DB call with symbols_to_fetch and the current temp_date as both start and end date.
    #                 nse_scrip_values_df = mkt_db.fetch_historical_data(
    #                     symbols=symbols_to_fetch,
    #                     start_date=temp_date,
    #                     end_date=temp_date
    #                 )
    #
    #                 # If the returned DataFrame is empty, simulate a failure so we adjust the date
    #                 if nse_scrip_values_df.empty:
    #                     raise Exception("No data returned for date: " + temp_date.strftime('%d-%m-%Y'))
    #                 successful_retrieval = True
    #             except Exception as e:
    #                 logger.debug(f"Data retrieval failed for {temp_date.strftime('%d-%m-%Y')}: {e}")
    #                 temp_date -= datetime.timedelta(days=1)
    #
    #         # Initialize the results dict for this date
    #         portfolio_fifo_results[date_string] = {}
    #         balance_dict = defaultdict(deque)
    #
    #         # Process each scrip from the transactions (this loop goes over every scrip that had a transaction)
    #         for Scrip_Name in holdings_in_transactions:
    #             scrip_transactions = transactions[transactions['Scrip_Name'] == Scrip_Name]
    #
    #             # Skip BSE transactions
    #             if scrip_transactions['Exchange'].unique() == 'BSE':
    #                 continue
    #
    #             deployed_amount = 0
    #             realized_pnl = 0
    #             remaining_qty = 0
    #             brok_amt = 0
    #             invested_amount = scrip_transactions.query("Order_Type == 'B'").eval('Qty * Mkt_Price').sum()
    #             turn_over = scrip_transactions.eval('Qty * Mkt_Price').sum()
    #
    #             # Process each trade for the scrip to update FIFO queues etc.
    #             for _, trade in scrip_transactions.iterrows():
    #                 Order_Type = trade['Order_Type']
    #                 qty = trade['Qty']
    #                 Mkt_Price = trade['Mkt_Price']
    #                 brok_amt += trade['Brok_Amt']
    #
    #                 if Order_Type == 'B':
    #                     deployed_amount += qty * Mkt_Price
    #                     remaining_qty += qty
    #                     balance_dict[Scrip_Name].append((qty, Mkt_Price))
    #                 elif Order_Type == 'S':
    #                     qty_to_sell = abs(qty)
    #                     sell_Mkt_Price = Mkt_Price
    #                     sell_qty = qty_to_sell
    #
    #                     while sell_qty > 0:
    #                         balance_qty, balance_Mkt_Price = balance_dict[Scrip_Name][0]
    #                         if sell_qty < balance_qty:
    #                             realized_pnl += sell_qty * (sell_Mkt_Price - balance_Mkt_Price)
    #                             deployed_amount -= sell_qty * balance_Mkt_Price
    #                             balance_dict[Scrip_Name][0] = (balance_qty - sell_qty, balance_Mkt_Price)
    #                             sell_qty = 0
    #                         else:
    #                             realized_pnl += balance_qty * (sell_Mkt_Price - balance_Mkt_Price)
    #                             deployed_amount -= balance_qty * balance_Mkt_Price
    #                             sell_qty -= balance_qty
    #                             balance_dict[Scrip_Name].popleft()
    #                     remaining_qty -= qty_to_sell
    #
    #             # Determine the symbol and price data based on whether the scrip is still held.
    #             if Scrip_Name not in holdings_on_end_date:
    #                 # If the scrip is not currently held, use the mapped symbol but no price is fetched.
    #                 normalized_ScripName = PUtils.normalize_ScripNames(Scrip_Name)
    #                 try:
    #                     scrip_index = nse_ScripName_list.index(normalized_ScripName)
    #                 except Exception:
    #                     scrip_index = PUtils.search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list)
    #
    #
    #                 scrip_symbol = nse_scrips_df.iloc[scrip_index]['SYMBOL']
    #                 symbol = scrip_symbol  # No update needed since not held
    #                 current_value = 0
    #                 unrealized_pnl = 0
    #             else:
    #                 # For scrips still held, get the symbol from our earlier mapping
    #                 scrip_symbol = symbol_map.get(Scrip_Name)
    #                 # Determine the column names from the returned DB data.
    #                 if 'SYMBOL' in nse_scrip_values_df.columns:
    #                     symbol_column = 'SYMBOL'
    #                 else:
    #                     symbol_column = 'Symbol'
    #
    #                 if 'SERIES' in nse_scrip_values_df.columns:
    #                     series_column = 'SERIES'
    #                 else:
    #                     series_column = 'Series'
    #
    #                 if 'CLOSE_PRICE' in nse_scrip_values_df.columns:
    #                     close_column = 'CLOSE_PRICE'
    #                 else:
    #                     close_column = 'Close'
    #
    #                 # Query the DB result DataFrame to get the closing price for this symbol.
    #                 # (Assumes the symbol appears in the DB data—if not, you might need additional error handling.)
    #                 scrip_current_Price = nse_scrip_values_df.query(f"{symbol_column}=='{scrip_symbol}' & {series_column} in ['EQ','BE']")[close_column].iloc[0]
    #                 current_value = remaining_qty * scrip_current_Price
    #                 unrealized_pnl = current_value - deployed_amount
    #                 symbol = scrip_symbol
    #
    #             # Calculate percentage change if there is a deployed amount.
    #             if deployed_amount != 0:
    #                 percent_change = round(((current_value - deployed_amount) / deployed_amount) * 100, 2)
    #                 percent_change_str = f"{percent_change} %"
    #             else:
    #                 percent_change_str = "0 %"
    #
    #             # Append results to the portfolio dictionary.
    #             portfolio_fifo_results[date_string][Scrip_Name] = {
    #                 "Symbol": symbol,
    #                 "Remaining Qty": remaining_qty,
    #                 "Deployed Amount": round(deployed_amount, 4),
    #                 "Market Value": current_value,
    #                 "Unrealized % Return": percent_change_str,
    #                 "Unrealized PNL": round(unrealized_pnl, 4),
    #                 "Realized PNL": realized_pnl,
    #                 "Brokerage Amount": brok_amt,
    #                 "Invested Amount": invested_amount,
    #                 "Turn Over Amount": turn_over,
    #             }
    #
    #     logger.info("Successfully created portfolio result table...")
    #     return portfolio_fifo_results
    #
    #
    #
    #
    #
    # @staticmethod
    # def update_symbol_if_changed(scrip_symbol, end_date, symbol_changes_df):
    #     """
    #     Checks if a symbol has changed and updates it based on end_date.
    #     If the symbol is found in 'PrevSymbol' and the change date is before end_date,
    #     update it to the corresponding 'NewSymbol'.
    #     Otherwise, keep the original symbol.
    #     """
    #     match = symbol_changes_df[symbol_changes_df['PrevSymbol'] == scrip_symbol]
    #
    #     if not match.empty:
    #         change_date = pd.to_datetime(match['Date'].values[0])
    #
    #         # Update symbol only if end_date is strictly greater than change_date
    #         if end_date > change_date:
    #             return match['NewSymbol'].values[0]  
    #
    #     return scrip_symbol  # Return original symbol if no change
    #








    @staticmethod
    def create_portfolio_results_by_month(df, Calendar, nse_scrips_df, nse_ScripName_list):
        
        transaction_tab = df.copy()
        # Load symbol changes
        # symbol_changes_df =  pd.read_csv(r"src/main/resources/data/portf_data/SymbolChange.csv")
        # symbol_changes_df =  pd.read_csv(r"D:/VSCode/cmda_port/data/portf_data/SymbolChange.csv")
        symbol_changes_df = pd.read_csv(r"src/main/resources/data/portf_data/SymbolChange.csv")
        # Establish database connection
        conn, cursor = DBHandler.get_connection()
        mkt_db = MktDB(conn, cursor)



        portfolio_fifo_results = {}  # portfolio Results Dict

        for end_date in Calendar:
            date_string = end_date.strftime('%d-%m-%Y')  # Original date string
    
            # First, get transactions up to the end_date and identify the scrips that are part of the user's transaction tab.
            transactions = transaction_tab.query(f"`Trade_Date` <= '{end_date}'")

            transactions['CustomQty'] = transactions.apply(
                lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
            

            holdings_curr_qty = transactions.groupby(by='Scrip_Name')\
                                            .agg(CurrentQty=('CustomQty', 'sum'))
            holdings_in_transactions = holdings_curr_qty.index.to_list()
            # Only consider those with positive quantity as of end_date (i.e. still held)
            holdings_on_end_date = holdings_curr_qty.query("`CurrentQty` > 0").index.to_list()
    
            # Build a list of symbols to fetch for DB call.
            symbols_to_fetch = []
            symbol_map = {}  # maps Scrip_Name to scrip_symbol for quick lookup
            for scrip in holdings_on_end_date:
                normalized_ScripName = PUtils.normalize_ScripNames(scrip)
                try:
                    scrip_index = nse_ScripName_list.index(normalized_ScripName)
                except Exception:
                    scrip_index = PUtils.search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list)
                scrip_symbol = nse_scrips_df.iloc[scrip_index]['SYMBOL']
                # Update the symbol if it has changed using your lookup
                scrip_symbol = PortfolioResults.update_symbol_if_changed(scrip_symbol, end_date, symbol_changes_df)
                symbols_to_fetch.append(scrip_symbol)
                symbol_map[scrip] = scrip_symbol




            # Now fetch market data only for those symbols using the DB
            successful_retrieval = False  # Flag to track successful data retrieval
            temp_date = end_date  # Temporary date to adjust if needed
            nse_scrip_values_df = None
    
            while not successful_retrieval:
                try:
                    # Use DB call with symbols_to_fetch and the current temp_date as both start and end date.
                    nse_scrip_values_df = mkt_db.fetch_historical_data(
                        symbols=symbols_to_fetch,
                        start_date=temp_date,
                        end_date=temp_date
                    )
                    
                    # If the returned DataFrame is empty, simulate a failure so we adjust the date
                    if nse_scrip_values_df.empty:
                        raise Exception("No data returned for date: " + temp_date.strftime('%d-%m-%Y'))
                    successful_retrieval = True
                except Exception as e:
                    # print(f"Data retrieval failed for {temp_date.strftime('%d-%m-%Y')}: {e}")
                    temp_date -= datetime.timedelta(days=1)


            # Initialize the results dict for this date
            portfolio_fifo_results[date_string] = {}
            balance_dict = defaultdict(deque)
    
            # Determine which scrips are still held
            holdings_curr_qty = (
                transactions.groupby('Scrip_Name')
                .agg(CurrentQty=('CustomQty','sum'))
            )
            holdings_in_transactions = holdings_curr_qty.index.tolist()
            holdings_on_end_date = (
                holdings_curr_qty.query("`CurrentQty`>0").index.tolist()
            )

            for Scrip_Name in holdings_in_transactions:
                scrip_transactions = (
                    transactions[transactions['Scrip_Name'] == Scrip_Name]
                )
                # Skip BSE stocks
                if 'BSE' in scrip_transactions['Exchange'].unique():
                    continue

                # Initialize per-scrip metrics
                deployed_amount = 0.0
                realized_pnl     = 0.0
                remaining_qty    = 0
                brok_amt         = 0.0
                invested_amount  = scrip_transactions.query(
                    "Order_Type == 'B'"
                ).eval('Qty * Mkt_Price').sum()
                turn_over = scrip_transactions.eval('Qty * Mkt_Price').sum()

                # Track short (unmatched) sells
                short_positions = 0

                # Process each trade via FIFO + short handling
                for _, trade in scrip_transactions.iterrows():
                    typ   = trade['Order_Type']
                    qty   = trade['Qty']
                    price = trade['Mkt_Price']
                    brok_amt += trade['Brok_Amt']

                    if typ == 'B':
                        deployed_amount += qty * price
                        remaining_qty  += qty
                        balance_dict[Scrip_Name].append((qty, price))
                    else:
                        qty_to_sell = abs(qty)
                        unmatched   = qty_to_sell
                        # Match sells against FIFO buys
                        dq = balance_dict[Scrip_Name]
                        while unmatched > 0 and dq:
                            buy_qty, buy_price = dq[0]
                            if unmatched < buy_qty:
                                # partial match
                                realized_pnl   += unmatched * (price - buy_price)
                                deployed_amount -= unmatched * buy_price
                                dq[0] = (buy_qty - unmatched, buy_price)
                                remaining_qty  -= unmatched
                                unmatched       = 0
                            else:
                                # full match of this lot
                                realized_pnl   += buy_qty * (price - buy_price)
                                deployed_amount -= buy_qty * buy_price
                                remaining_qty  -= buy_qty
                                unmatched      -= buy_qty
                                dq.popleft()

                        if unmatched > 0:
                            # record short quantity
                            short_positions += unmatched
                            # matched portion already subtracted

                # Lookup symbol once
                normalized = PUtils.normalize_ScripNames(Scrip_Name)
                try:
                    idx = nse_ScripName_list.index(normalized)
                except ValueError:
                    idx = PUtils.search_scrip_index_by_similarity(normalized, nse_ScripName_list)
                symbol = nse_scrips_df.iloc[idx]['SYMBOL']
                symbol = PortfolioResults.update_symbol_if_changed(symbol, temp_date, symbol_changes_df)

                # Identify column names in market data
                symbol_col = 'SYMBOL' if 'SYMBOL' in nse_scrip_values_df.columns else 'Symbol'
                series_col = 'SERIES' if 'SERIES' in nse_scrip_values_df.columns else 'Series'
                close_col  = 'CLOSE_PRICE' if 'CLOSE_PRICE' in nse_scrip_values_df.columns else 'Close'

                # Fetch the current close price
                try:
                    row = nse_scrip_values_df.query(
                        f"{symbol_col}=='{symbol}' & {series_col} in ['EQ','BE']"
                    )
                    close_price = row[close_col].iloc[0]
                except IndexError:
                    close_price = 0.0

                # Calculate current value and unrealized PNL for whatever remains
                current_value  = remaining_qty * close_price
                unrealized_pnl = current_value - deployed_amount

                # Compute percentage return safely
                pct_str = None
                if deployed_amount:
                    pct = (current_value - deployed_amount) / deployed_amount * 100
                    pct_str = f"{round(pct,2)} %"

                # Save results
                portfolio_fifo_results[date_string][Scrip_Name] = {
                    "Symbol": symbol,
                    "Remaining Qty": remaining_qty,
                    # "Short Qty": short_positions,
                    "Deployed Amount": round(deployed_amount,4),
                    "Market Value": current_value,
                    "Unrealized % Return": pct_str,
                    "Unrealized PNL": round(unrealized_pnl,4),
                    "Realized PNL": realized_pnl,
                    "Brokerage Amount": brok_amt,
                    "Invested Amount": invested_amount,
                    "Turn Over Amount": turn_over,
                }

        return portfolio_fifo_results

    @staticmethod
    def update_symbol_if_changed(scrip_symbol, end_date, symbol_changes_df):
        """
        Checks if a symbol has changed and updates it based on end_date.
        If the symbol is found in 'PrevSymbol' and the change date is before end_date,
        update it to the corresponding 'NewSymbol'.
        Otherwise, keep the original symbol.
        """
        match = symbol_changes_df[symbol_changes_df['PrevSymbol'] == scrip_symbol]
        
        if not match.empty:
            change_date = pd.to_datetime(match['Date'].values[0])
            
            # Update symbol only if end_date is strictly greater than change_date
            if end_date > change_date:
                return match['NewSymbol'].values[0]  
        
        return scrip_symbol  # Return original symbol if no change