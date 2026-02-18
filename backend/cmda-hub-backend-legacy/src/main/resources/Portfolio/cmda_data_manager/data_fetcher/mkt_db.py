import pandas as pd
from datetime import datetime, timedelta

class MktDB:
    def __init__(self, conn, cursor):
        self.conn, self.cursor = conn, cursor
        self.last_updated_dt = self._get_last_updated_date()
        
    def get_listed_securities(self):
        query = '''SELECT * FROM ListedSecurities '''
        ListedSecurities = pd.read_sql(query, self.conn)
        ListedSecurities['ListingDate'] = pd.to_datetime(ListedSecurities['ListingDate'], format='mixed')
        return ListedSecurities    
    
    def _get_last_updated_date(self):
        query="Select Max([Date]) as LastUpdatedDate From Mkt_WorkingDays;"
        LastUpdatedDate = pd.read_sql(query, self.conn)
        return LastUpdatedDate['LastUpdatedDate'].iloc[0]
    

    def _get_lastest_date(self):
        query="Select max([Date]) as LastUpdatedDate from HistPA;"
        LastUpdatedDate = pd.read_sql(query, self.conn)
        return LastUpdatedDate['LastUpdatedDate'].iloc[0]
    
    def _get_dtf_isin_info(self):
        fetch_query = '''SELECT [ISIN], Min([Date]) as fetch_StartDate, Max([Date]) fetch_EndDate, count(*) records
              FROM [dbo].[DailyTimeFrame]
              GROUP BY [ISIN]'''

        dtf_isin_info = pd.read_sql(fetch_query, self.conn)
        dtf_isin_info['fetch_EndDate'] = pd.to_datetime(dtf_isin_info['fetch_EndDate'])
        dtf_isin_info['fetch_StartDate'] = pd.to_datetime(dtf_isin_info['fetch_EndDate'])
        return dtf_isin_info

    
    def fetch_historical_data(self, symbols=None, start_date=None, end_date=None):
        """
        Fetch data from the HistoricalData table based on the given parameters.

        Parameters:
            symbols (list): List of symbols to filter by.
            start_date (str): Start date in 'YYYY-MM-DD' format.
            end_date (str): End date in 'YYYY-MM-DD' format.

        Returns:
            pd.DataFrame: A DataFrame containing the fetched data.
        """
        # Default to last day's data if no parameters are provided
        if not (symbols or start_date or end_date):
            last_day = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            query = f"""
            SELECT * FROM [dbo].[HistPA]
            WHERE [Date] = '{last_day}'
            """
        else:
            # Build the dynamic query
            query = "SELECT * FROM [dbo].[HistPA] WHERE 1=1"
            
            # Add date range filter
            # if start_date:
            #     query += f" AND [Date] >= '{start_date}'"
            # if end_date:
            #     query += f" AND [Date] <= '{end_date}'"
            if start_date:
                 query += f" AND [Date] >= CONVERT(DATE, '{start_date}')"
            if end_date:     
                 query += f" AND [Date] <= CONVERT(DATE, '{end_date}')"

            
            # Add symbols filter
            if symbols:
                symbols_str = ','.join(f"'{symbol}'" for symbol in symbols)
                query += f" AND [Symbol] IN ({symbols_str})"
        
        # Fetch the data using pandas
        try:
            data = pd.read_sql(query, self.conn)
        except Exception as e:
            # print(f"Error fetching data: {e}")
            return None

        return data
    
    def fetch_daily_tf_data(self, symbols=None, start_date=None, end_date=None):
        """
        Fetch data from the HistoricalData table based on the given parameters.

        Parameters:
            symbols (list): List of symbols to filter by.
            start_date (str): Start date in 'YYYY-MM-DD' format.
            end_date (str): End date in 'YYYY-MM-DD' format.

        Returns:
            pd.DataFrame: A DataFrame containing the fetched data.
        """
        # Default to last day's data if no parameters are provided
        if not (symbols or start_date or end_date):
            last_day = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            query = f"""
            SELECT * FROM [dbo].[HistPA]
            WHERE [Date] = '{last_day}'
            """
        else:
            # Build the dynamic query
            query = "SELECT * FROM [dbo].[HistPA] WHERE 1=1"
            
            # Add date range filter
            if start_date:
                query += f" AND [Date] >= '{start_date}'"
            if end_date:
                query += f" AND [Date] <= '{end_date}'"
           

            
            # Add symbols filter
            if symbols:
                symbols_str = ','.join(f"'{symbol}'" for symbol in symbols)
                query += f" AND [Symbol] IN ({symbols_str})"
        
        # Fetch the data using pandas
        try:
            data = pd.read_sql(query, self.conn)
        except Exception as e:
            # print(f"Error fetching data: {e}")
            return None

        return data