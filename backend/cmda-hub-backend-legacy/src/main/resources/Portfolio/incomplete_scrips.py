import os
import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime



from cmda_data_manager.data_fetcher.mkt_db import MktDB
from cmda_data_manager.utils.db_handler import DBHandler

class IncompleteScrips:



    # @staticmethod
    # def normalize_ScripNames(text, keep_nums=True):
    #     if keep_nums:
    #         text = re.sub(r'[^a-zA-Z0-9\s]', '', text)  # Remove special characters and keep numbers
    #     else:
    #         text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove special characters and numbers
    #     text = text.lower()  # Lower the text
    #
    #     char_to_replace = {'ltd': '', 'limited': '', 'eng': '', 'engineering': ''}
    #     for key, value in char_to_replace.items():
    #         text = text.replace(key, value)
    #
    #     normalized_text = ' '.join(text.split())  # Remove whitespace
    #     return normalized_text
    #
    # @staticmethod
    # def search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer):
    #     vector = vectorizer.transform([normalized_ScripName]).toarray()
    #     cos_sim_scores = cosine_similarity(vector, nse_vectors)[0]
    #     return np.argmax(cos_sim_scores), np.max(cos_sim_scores)
    #
    #
    # @staticmethod
    # def process_incomplete_transactions(data):
    #
    #
    #     df = data.copy()
    #
    #     df.drop(columns=['CustomQty','CumulativeQty'],inplace=True)
    #
    #     last_financial_prices = pd.read_csv(r'src/main/resources/data/portf_data/market_bhav/29-03-2024.csv')
    #     # last_financial_prices = pd.read_csv(r'data/portf_data/market_bhav/29-03-2024.csv')
    #
    #     # print('we are here')
    #     # Step 1: Identify Short Positions
    #     df['CustomQty'] = df.apply(lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
    #     df['CumulativeQty'] = df.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()
    #     short_positions = df[df['CumulativeQty'] < 0]
    #     short_qty = short_positions.groupby(['Scrip_Name', 'Exchange'])['CumulativeQty'].min().reset_index()
    #     short_qty['ShortQty'] = -short_qty['CumulativeQty']
    #
    #     # Filter out 'BSE' exchange scrips and print message
    #     non_nse_scrips = short_qty[short_qty['Exchange'] == 'BSE']
    #     if not non_nse_scrips.empty:
    #         # print("The following scrips are not from NSE and have been removed:")
    #         # print(non_nse_scrips[['Scrip_Name', 'Exchange']])
    #         non_nse_scrips = non_nse_scrips['Scrip_Name'].unique()
    #
    #     short_qty = short_qty[short_qty['Exchange'] != 'BSE']
    #     nse_scrips = short_qty['Scrip_Name'].unique()
    #
    #     # print('NON NSE SCRIPS')
    #     # print(non_nse_scrips)
    #     # print(type(non_nse_scrips))
    #
    #     df = df[df['Exchange'] != 'BSE']
    #
    #     # Step 2: Map Scrip Names to Symbols
    #     nse_scrip_list = pd.read_csv(r'src/main/resources/data/portf_data/new_portfolio_equity_list.csv')
    #     # nse_scrip_list = pd.read_csv(r'data/portf_data/new_portfolio_equity_list.csv')
    #
    #     nse_scrip_list.loc[nse_scrip_list.SYMBOL == 'LTFOODS', 'SYMBOL'] = 'DAAWAT'
    #     nse_scrip_list['Normalized_ScripName'] = nse_scrip_list['Name of Company'].apply(IncompleteScrips.normalize_ScripNames)
    #     df['Normalized_ScripName'] = df['Scrip_Name'].apply(IncompleteScrips.normalize_ScripNames)
    #
    #     # Vectorize the normalized scrip names for similarity search
    #     vectorizer = CountVectorizer().fit(nse_scrip_list['Normalized_ScripName'])
    #     nse_vectors = vectorizer.transform(nse_scrip_list['Normalized_ScripName']).toarray()
    #
    #     name_to_symbol = dict(zip(nse_scrip_list['Normalized_ScripName'], nse_scrip_list['SYMBOL']))
    #     df['Symbol'] = df['Normalized_ScripName'].map(name_to_symbol)
    #
    #     # Check for any missing symbols
    #     missing_symbols = df[df['Symbol'].isna()]
    #
    #
    #     # For unmatched symbols, use cosine similarity
    #     for i, row in missing_symbols.iterrows():
    #         normalized_ScripName = row['Normalized_ScripName']
    #         scrip_index, similarity_score = IncompleteScrips.search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer)
    #
    #         if similarity_score > 0.8:  # Threshold to consider a valid match
    #             matched_symbol = nse_scrip_list.iloc[scrip_index]['SYMBOL']
    #             df.at[i, 'Symbol'] = matched_symbol
    #
    #     # Check again for any missing symbols after applying cosine similarity
    #     missing_symbols = df[df['Symbol'].isna()]
    #
    #     if not missing_symbols.empty:
    #         print("These scrips could not be matched after applying cosine similarity:")
    #         print(missing_symbols[['Scrip_Name', 'Normalized_ScripName']])
    #
    #
    #     # # Step 3: Identify First Transaction Date for Each Scrip_Name
    #     # def get_first_transaction_date(scrip_name, df):
    #     #     df['Trade_Date']  = pd.to_datetime(df['Trade_Date'])
    #     #     scrip_records = df[df['Scrip_Name'] == scrip_name]
    #     #     if not scrip_records.empty:
    #     #         return scrip_records['Trade_Date'].min()  # Find the smallest date
    #     #     else:
    #     #         return pd.to_datetime('today')  # Fallback in case no records are found
    #
    #
    #     def get_first_transaction_date(scrip_name, df):
    #         df['Trade_Date'] = pd.to_datetime(df['Trade_Date'], format="%d-%m-%Y")  # Specify the format
    #         scrip_records = df[df['Scrip_Name'] == scrip_name]
    #         # print(f"Processing Scrip_Name: {scrip_name}")  # Debug statement
    #         if not scrip_records.empty:
    #             min_date = scrip_records['Trade_Date'].min()
    #             # print(f"First transaction date for {scrip_name}: {min_date}")  # Debug statement
    #             return min_date  # Find the smallest date
    #         else:
    #             fallback_date = pd.to_datetime('today')
    #             # print(f"No records found for {scrip_name}. Using fallback date: {fallback_date}")  # Debug statement
    #             return fallback_date  # Fallback in case no records are found
    #
    #     # print(short_qty)
    #     # Use the first transaction date for each Scrip_Name
    #     # print("Applying get_first_transaction_date:")
    #     short_qty['FirstDate'] = short_qty['Scrip_Name'].apply(lambda scrip: get_first_transaction_date(scrip, df))
    #
    #     # print("After applying get_first_transaction_date:")
    #     # print(short_qty)
    #
    #
    #     short_qty_table = short_qty[['Scrip_Name','ShortQty']]
    #
    #     # print('SHORT QTY TABLE')
    #     # print(short_qty_table)
    #
    #
    #
    #     # Step 4: Create Records for Short Positions
    #     new_records = []
    #
    #     for _, row in short_qty.iterrows():
    #         first_date = row['FirstDate']
    #
    #         # Determine Settlement Type
    #         # scrip_sett_types = df[df['Scrip_Name'] == row['Scrip_Name']]['Sett Type']
    #         # sett_type = scrip_sett_types.mode()[0] if not scrip_sett_types.mode().empty else 'N'
    #
    #         # Determine Brokerage Amount per Quantity
    #         scrip_brok_amt = df[df['Scrip_Name'] == row['Scrip_Name']]
    #         if not scrip_brok_amt.empty:
    #             brok_amt_per_qty = scrip_brok_amt.iloc[0]['Brok_Amt'] / scrip_brok_amt.iloc[0]['Qty']
    #         else:
    #             brok_amt_per_qty = 0
    #
    #         # Calculate Total Brokerage Amount for the Short Quantity
    #         brok_amt = brok_amt_per_qty * row['ShortQty']
    #
    #         # Determine Market Price
    #         symbol = df[df['Scrip_Name'] == row['Scrip_Name']]['Symbol'].values[0]
    #         mkt_price = last_financial_prices.loc[last_financial_prices['Symbol'] == symbol, 'Close'].values[0]
    #
    #         # Calculate Market Value
    #         # mkt_value = row['ShortQty'] * mkt_price
    #
    #         # # Determine Product Type
    #         # scrip_products = df[df['Scrip_Name'] == row['Scrip_Name']]['Product']
    #         # product = scrip_products.mode()[0] if not scrip_products.mode().empty else 'NA'
    #
    #         new_records.append({
    #             'Trade_Date': first_date,
    #             'Exchange': row['Exchange'],
    #             # 'Sett Type': sett_type,
    #             'Scrip_Name': row['Scrip_Name'],
    #             'Order_Type': 'B',
    #             'Qty': row['ShortQty'],
    #             'Mkt_Price': mkt_price,
    #             # 'Mkt_Value': mkt_value,
    #             # 'Squp/Del': np.nan,
    #             'Brok_Amt': brok_amt,
    #             # 'Net Amt': np.nan,
    #             # 'Product': product,
    #             'Aggregated_Taxes': 0,
    #             'IsNew': True  # Flag for new records
    #         })
    #
    #     df['IsNew'] = False  # Flag for existing records
    #
    #     # Convert new records to DataFrame
    #     new_records_df = pd.DataFrame(new_records)
    #     # print('new records cols',new_records_df)
    #
    #     # Convert 'Trade_Date' to datetime format for both dataframes
    #     df['Trade_Date'] = pd.to_datetime(df['Trade_Date'])
    #     new_records_df['Trade_Date'] = pd.to_datetime(new_records_df['Trade_Date'])
    #
    #     # Append new records to original DataFrame
    #     result_df = pd.concat([new_records_df, df]).reset_index(drop=True)
    #
    #     # Sort the final DataFrame by Date and Flag
    #     result_df = result_df.sort_values(by=['Trade_Date', 'IsNew'], ascending=[True, False]).reset_index(drop=True)
    #
    #     # Retain only the original columns
    #     original_columns = ['Trade_Date', 'Exchange', 'Scrip_Name',
    #                         'Order_Type', 'Qty', 'Mkt_Price', 
    #                         'Brok_Amt','Aggregated_Taxes'] 
    #
    #     result_df = result_df[original_columns]
    #
    #     # Convert 'Trade_Date' to the desired format and ensure dtype is object
    #     result_df['Trade_Date'] = result_df['Trade_Date'].dt.strftime('%d-%b-%y').astype('object')
    #
    #     result_df['CustomQty'] = result_df.apply(
    #         lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
    #
    #     result_df['CumulativeQty'] = result_df.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()
    #
    #     short_qty_table.rename(columns={'Scrip_Name':'Scrip Name','ShortQty':'Short Quantity'},inplace=True)
    #
    #     # print('SHORT QTY TABLE')
    #     # print(short_qty_table)
    #
    #     return result_df,non_nse_scrips,nse_scrips,short_qty_table
    #
    
    
    @staticmethod
    def normalize_ScripNames(text, keep_nums=True):
        if keep_nums:
            text = re.sub(r'[^a-zA-Z0-9\s]', '', text)  # Remove special characters and keep numbers
        else:
            text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove special characters and numbers
        text = text.lower()  # Lower the text

        char_to_replace = {'ltd': '', 'limited': '', 'eng': '', 'engineering': ''}
        for key, value in char_to_replace.items():
            text = text.replace(key, value)

        normalized_text = ' '.join(text.split())  # Remove whitespace
        return normalized_text
    
    @staticmethod
    def search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer):
        vector = vectorizer.transform([normalized_ScripName]).toarray()
        cos_sim_scores = cosine_similarity(vector, nse_vectors)[0]
        return np.argmax(cos_sim_scores), np.max(cos_sim_scores)


    @staticmethod
    def process_incomplete_transactions(data):

        try:
            
            conn, cursor = DBHandler.get_connection()
            mkt_db = MktDB(conn, cursor)
        
            df = data.copy()

            df.drop(columns=['CustomQty','CumulativeQty'],inplace=True)

            last_financial_prices = pd.read_csv(r'src/main/resources/data/portf_data/market_bhav/29-03-2024.csv')





            nse_scrip_list = pd.read_csv(r'src/main/resources/data/portf_data/new_portfolio_equity_list.csv')

            # Preprocess NSE data: Normalize names
            nse_scrip_list['Normalized_ScripName'] = nse_scrip_list['Name of Company'].apply(IncompleteScrips.normalize_ScripNames)

            # Step 1: Identify if `Scrip_Name` contains symbols or company names

            def is_symbol(value):
                # Condition 1: Check if the value exists in the SYMBOL column
                if value in nse_scrip_list['SYMBOL'].values:
                    return True
                
                # Condition 2: Symbols are usually uppercase and without spaces
                if re.fullmatch(r'^[A-Z0-9&.-]+$', value):
                    return True  # Likely a symbol
                
                return False  # Likely a company name


            df['Is_Symbol'] = df['Scrip_Name'].apply(is_symbol)

            # Step 2: If `Scrip_Name` contains symbols, rename it and map company names
            if df['Is_Symbol'].all():  # If all values are symbols
                df.rename(columns={'Scrip_Name': 'Symbol'}, inplace=True)
                df['Scrip_Name'] = df['Symbol'].map(dict(zip(nse_scrip_list['SYMBOL'], nse_scrip_list['Name of Company'])))

                # Find rows where Scrip_Name is NaN
                missing_scrip_names = df[df['Scrip_Name'].isna()]

                if not missing_scrip_names.empty:
                    # Drop rows where Scrip_Name is NaN
                    df = df.dropna(subset=['Scrip_Name']).reset_index(drop=True)

            else:
                # Step 3: Apply Name → Symbol Mapping (for rows with company names)
                df['Normalized_ScripName'] = df['Scrip_Name'].apply(IncompleteScrips.normalize_ScripNames)
                
                # Vectorize the normalized scrip names for similarity search
                vectorizer = CountVectorizer().fit(nse_scrip_list['Normalized_ScripName'])
                nse_vectors = vectorizer.transform(nse_scrip_list['Normalized_ScripName']).toarray()

                # Create mapping dictionary
                name_to_symbol = dict(zip(nse_scrip_list['Normalized_ScripName'], nse_scrip_list['SYMBOL']))
                df['Symbol'] = df['Normalized_ScripName'].map(name_to_symbol)

                # Handle missing symbols using cosine similarity
                missing_symbols = df[df['Symbol'].isna()]
                for i, row in missing_symbols.iterrows():
                    normalized_ScripName = row['Normalized_ScripName']
                    scrip_index, similarity_score = IncompleteScrips.search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer)

                    if similarity_score > 0.8:  # Threshold to consider a valid match
                        matched_symbol = nse_scrip_list.iloc[scrip_index]['SYMBOL']
                        df.at[i, 'Symbol'] = matched_symbol
                        

            # Step 4: Check for remaining unmatched symbols
            df['Symbol'].fillna('Unknown', inplace=True)


            # Step 1: Identify Short Positions
            df['CustomQty'] = df.apply(lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
            df['CumulativeQty'] = df.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()
            short_positions = df[df['CumulativeQty'] < 0]
            short_qty = short_positions.groupby(['Scrip_Name', 'Exchange'])['CumulativeQty'].min().reset_index()
            short_qty['ShortQty'] = -short_qty['CumulativeQty']
            
            # Filter out 'BSE' exchange scrips and print message
            non_nse_scrips = short_qty[short_qty['Exchange'] == 'BSE']
            if not non_nse_scrips.empty:
                non_nse_scrips = non_nse_scrips['Scrip_Name'].unique()
                
            short_qty = short_qty[short_qty['Exchange'] != 'BSE']
            nse_scrips = short_qty['Scrip_Name'].unique()
            


            
            df = df[df['Exchange'] != 'BSE']




            def get_first_transaction_date(scrip_name, df):
                df['Trade_Date'] = pd.to_datetime(df['Trade_Date'], format="%d-%m-%Y")  # Specify the format
                scrip_records = df[df['Scrip_Name'] == scrip_name]
                if not scrip_records.empty:
                    min_date = scrip_records['Trade_Date'].min()
                    # Ensure `min_date` is converted to datetime only if it's not already in datetime format
                    return pd.to_datetime(min_date) if not isinstance(min_date, pd.Timestamp) else min_date

                else:
                    fallback_date = pd.to_datetime('today')
                    return fallback_date  # Fallback in case no records are found

            # Use the first transaction date for each Scrip_Name
            short_qty['FirstDate'] = short_qty['Scrip_Name'].apply(lambda scrip: get_first_transaction_date(scrip, df))

 

            short_qty_table = short_qty[['Scrip_Name','ShortQty']]






            # Step 4: Create Records for Short Positions
            new_records = []

            for _, row in short_qty.iterrows():
                first_date = row['FirstDate']

                # Determine Settlement Type
                # scrip_sett_types = df[df['Scrip_Name'] == row['Scrip_Name']]['Sett Type']
                # sett_type = scrip_sett_types.mode()[0] if not scrip_sett_types.mode().empty else 'N'

                # Determine Brokerage Amount per Quantity
                scrip_brok_amt = df[df['Scrip_Name'] == row['Scrip_Name']]
                if not scrip_brok_amt.empty:
                    brok_amt_per_qty = scrip_brok_amt.iloc[0]['Brok_Amt'] / scrip_brok_amt.iloc[0]['Qty']
                else:
                    brok_amt_per_qty = 0

                # Calculate Total Brokerage Amount for the Short Quantity
                brok_amt = brok_amt_per_qty * row['ShortQty']

                # Determine Market Price
                symbol = df[df['Scrip_Name'] == row['Scrip_Name']]['Symbol'].values[0]




                mkt_price = last_financial_prices.loc[last_financial_prices['Symbol'] == symbol, 'Close'].values[0]


                # Calculate Market Value
                # mkt_value = row['ShortQty'] * mkt_price

                # # Determine Product Type
                # scrip_products = df[df['Scrip_Name'] == row['Scrip_Name']]['Product']
                # product = scrip_products.mode()[0] if not scrip_products.mode().empty else 'NA'

                new_records.append({
                    'Trade_Date': first_date,
                    'Exchange': row['Exchange'],
                    # 'Sett Type': sett_type,
                    'Scrip_Name': row['Scrip_Name'],
                    'Order_Type': 'B',
                    'Qty': row['ShortQty'],
                    'Mkt_Price': mkt_price,
                    # 'Mkt_Value': mkt_value,
                    # 'Squp/Del': np.nan,
                    'Brok_Amt': brok_amt,
                    # 'Net Amt': np.nan,
                    # 'Product': product,
                    'Aggregated_Taxes': 0,
                    'IsNew': True  # Flag for new records
                })

            df['IsNew'] = False  # Flag for existing records


            # Convert new records to DataFrame
            new_records_df = pd.DataFrame(new_records)

            # Convert 'Trade_Date' to datetime format for both dataframes
            df['Trade_Date'] = pd.to_datetime(df['Trade_Date'])
            new_records_df['Trade_Date'] = pd.to_datetime(new_records_df['Trade_Date'])


            # Append new records to original DataFrame
            result_df = pd.concat([new_records_df, df]).reset_index(drop=True)

            # Sort the final DataFrame by Date and Flag
            result_df = result_df.sort_values(by=['Trade_Date', 'IsNew'], ascending=[True, False]).reset_index(drop=True)

            # Retain only the original columns
            original_columns = ['Trade_Date', 'Exchange', 'Scrip_Name',
                                'Order_Type', 'Qty', 'Mkt_Price', 
                                'Brok_Amt','Aggregated_Taxes'] 
            
            result_df = result_df[original_columns]

            # Convert 'Trade_Date' to the desired format and ensure dtype is object
            result_df['Trade_Date'] = result_df['Trade_Date'].dt.strftime('%d-%b-%y').astype('object')

            result_df['CustomQty'] = result_df.apply(
                lambda x: x['Qty'] if x['Order_Type'] == 'B' else -x['Qty'], axis=1)
            
            result_df['CumulativeQty'] = result_df.groupby(['Scrip_Name', 'Exchange'])['CustomQty'].cumsum()

            short_qty_table.rename(columns={'Scrip_Name':'Scrip Name','ShortQty':'Short Quantity'},inplace=True)


            return result_df,non_nse_scrips,nse_scrips,short_qty_table
        

        except Exception as e:
            print("An error occurred in incpmplete scrips:", e)            
