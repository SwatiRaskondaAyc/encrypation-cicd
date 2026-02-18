import pandas as pd
import numpy as np
from collections import defaultdict

def generate_ledger_view(fifo_df, holdings_df):
    # --- 1. Current Holdings (BUY positions) ---
    current_holdings = []
    if not holdings_df.empty and 'Qty' in holdings_df.columns:
        active_df = holdings_df[holdings_df['Qty'] > 0].copy()
        for _, row in active_df.iterrows():
            pnl_perc = row.get('Unrealized_PnL_Perc', 0)
            avg_price = row.get('Avg_Buy_Price', 0.0)
            current_price = row.get('Mkt_Price', 0.0)
            if avg_price == 0: avg_price = current_price

            current_holdings.append({
                "id": str(row.name), 
                "scrip": row.get('Scrip_Name', 'Unknown'),
                "type": "Bought",
                "qty": int(row['Qty']),
                "date": row['Trade_Date'].strftime('%d-%m-%Y') if pd.notna(row.get('Trade_Date')) else "-",
                "price": round(avg_price, 2),
                "current_price": round(current_price, 2),
                "buy_brokerage": round(row.get('Brokerage_Amount', 0), 2),  # Renamed from "brokerage"
                "buy_taxes": round(row.get('Taxes', 0), 2),                # Renamed from "taxes"
                "tax_breakdown": row.get('Tax_Breakdown', {}), 
                "pnl_perc": round(pnl_perc, 2),
                "status": "Still Holding"
            })

    # --- 2. Closed Positions (SELL positions with matched BUY legs) ---
    closed_positions = []
    if not fifo_df.empty:
        grouper = fifo_df.groupby(['Scrip_Name', 'Sell_Date'])
        for (scrip, sell_date), group in grouper:
            total_sell = group['Sell_Qty'].sum()
            if total_sell == 0: continue

            avg_sell = (group['Sell_Price'] * group['Sell_Qty']).sum() / total_sell
            avg_buy = (group['Buy_Price'] * group['Buy_Qty']).sum() / total_sell
            total_pnl = group['Realized_PnL'].sum()
            pnl_perc = (total_pnl / (avg_buy * total_sell)) * 100 if avg_buy * total_sell != 0 else 0
            
            # Aggregate SELL taxes for parent card
            agg_sell_tax_breakdown = defaultdict(float)
            
            # Aggregate BUY brokerage and taxes for display
            total_buy_brokerage = 0.0
            total_buy_taxes = 0.0
            
            buy_legs = []
            for _, r in group.iterrows():
                # Add to parent card aggregates
                leg_sell_bk = r.get('Sell_Tax_Breakdown', {})
                if isinstance(leg_sell_bk, dict):
                    for k, v in leg_sell_bk.items(): agg_sell_tax_breakdown[k] += v
                
                # Sum buy-side costs
                buy_brok = r.get('Buy_Brokerage', 0)
                buy_tax = r.get('Buy_Taxes', 0)
                total_buy_brokerage += buy_brok
                total_buy_taxes += buy_tax
                
                # Build buy leg entry with BOTH buy and sell costs
                buy_leg_tax_breakdown = r.get('Buy_Tax_Breakdown', {})
                
                buy_legs.append({
                    "qty": int(r['Buy_Qty']),
                    "buy_date": r['Buy_Date'].strftime('%d-%m-%Y'),
                    "buy_price": round(r['Buy_Price'], 2),
                    "buy_brokerage": round(buy_brok, 2),       # BUY-side cost
                    "buy_taxes": round(buy_tax, 2),            # BUY-side cost
                    "buy_tax_breakdown": buy_leg_tax_breakdown,
                    "sell_brokerage": round(r.get('Sell_Brokerage', 0), 2),  # SELL-side cost
                    "sell_taxes": round(r.get('Sell_Taxes', 0), 2),          # SELL-side cost
                    "sell_tax_breakdown": r.get('Sell_Tax_Breakdown', {}),
                    "sell_price": round(r['Sell_Price'], 2),
                })

            closed_positions.append({
                "id": f"{scrip}_{sell_date}", 
                "scrip": scrip, 
                "type": "Sold",
                "qty": int(total_sell),
                "sell_date": sell_date.strftime('%d-%m-%Y'),
                "avg_sell_price": round(avg_sell, 2),
                "avg_buy_price": round(avg_buy, 2),
                "total_buy_brokerage": round(total_buy_brokerage, 2),
                "total_buy_taxes": round(total_buy_taxes, 2),
                "total_sell_brokerage": round(group['Sell_Brokerage'].sum(), 2),
                "total_sell_taxes": round(group['Sell_Taxes'].sum(), 2),
                "sell_tax_breakdown": dict(agg_sell_tax_breakdown),
                "pnl_perc": round(pnl_perc, 2),
                "realized_pnl": round(total_pnl, 2),
                "status": "Sold", 
                "buy_legs": buy_legs
            })
        closed_positions.sort(key=lambda x: pd.to_datetime(x['sell_date'], format='%d-%m-%Y'), reverse=True)

    return { "current_holdings": current_holdings, "closed_positions": closed_positions }
