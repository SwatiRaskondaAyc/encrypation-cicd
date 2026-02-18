import pandas as pd
from data_actions import PDataActions
from utils import PUtils
from portfolio_results import PortfolioResults
from portfolio_visualizations import VisualizeInsights
from babel.numbers import format_decimal, format_currency
from data_logger import logger
from flask import Flask
from calendar import Calendar


class PortfolioResultPacket:



    @staticmethod
    def format_inr(value):
        try:
            return format_decimal(value,locale='en_IN')
        except:
            return value 


    @staticmethod
    def get_portfolio_fifo_results(transaction_tab):
        
        # transaction_tab = DataActions.column_transformations_calculations(transaction_tab)

        # transaction_tab, incomplete_scrips = DataActions.filter_transaction_tab(transaction_tab)

        Calendar = PDataActions.get_Calendar_with_month_dates(transaction_tab)
        # print("Calebnder",Calendar)

        nse_scrips_df, nse_ScripName_list = PUtils.get_nse_scrips_df()

        pr = PortfolioResults()
        # print(transaction_tab.head())
        portfolio_fifo_results_dict = pr.create_portfolio_results_by_month(transaction_tab, Calendar, nse_scrips_df, nse_ScripName_list)
        # print("portfolio dict fgefgseufgwseufgwseufgewfgew")
        # print(portfolio_fifo_results_dict)

        return portfolio_fifo_results_dict
    
    @staticmethod
    def get_latest_portfolio_insights(portfolio_fifo_results_df,transaction_tab):
        latest_date = portfolio_fifo_results_df.index.get_level_values('Date').max()
        latest_data = portfolio_fifo_results_df.loc[latest_date]
        filtered_latest_data = latest_data[latest_data['Remaining Qty'] > 0]

        # Apply the formatting function to all numeric columns in filtered_latest_data
        for column in filtered_latest_data.select_dtypes(include='number').columns:
            filtered_latest_data[column] = filtered_latest_data[column].apply(PortfolioResultPacket.format_inr)


        portfolio_plots = PortfolioResultPacket.get_latest_portfolio_plots(latest_data,portfolio_fifo_results_df,transaction_tab)

        portfolio_values = PortfolioResultPacket.get_latest_portfolio_values(latest_data, latest_date)

        # Create a snippet of the latest data
        latest_portfolio_snippet = filtered_latest_data.to_html(classes='table table-striped')

        # Return the snippet and insights
        return latest_portfolio_snippet, {'values': portfolio_values, 'plots': portfolio_plots}


    @staticmethod
    def get_latest_portfolio_values(latest_data, latest_date):
        logger.info("Calculating portfolio Values as of latest date...")
        # Your Portfolio Results as of {latest_date}
        current_value = latest_data['Market Value'].sum()
        deployed_amount = latest_data['Deployed Amount'].sum()
        percent_change = ((current_value - deployed_amount)/deployed_amount)*100
        unrealized_pnl = latest_data['Unrealized PNL'].sum()
        realized_pnl = latest_data['Realized PNL'].sum()
        brokerage_amount = latest_data['Brokerage Amount'].sum()
        logger.info("Successfully calculated portfolio Values...")

        return {'latest_date':latest_date.strftime("%d %B %Y"), 
                'current_value': format_currency(current_value, 'INR', locale='en_IN'),
                'deployed_amount': format_currency(deployed_amount, 'INR', locale='en_IN'),
                'percent_change': percent_change, 
                'unrealized_pnl': unrealized_pnl, 
                'realized_pnl': realized_pnl,
                'brokerage_amount': format_currency(brokerage_amount, 'INR', locale='en_IN'),
        }
    
    @staticmethod
    def get_latest_portfolio_plots(latest_data,portfolio_fifo_results_df,transaction_tab):
        logger.info("Creating Portfolio Plots...")
         # Generate insights using provided methods
        T10_Scrips_Realized_pnl = VisualizeInsights.top_10_Scrips_by_Realized_PNL(latest_data)
        T10_Scrips_Unrealized_pnl = VisualizeInsights.top_10_Scrips_by_Unrealized_PNL(latest_data) 
        T10_Scrips_Turnover = VisualizeInsights.top_10_Scrips_by_Turnover(latest_data)
        T10_Scrips_Brokerage = VisualizeInsights.top_10_Scrips_by_Brokerage(latest_data)
        deployed_amt_over_time = VisualizeInsights.stock_deployed_amt_over_time(portfolio_fifo_results_df)
        deployed_amt_box_plot = VisualizeInsights.deployed_amount_box_plot(portfolio_fifo_results_df)
        combined_bar_plot = VisualizeInsights.top_10_Scrips_combined(latest_data)
        combined_box_plot = VisualizeInsights.combined_box_plot(portfolio_fifo_results_df,transaction_tab)
        pnl_plot = VisualizeInsights.create_PNL_plot(transaction_tab)
        swot_plot=  VisualizeInsights.create_swot_plot(transaction_tab)
        best_trades = VisualizeInsights.create_best_trade_plot(portfolio_fifo_results_df)
        industry_sunburst = VisualizeInsights.create_industry_sunburst(latest_data)
        user_dropdown_sunburst = VisualizeInsights.create_user_sunburst_with_dropdown(portfolio_fifo_results_df)



        VisualizeInsights.update_dynamic_dash(portfolio_fifo_results_df)  # Update Dash app

        dash_app_url = '/dash_drilldown/'  # Hardcoded URL for now

        logger.info("All Plots Created Successfully...")


        return  {'T10_Scrips_Realized_pnl': T10_Scrips_Realized_pnl,
                 'T10_Scrips_Unrealized_pnl': T10_Scrips_Unrealized_pnl,
                 'T10_Scrips_Turnover': T10_Scrips_Turnover, 
                 'T10_Scrips_Brokerage': T10_Scrips_Brokerage,
                 'Deployed_amt_over_time': deployed_amt_over_time, 
                 'Deployed_amt_box_plot':combined_box_plot,
                 'Combined_bar_plot':combined_bar_plot,
                 'PNL_Plot':pnl_plot,
                 'SWOT_Plot': swot_plot,
                 'Best_Trades': best_trades,
                 'Industry_Sunburst': industry_sunburst,
                 'Dropdown_Sunburt': user_dropdown_sunburst,
                 'Drilldown_Dash_App_URL': dash_app_url,

        }
    
    @staticmethod
    def get_individual_stock_plots(stock_name,fifo_df):
        # genrate plots for individual stocks
        table = VisualizeInsights.get_table(stock_name,fifo_df)
        additional_table = VisualizeInsights.get_add_table(stock_name,fifo_df)
        bar_plot = VisualizeInsights.get_bar_plot(stock_name,fifo_df)
        realized_pnl_plot = VisualizeInsights.get_realized_pnl_plot(stock_name,fifo_df)
        unrealized_pnl_plot = VisualizeInsights.get_unrealized_pnl_plot(stock_name,fifo_df)
        box_plot = VisualizeInsights.get_box_plot(stock_name,fifo_df)

        return{'table':table,
               'additional_table':additional_table,
               'bar_plot':bar_plot,
               'realized_pnl_plot':realized_pnl_plot,
               'unrealized_pnl_plot':unrealized_pnl_plot,
               'box_plot':box_plot,
        }
    



            
                




