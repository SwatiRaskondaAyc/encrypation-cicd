import pandas as pd
import numpy as np
import logging
from collections import defaultdict, deque
from dataclasses import dataclass
from mtm.repo.price_action import PriceAction
from .price_lookup_adapter import DataFramePriceLookup, build_price_lookup_from_df

logger = logging.getLogger(__name__)

@dataclass
class FIFOLot:
    qty: float
    price: float
    date: pd.Timestamp
    brokerage: float = 0.0  # Track BUY-side brokerage per lot
    taxes: float = 0.0      # Track BUY-side taxes per lot
    tax_breakdown: dict = None  # Track BUY-side tax breakdown

class RepeatedCalc:
    def __init__(self, transaction_df):
        self.transactions = transaction_df.copy()
        # Normalize to midnight to ensure grouping by 'Date' works with pd.date_range
        self.transactions['Trade_Date'] = pd.to_datetime(self.transactions['Trade_Date']).dt.normalize()
        
        if 'Symbol' in self.transactions.columns:
            self.symbol_col = 'Symbol'
        else:
            self.symbol_col = 'Scrip_Name'
            
        self.fifo_ledger = [] 
        self.current_snapshot = pd.DataFrame()

    def calculate_results(self) -> pd.DataFrame:
        try:
            if self.transactions.empty:
                return pd.DataFrame()

            min_date = self.transactions['Trade_Date'].min()
            max_date = pd.Timestamp.today().normalize() 
            
            symbols = self.transactions[self.symbol_col].unique().tolist()

            logger.info(f"Fetching price history for {len(symbols)} symbols...")
            price_fetcher = PriceAction(symbols=symbols)
            
            if hasattr(price_fetcher, 'fetch_historical_data'):
                price_history_df = price_fetcher.fetch_historical_data(symbols, min_date, max_date)
            elif hasattr(price_fetcher, 'get_price_history'):
                price_history_df = price_fetcher.get_price_history(symbols, min_date, max_date)
            else:
                 price_history_df = pd.DataFrame({'Symbol': symbols, 'Date': [max_date]*len(symbols), 'Close': [0.0]*len(symbols)})

            if price_history_df is None or price_history_df.empty:
                 logger.warning("Price fetch returned empty. Valuations will be zero.")
                 price_history_df = pd.DataFrame({'Symbol': symbols, 'Date': [max_date]*len(symbols), 'Close': [0.0]*len(symbols)})

            price_lookup = build_price_lookup_from_df(price_history_df)
            latest_prices = {}
            if not price_history_df.empty:
                latest_prices = price_history_df.sort_values('Date').groupby('Symbol')['Close'].last().to_dict()

            calendar = pd.date_range(start=min_date, end=max_date, freq='D')
            results_df = self._compute_portfolio_timeseries(self.transactions, calendar, price_lookup, latest_prices)
            
            return results_df

        except Exception as e:
            logger.error(f"RepeatedCalc Error: {e}")
            raise e

    def _compute_portfolio_timeseries(self, df, calendar, price_lookup, latest_prices):
        rows = []
        holdings = defaultdict(deque) 
        
        trades_by_date = df.groupby('Trade_Date')
        running_realized = defaultdict(float)
        running_brokerage = defaultdict(float)
        running_taxes = defaultdict(float)
        
        running_tax_breakdown = defaultdict(lambda: defaultdict(float))
        tax_cols_in_df = [col for col in df.columns if col.startswith('Tax_')]

        self.fifo_ledger = []

        def get_row_tax_breakdown(r):
            d = {}
            for c in tax_cols_in_df:
                val = float(r.get(c, 0))
                if val > 0:
                    clean_name = c.replace('Tax_', '').replace('_', ' ')
                    d[clean_name] = val
            return d

        for date in calendar:
            if date in trades_by_date.groups:
                day_trades = trades_by_date.get_group(date)
                for _, row in day_trades.iterrows():
                    sym = row[self.symbol_col]
                    scrip_label = row.get('Scrip_Name', sym)
                    qty = float(row['Qty'])
                    price = float(row['Mkt_Price'])
                    side = row['Order_Type']
                    
                    # Get brokerage and taxes for this trade
                    trade_brokerage = float(row.get('Brokerage_Amt', row.get('Brokerage', row.get('Brokerage_Amount', 0))))
                    trade_taxes = float(row.get('Taxes', row.get('Total_Taxes', 0)))
                    trade_tax_breakdown = get_row_tax_breakdown(row)
                    
                    running_brokerage[sym] += trade_brokerage
                    running_taxes[sym] += trade_taxes

                    for tax_col in tax_cols_in_df:
                        clean_name = tax_col.replace('Tax_', '').replace('_', ' ')
                        running_tax_breakdown[sym][clean_name] += float(row.get(tax_col, 0))

                    lots = holdings[sym]

                    # --- BUY LOGIC ---
                    if side == 'B':
                        lots.append(FIFOLot(
                            qty=qty, 
                            price=price, 
                            date=date,
                            brokerage=trade_brokerage,
                            taxes=trade_taxes,
                            tax_breakdown=trade_tax_breakdown
                        ))
                    
                    # --- SELL LOGIC ---
                    else:
                        qty_to_sell = qty
                        
                        # Get SELL-side taxes to prorate
                        sell_trade_taxes = trade_tax_breakdown
                        sell_brokerage_total = trade_brokerage
                        sell_taxes_total = trade_taxes
                        
                        while qty_to_sell > 1e-5 and lots:
                            current_lot = lots[0] 
                            matched_qty = min(qty_to_sell, current_lot.qty)
                            
                            # Ratio of this specific match vs the LOT size (for pruning the lot's costs)
                            lot_ratio = matched_qty / current_lot.qty

                            # Prorate SELL taxes for this leg (from the SELL trade)
                            # ratio here is matched_qty / total_sell_so_far? No, wait.
                            # sell_trade_taxes is for the FULL sell order. 
                            # We need ratio of `matched_qty` / `qty` (total sell order qty).
                            trade_ratio = matched_qty / qty if qty > 0 else 0
                            
                            leg_sell_tax_breakdown = {k: v * trade_ratio for k, v in sell_trade_taxes.items()}
                            leg_sell_brokerage = sell_brokerage_total * trade_ratio
                            leg_sell_taxes = sell_taxes_total * trade_ratio
                            
                            # Calculate BUY-side costs associated with the sold portion
                            buy_side_brokerage = current_lot.brokerage * lot_ratio
                            buy_side_taxes = current_lot.taxes * lot_ratio
                            buy_side_breakdown = {k: v * lot_ratio for k, v in (current_lot.tax_breakdown or {}).items()}

                            # GROSS REALIZED PNL CALCULATION (Per User Request)
                            # Gross PnL = (Sell Price - Buy Price) * Qty
                            # We strictly exclude brokerage/taxes from this metric.
                            realized_pnl = (price - current_lot.price) * matched_qty
                            running_realized[sym] += realized_pnl

                            # --- IMPORTANT: Store BOTH buy-side and sell-side costs ---
                            self.fifo_ledger.append({
                                'Scrip_Name': scrip_label,
                                'Symbol': sym,
                                'Buy_Date': current_lot.date,
                                'Buy_Price': current_lot.price,
                                'Buy_Qty': matched_qty,
                                'Buy_Brokerage': buy_side_brokerage,
                                'Buy_Taxes': buy_side_taxes,
                                'Buy_Tax_Breakdown': buy_side_breakdown,
                                'Sell_Date': date,
                                'Sell_Price': price,
                                'Sell_Qty': matched_qty,
                                'Sell_Brokerage': leg_sell_brokerage,
                                'Sell_Taxes': leg_sell_taxes,
                                'Sell_Tax_Breakdown': leg_sell_tax_breakdown,
                                'Realized_PnL': realized_pnl,
                                'Qty': matched_qty 
                            })

                            # Update the Lot's remaining costs
                            current_lot.qty -= matched_qty
                            current_lot.brokerage -= buy_side_brokerage
                            current_lot.taxes -= buy_side_taxes
                            if current_lot.tax_breakdown:
                                for k in current_lot.tax_breakdown:
                                    current_lot.tax_breakdown[k] -= buy_side_breakdown.get(k, 0)
                            
                            qty_to_sell -= matched_qty
                            if current_lot.qty <= 1e-5: lots.popleft()

            snapshot_rows = []
            all_symbols = set(holdings.keys()).union(running_realized.keys())
            
            for sym in all_symbols:
                lots = holdings[sym]
                current_qty = sum(lot.qty for lot in lots)
                current_deployed = sum(lot.qty * lot.price for lot in lots)
                
                # Calculate remaining costs for current holdings
                current_holding_brokerage = sum(lot.brokerage for lot in lots)
                current_holding_taxes = sum(lot.taxes for lot in lots)
                
                # Sum breakdown dicts
                current_holding_breakdown = defaultdict(float)
                for lot in lots:
                    if lot.tax_breakdown:
                        for k, v in lot.tax_breakdown.items():
                            current_holding_breakdown[k] += v
                
                # Fallback: If breakdown is empty but total taxes > 0, use total
                if not current_holding_breakdown and current_holding_taxes > 0:
                     current_holding_breakdown['Net Taxes'] = current_holding_taxes

                if current_qty <= 1e-5 and running_realized[sym] == 0: continue

                cur_price = price_lookup(sym, date)
                if (pd.isna(cur_price) or cur_price == 0) and date == calendar[-1]:
                    cur_price = latest_prices.get(sym, 0.0)
                    if cur_price == 0:
                        logger.debug(f"[RepeatedCalc] Price for {sym} is 0.0 on {date.date()}")
                
                mkt_val = current_qty * cur_price
                unrealized_pnl = mkt_val - current_deployed
                unrealized_perc = (unrealized_pnl / current_deployed * 100) if current_deployed > 0 else 0.0
                avg_buy_price = (current_deployed / current_qty) if current_qty > 0 else 0.0

                row_data = {
                    'Date': date, 'Symbol': sym, 'Scrip_Name': sym, 'Qty': current_qty,
                    'Remaining_Qty': current_qty, 'Deployed_Amount': current_deployed,
                    'Market_Value': mkt_val, 'Mkt_Price': cur_price, 'Avg_Buy_Price': avg_buy_price,
                    'Realized_PNL': running_realized[sym], 'Unrealized_PNL': unrealized_pnl,
                    'Unrealized_PnL_Perc': unrealized_perc, 
                    'Brokerage_Amount': current_holding_brokerage, # Fixed: Now uses remaining cost
                    'Taxes': current_holding_taxes,                # Fixed: Now uses remaining cost
                    'Tax_Breakdown': dict(current_holding_breakdown)
                }
                rows.append(row_data)
                if date == calendar[-1]: snapshot_rows.append(row_data)

        self.current_snapshot = pd.DataFrame(snapshot_rows)
        if not self.current_snapshot.empty:
            min_trade_dates = (
                self.transactions
                .groupby(self.symbol_col)['Trade_Date']
                .min()
                .rename('Trade_Date')
            )
            if 'Trade_Date' in self.current_snapshot.columns:
                self.current_snapshot.drop(columns=['Trade_Date'], inplace=True)
            
            self.current_snapshot = self.current_snapshot.merge(
                min_trade_dates, left_on='Symbol', right_index=True, how='left'
            )

        return pd.DataFrame(rows)

    def get_fifo_table(self): return pd.DataFrame(self.fifo_ledger)
    def get_current_holdings(self): return self.current_snapshot
