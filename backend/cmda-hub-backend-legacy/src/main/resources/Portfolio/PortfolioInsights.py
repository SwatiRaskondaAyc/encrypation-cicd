import sys
import json
import pandas as pd
from babel.numbers import format_currency, format_decimal
from data_logger import logger

class PortfolioInsights:   
    @staticmethod
    def format_inr(value):
        """Format values in INR currency format."""
        try:
            return format_currency(value, 'INR', locale='en_IN')
        except:
            return value 

    @staticmethod
    def get_latest_portfolio_insights(portfolio_fifo_results_df):
        """Extract latest portfolio insights."""
        
        portfolio_fifo_results_df.rename(columns={
            'Deployed_Amount': 'Deployed Amount',
            'Brokerage_Amount': 'Brokerage Amount',
            'Realized_PNL': 'Realized PNL',
            'Unrealized_%_Return': 'Unrealized % Return',
            'Remaining_Qty' : 'Remaining Qty', #[Remaining_Qty]
            'Market_Value' : 'Market Value',
            'Unrealized_PNL': 'Unrealized PNL'
        }, inplace=True)
        
        portfolio_fifo_results_df.loc[:, 'Remaining Qty'] = pd.to_numeric(portfolio_fifo_results_df['Remaining Qty'], errors='coerce')
        portfolio_fifo_results_df.loc[:, 'Market Value'] = pd.to_numeric(portfolio_fifo_results_df['Market Value'], errors='coerce')

        
        latest_date = portfolio_fifo_results_df["Date"].max()
        # latest_data = portfolio_fifo_results_df[portfolio_fifo_results_df["Date"] == latest_date]
        latest_data = portfolio_fifo_results_df[portfolio_fifo_results_df["Date"] == latest_date]

        
    
        # Filter data where Remaining Qty > 0
        # filtered_latest_data = latest_data[latest_data['Remaining Qty'] > 0]
        
        filtered_latest_data = latest_data
        
        pd.set_option('display.max_columns', None)  # Show all columns
        pd.set_option('display.expand_frame_repr', False)  # Prevent wrapping
        pd.set_option('display.width', 1000)  # Set wider output width
        # print(filtered_latest_data)
    
       
        # Ensure 'Unrealized % Return' is converted to float (if needed)
        # if filtered_latest_data['Unrealized % Return'].dtype == 'object':
        #     filtered_latest_data.loc[:, 'Unrealized % Return'] = (
        #         filtered_latest_data['Unrealized % Return']
        #         .astype(str)
        #         .str.replace("%", "", regex=False)  # Remove percentage sign
        #         .str.replace(",", "", regex=False)  # Remove commas (if any)
        #         .astype(float)
        #     )
    
    
        col = (filtered_latest_data['Unrealized % Return']
         .astype(str, copy=False)          # keep the Series view
         .str.strip()
         .str.rstrip('%')
         .str.replace(',', '', regex=False)
         .replace({'', 'None', 'none', 'nan', 'NaN'}, pd.NA)  # obvious nulls → NA
         )
        
        filtered_latest_data['Unrealized % Return'] = pd.to_numeric(col, errors='coerce')
        
        
        # latest_date = pd.to_datetime(latest_date, errors='coerce')
        
        # Compute portfolio values (without formatting)
        portfolio_values = PortfolioInsights.get_latest_portfolio_values(filtered_latest_data)
          
        return portfolio_values


    def get_latest_portfolio_values(portfolio_fifo_results_df):
        """Calculate financial portfolio values."""
        
        
        
        # def clean_numeric(df, cols):
        #     """
        #     Make sure every value in `cols` is either a float or NaN.
        #     1. Turn obvious null markers into np.nan
        #     2. Strip currency symbols, commas, %, spaces
        #     3. Coerce to float
        #     """
        #
        # null_tokens = {'', 'none', 'nan', 'null', 'na', '-', '--'}
        # regex_strip  = r'[^\d\.\-]'          # keep digits, dot, minus
        #
        # for col in cols:
        #     series = df[col].astype(str).str.strip()           # step 0 – string, no spaces
        #     series = series.str.lower().map(
        #                  lambda x: np.nan if x in null_tokens else x
        #              )                                         # step 1 – obvious nulls → NaN
        #     series = series.astype(str).str.replace(regex_strip, '', regex=True)  # step 2
        #     df[col] = pd.to_numeric(series, errors='coerce')   # step 3
        #
        # return df
        
        # Ensure 'Date' column is in datetime format
        portfolio_fifo_results_df['Date'] = pd.to_datetime(portfolio_fifo_results_df['Date'], errors='coerce')
        
        # Find the latest date
        
        latest_date = portfolio_fifo_results_df["Date"].max()
        # latest_data = portfolio_fifo_results_df[portfolio_fifo_results_df["Date"] == latest_date]
        latest_data = portfolio_fifo_results_df[portfolio_fifo_results_df["Date"] == latest_date].copy()
        # Filter data where Remaining Qty > 0
        # filtered_latest_data = latest_data[latest_data['Remaining Qty'] > 0]
        filtered_latest_data = latest_data
        # print(filtered_latest_data[['Symbol','Remaining Qty','Realized PNL']])
        
        
        
        # if pd.isna(latest_date):
        #     logger.warning("No valid date found in portfolio data.")
        #     return {"error": "No valid date found."}
        # # print(latest_data)
        #
        # if latest_data.empty:
        #     logger.warning("No portfolio data available for the latest date.")
        #     return {"error": "No portfolio data available for the latest date."}
    
        logger.info("Calculating portfolio values as of latest date...")
        
        # Convert relevant columns to numeric format
        # numeric_columns = ['Deployed Amount', 'Market Value', 'Unrealized PNL', 'Realized PNL', 'Brokerage Amount']
        # filtered_latest_data[numeric_columns] = filtered_latest_data[numeric_columns].apply(pd.to_numeric, errors='coerce')
        
        # ---------- clean numbers ----------
        numeric_columns = ['Deployed Amount', 'Market Value',
                           'Unrealized PNL', 'Realized PNL', 'Brokerage Amount']
        
        
        filtered_latest_data[numeric_columns] = (
            filtered_latest_data[numeric_columns]
                .replace(['None', None, '', 'nan', 'NaN'], '0')  # handle strings and actual None
                .replace(r'[^0-9.\-]', '', regex=True)           # remove ₹, %, commas etc.
                .replace('', '0')                                # if any empty string remains
                .apply(pd.to_numeric, errors='coerce')           # finally convert to float
        )
        # print(filtered_latest_data[numeric_columns])
        # print(filtered_latest_data[numeric_columns].dtypes)

        clean_block = (
            filtered_latest_data[numeric_columns]
              .replace(r'[^0-9.\-]', '', regex=True)   # remove commas, ₹, %, etc.
              .apply(pd.to_numeric, errors='coerce')   # convert safely
        )
        
        filtered_latest_data[numeric_columns] = clean_block
        
        # print(filtered_latest_data[numeric_columns].dtypes)

        # Compute key values
        current_value = filtered_latest_data['Market Value'].sum()
        deployed_amount = filtered_latest_data['Deployed Amount'].sum()
        unrealized_pnl = filtered_latest_data['Unrealized PNL'].sum()
        realized_pnl = filtered_latest_data['Realized PNL'].sum()
        brokerage_amount = filtered_latest_data['Brokerage Amount'].sum()
        # print(unrealized_pnl)
        # print(realized_pnl)
        percent_change = ((current_value - deployed_amount) / deployed_amount * 100) if deployed_amount != 0 else None
    
        logger.info("Successfully calculated portfolio values...")
        
        # Return results in JSON format
        return {
            'latest_date': latest_date.strftime("%d %B %Y"),
            'current_value': PortfolioInsights.format_inr(current_value),
            'deployed_amount': PortfolioInsights.format_inr(deployed_amount),
            'percent_change': percent_change,
            'unrealized_pnl': PortfolioInsights.format_inr(unrealized_pnl),
            'realized_pnl': PortfolioInsights.format_inr(realized_pnl),
            'brokerage_amount': PortfolioInsights.format_inr(brokerage_amount),
        }

        

if __name__ == "__main__":
    try:
        import warnings
        warnings.simplefilter(action='ignore', category=FutureWarning)
        warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)

        # Read file paths from arguments
        latest_data_file = sys.argv[1]  
        # transaction_file = sys.argv[2]

        # Read JSON data from files
        with open(latest_data_file, "r") as f:
            latest_data_json = json.load(f)
        # with open(transaction_file, "r") as f:
        #     transaction_json = json.load(f)

        # Convert JSON strings to Pandas DataFrames
        portfolio_fifo_results_df = pd.DataFrame(latest_data_json)
        # transaction_tab = pd.DataFrame(transaction_json)

        # Process insights
        insights = PortfolioInsights.get_latest_portfolio_insights(portfolio_fifo_results_df)

        # Output ONLY the final result
        print(json.dumps(insights))  # <- clean JSON for Java parser

    except Exception as e:
        error_response = {"error": str(e)}
        print(json.dumps(error_response))
        sys.exit(1)


# if __name__ == "__main__":
#     try:
#         # Read file paths from arguments
#         latest_data_file = sys.argv[1]  
#         transaction_file = sys.argv[2]
#
#         # Read JSON data from files
#         with open(latest_data_file, "r") as f:
#             latest_data_json = json.load(f)
#         with open(transaction_file, "r") as f:
#             transaction_json = json.load(f)
#
#         # Convert JSON strings to Pandas DataFrames
#         portfolio_fifo_results_df = pd.DataFrame(latest_data_json)
#         transaction_tab = pd.DataFrame(transaction_json)
#
#         # Process insights
#         insights = PortfolioInsights.get_latest_portfolio_insights(portfolio_fifo_results_df, transaction_tab)
#
#         # Return JSON response
#         print(json.dumps(insights))
#     except Exception as e:
#         print(json.dumps({"error": f"Error processing insights: {str(e)}"}))
