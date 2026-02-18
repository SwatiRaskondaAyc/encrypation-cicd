from babel.numbers import format_decimal, format_currency
from pandas._libs import index
import pandas as pd

class DescriptiveStats:

    @staticmethod
    def format_inr(value):
        try:
            return format_decimal(value,locale='en_IN')
        except:
            return value 


    @staticmethod
    def marketSummary(df):
        # print(type(df))
        #
        #
        # print(df)
        #

        latest_data = df.iloc[-1]

        timestamp = latest_data['Date']
        date_string = timestamp.strftime("%d %B %Y")
        week_day = timestamp.strftime("%A")
        
        change_from_prev_close = float(round(latest_data['LastPrice'] - latest_data['PrevClose'], 2))
        percent_change = float(round((change_from_prev_close / latest_data['PrevClose']) * 100, 2))

        # Gap up/down
        gap = float(latest_data['Open'] - latest_data['PrevClose'])
        gap_percent = float(gap*100/latest_data['PrevClose'])

        if gap>0:
            gap_statement = f"opened with a Gap Up of {str(round(gap, 2))} points, +{round(gap_percent, 2)}%"
        else:
            gap_statement = f"opened with a Gap Down of {str(round(gap, 2))} points, -{round(gap_percent, 2)}%"


        # Traded Quantity
        avg_daily_traded_qty =  int(round(df['TotalTradedQty'].mean()))

        summary_dict = dict(latest_data[['PrevClose','Open','High','Low','LastPrice','Close',
               'AveragePrice','TotalTradedQty','TotalTradedValue','TotalTrades',
               'DeliverableQty','DeliveryPercentage']])
        
        
        summary_dict = {k: int(val) if k in ['TotalTradedQty', 'TotalTrades', 'DeliverableQty'] else float(val) \
                        for k, val in summary_dict.items() }
        
        summary_dict = {key: DescriptiveStats.format_inr(value) for key, value in summary_dict.items()}
        
        summary_dict.update({'change_from_prev_close': change_from_prev_close,
                             'percent_change': percent_change,
                             'gap':gap,
                             'gap_percent':gap_percent,
                             'gap_statement': gap_statement,
                             'avg_daily_traded_qty':avg_daily_traded_qty,
                             'date_string': date_string,
                             'week_day': week_day,
                            })

        return summary_dict
    

    @staticmethod
    def calc_avg_delv_rate(df, period):
        """ Calculate the average delivery rate for a given DataFrame."""
        
        if period == 'Previous Day':
            # Use the delivery rate of the last day
            avg_delivery_rate = df['DeliveryPercentage'].values[0]
        else:
            # Calculate deliverable quantity and total traded quantity
            deliverable_qty = df['DeliverableQty'].sum()
            total_qty = df['TotalTradedQty'].sum()

            # Calculate average delivery rate
            avg_delivery_rate = round((deliverable_qty / total_qty) * 100, 2)

        return avg_delivery_rate
