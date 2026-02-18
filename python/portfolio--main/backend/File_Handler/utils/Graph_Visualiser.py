import json
import pandas as pd
import logging

# Ensure all submodules are importable
from Portfolio_Analysis.Graphs import (
    Complex_Sunburst,
    Top_Performing,
    Turnover_Analysis,
    Trade_Analysis,
    Sector_Analysis,
    Valuation_Analysis,
    Probabilistic_Analysis,
    Risk_Analysis,
    Rebalancing
)
from backend.Portfolio_Analysis.Graphs import Stock_Deployed

logger = logging.getLogger(__name__)

class GraphVisualiser:
    @staticmethod
    def generate_graph(results1, results2, graphType: str) -> dict:
        """
        Dispatcher for generating specific graphs.
        :param results1: Portfolio Timeseries (FIFO results) - List of Dicts or JSON str
        :param results2: Raw Transaction Data - List of Dicts or JSON str
        :param graphType: String identifier for the graph
        :return: Dictionary (Plotly JSON) or Error Dictionary
        """
        if not graphType:
             return {"error": "Missing graph type argument."}

        try:
            # 1. Robust Input Parsing (Handle String or List/Dict)
            def parse_input(data):
                if data is None: return []
                if isinstance(data, str):
                    try:
                        return json.loads(data)
                    except json.JSONDecodeError:
                        # Handle double-encoded strings if necessary
                        try:
                            return json.loads(json.loads(data))
                        except:
                            return []
                return data

            data1 = parse_input(results1)
            data2 = parse_input(results2)

            # 2. Create DataFrames
            # df1: Portfolio Timeseries
            df1 = pd.DataFrame(data1)
            if not df1.empty and 'Date' in df1.columns:
                # Handle milliseconds or string dates
                if pd.api.types.is_integer_dtype(df1['Date']) or str(df1['Date'].dtype).startswith('int'):
                     df1['Date'] = pd.to_datetime(df1['Date'], unit='ms', errors='coerce')
                else:
                     df1['Date'] = pd.to_datetime(df1['Date'], errors='coerce')

            # df2: Raw Transactions
            df2 = pd.DataFrame(data2)
            if not df2.empty and 'Trade_Date' in df2.columns:
                if pd.api.types.is_integer_dtype(df2['Trade_Date']) or str(df2['Trade_Date'].dtype).startswith('int'):
                     df2['Trade_Date'] = pd.to_datetime(df2['Trade_Date'], unit='ms', errors='coerce')
                else:
                     df2['Trade_Date'] = pd.to_datetime(df2['Trade_Date'], errors='coerce')

            # 3. Dispatcher
            plot_result = {"error": f"Unknown graph type: {graphType}"}

            if graphType == "top_ten_script":
                plot_result = Top_Performing.top_10_Scrips_combined(df1)
            elif graphType == "combined_box_plot":
                plot_result = Turnover_Analysis.combined_box_plot(df1, df2)
            elif graphType == "stock_deployed_amt_over_time":
                plot_result = Stock_Deployed.stock_deployed_amt_over_time(df1)
            elif graphType == "create_invested_amount_plot":
                plot_result = Stock_Deployed.create_invested_amount_plot(df2)
            elif graphType == "create_PNL_plot":
                plot_result = Trade_Analysis.create_PNL_plot(df2)
            elif graphType == "create_industry_sunburst":
                plot_result = Sector_Analysis.create_industry_sunburst(df1)
            elif graphType == "create_user_sunburst_with_dropdown":
                 # Note: This might be in Complex_Sunburst or Sector_Analysis depending on your repo structure
                 # Your import implies Sector_Analysis, but function name suggests Complex
                 if hasattr(Sector_Analysis, 'create_user_sunburst_with_dropdown'):
                     plot_result = Sector_Analysis.create_user_sunburst_with_dropdown(df1)
                 else:
                     plot_result = Complex_Sunburst.create_user_sunburst_with_dropdown(df1)
            elif graphType == "generate_combined_bubble_chart":
                plot_result = Valuation_Analysis.generate_combined_bubble_chart(df1)
            elif graphType == "create_best_trade_plot":
                plot_result = Probabilistic_Analysis.create_best_trade_plot(df1)
            elif graphType == "classify_stocks_risk_return":
                plot_result = Risk_Analysis.classify_stocks_risk_return(df1)
            elif graphType == "plot_portfolio_eps_bv_quarterly_all_entries":
                plot_result = Complex_Sunburst.plot_portfolio_eps_bv_quarterly_all_entries(df1)
            elif graphType == "portfolio_replacements":
                plot_result = Rebalancing.generate_portfolio_replacements(df1)
            elif graphType == "actual_date_replacements":
                plot_result = Rebalancing.generate_actual_date_replacements(df2)

            return plot_result

        except Exception as e:
            logger.error(f"Graph Generation Error ({graphType}): {e}")
            return {"error": str(e)}
