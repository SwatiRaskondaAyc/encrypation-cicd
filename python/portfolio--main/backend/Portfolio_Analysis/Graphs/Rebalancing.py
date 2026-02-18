import logging
import pandas as pd
import numpy as np
from collections import deque

# --- CONFIG ---
INFLATION_RATE_DEFAULT = 0.05
FD_RATE_DEFAULT = 0.07
MF_RATE_DEFAULT = 0.15

logger = logging.getLogger(__name__)

def create_swot_plot(
    transaction_df: pd.DataFrame, 
    inflation_rate: float = INFLATION_RATE_DEFAULT,
    fd_rate: float = FD_RATE_DEFAULT, 
    mf_rate: float = MF_RATE_DEFAULT
) -> dict:
    """
    Generates SWOT Analysis data: Nominal and Real returns per stock.
    Uses FIFO to calculate realized ROI per trade.
    """
    try:
        # 1. Normalise
        if transaction_df.empty:
             return {"error": "Empty transaction data"}

        df = transaction_df.copy()
        
        if 'Trade_Date' not in df.columns:
            return {"error": "Trade_Date column missing"}

        df['Trade_Date'] = pd.to_datetime(df['Trade_Date'])
        df['Qty'] = pd.to_numeric(df['Qty'], errors='coerce').fillna(0)
        df['Mkt_Price'] = pd.to_numeric(df['Mkt_Price'], errors='coerce').fillna(0)
        
        symbol_col = 'Symbol' if 'Symbol' in df.columns else 'Scrip_Name'
        df = df.sort_values([symbol_col, 'Trade_Date'])
        
        scrip_returns = [] 
        
        # Per-Stock FIFO Stack
        for scrip, group in df.groupby(symbol_col):
            buy_queue = deque()
            
            for _, row in group.iterrows():
                qty = float(row['Qty'])
                price = float(row['Mkt_Price'])
                typ = str(row['Order_Type']).upper().strip()
                
                if 'B' in typ:
                    buy_queue.append({'qty': qty, 'price': price})
                elif 'S' in typ:
                    qty_to_sell = qty
                    while qty_to_sell > 0 and buy_queue:
                        buy_lot = buy_queue[0]
                        matched_qty = min(qty_to_sell, buy_lot['qty'])
                        
                        buy_price = buy_lot['price']
                        
                        if buy_price > 0:
                            roi = (price - buy_price) / buy_price
                            scrip_returns.append({
                                'Symbol': scrip,
                                'Return': roi,
                                'Weight': matched_qty 
                            })
                        
                        qty_to_sell -= matched_qty
                        buy_lot['qty'] -= matched_qty
                        if buy_lot['qty'] < 0.0001:
                            buy_queue.popleft()

        # 2. Aggregate Average Return per Scrip
        if not scrip_returns:
             return {'graph_data': {}, 'insights': {'key_takeaways': ["No closed trades found for analysis."], 'recommendations': []}}
             
        perf = pd.DataFrame(scrip_returns)
        perf = perf.groupby('Symbol')['Return'].mean().reset_index()
        
        perf['Real_Return'] = perf['Return'] - inflation_rate
        perf['Pct'] = perf['Return'] * 100

        # 3. Categorize (Thresholds)
        def bucket(v, opp_th, str_th):
            if v > str_th: return 'Strengths'
            if v > opp_th: return 'Opportunities'
            if v > 0: return 'Weaknesses'
            return 'Threats'

        # 4. Build Graph Data
        graph_data = {'FD':{'nominal':{},'real':{}}, 'MF':{'nominal':{},'real':{}}}
        centers = {
            'Strengths': (-9, 5), 'Opportunities': (1, 5),
            'Weaknesses': (-9,-5), 'Threats': (1,-5)
        }
        
        # Dynamic Thresholds based on FD/MF Rates
        fd_opp_th = max(0.01, fd_rate - 0.02)
        mf_opp_th = max(0.01, mf_rate - 0.05)
        
        benchmarks = [('FD', fd_opp_th, fd_rate), ('MF', mf_opp_th, mf_rate)]
        
        for bench, opp_th, str_th in benchmarks:
             for mode in ['nominal', 'real']:
                col = 'Return' if mode == 'nominal' else 'Real_Return'
                xs, ys, txt, hov = [], [], [], []
                
                # Adjust thresholds for Real mode
                eff_opp = opp_th if mode == 'nominal' else (opp_th - inflation_rate)
                eff_str = str_th if mode == 'nominal' else (str_th - inflation_rate)
                
                for idx, row in perf.iterrows():
                    val = row[col]
                    cat = bucket(val, eff_opp, eff_str)
                    cx, cy = centers[cat]
                    jitter = (hash(row['Symbol']) % 10) * 0.5
                    xs.append(cx + (idx % 2)) 
                    ys.append(cy - jitter)
                    pct = val * 100
                    txt.append(f"{row['Symbol']} ({pct:.1f}%)")
                    hov.append(f"{row['Symbol']}: {pct:.2f}%")
                
                graph_data[bench][mode] = {'x': xs, 'y': ys, 'text': txt, 'hover': hov}

        # 5. Generate Insights (CORRECTED CALL)
        # Pass the fd_rate and mf_rate from the outer function arguments
        insights = generate_swot_insights(perf, fd_rate, mf_rate, inflation_rate)
        
        return {
            'graph_data': graph_data,
            'insights': insights
        }

    except Exception as e:
        logger.error(f"SWOT Plot Error: {e}")
        return {"error": str(e)}

def generate_swot_insights(perf_df: pd.DataFrame, fd_rate: float, mf_rate: float, inflation_rate: float) -> dict:
    """
    Generates rich, educational SWOT insights.
    Acts as a 'Virtual Analyst' explaining the 'Why' behind the data.
    """
    takeaways = []
    actions = []
    
    # Helper for cleaner appending
    def add_insight(title, text, reasoning):
        takeaways.append({"title": title, "text": text, "reasoning": reasoning})
    def add_action(title, text, reasoning):
        actions.append({"title": title, "text": text, "reasoning": reasoning})

    # --- 1. STRENGTHS (The Winners) ---
    strongest = perf_df[perf_df['Return'] > mf_rate]
    if not strongest.empty:
        best = strongest.nlargest(1, 'Return').iloc[0]
        count = len(strongest)
        add_insight(
            "🌟 High Conviction Winners", 
            f"You have **{count}** stocks categorized as 'Strengths'. The leader is **{best['Symbol']}** with a **{best['Pct']:.1f}%** return.", 
            f"These stocks are generating 'Alpha'—beating your aggressive target of {mf_rate*100:.0f}%."
        )
        add_action(
            "Let Winners Run", 
            f"Consider adding to **{best['Symbol']}** on dips.", 
            "In trend-following strategies, strong stocks tend to stay strong."
        )

    # --- 2. WEAKNESSES (The Opportunity Cost) ---
    # Stocks that made money (Return > 0) but less than FD (Return < FD)
    dead_money = perf_df[(perf_df['Return'] > 0) & (perf_df['Return'] < fd_rate)]
    if not dead_money.empty:
        laggard = dead_money.iloc[0]
        add_insight(
            "⚠️ The 'Dead Money' Trap", 
            f"**{len(dead_money)}** stocks are in the 'Weakness' zone (Positive return, but less than {fd_rate*100:.0f}% FD rate). Example: **{laggard['Symbol']}**.", 
            "You are taking Stock Market Risk for returns lower than a Risk-Free Bank Deposit."
        )
        add_action(
            "Trim Weak Positions", 
            f"Review **{laggard['Symbol']}**. Is it worth the stress?", 
            "Capital stuck here has a high 'Opportunity Cost'—it could be deployed elsewhere."
        )

    # --- 3. THREATS (The Capital Erosion) ---
    threats = perf_df[perf_df['Return'] < 0]
    if not threats.empty:
        worst = threats.nsmallest(1, 'Return').iloc[0]
        loss_pct = abs(worst['Pct'])
        add_action(
            "🛑 Stop Loss Alert", 
            f"**{worst['Symbol']}** is your biggest drag (down **{loss_pct:.1f}%**).", 
            "A 50% loss requires a 100% gain just to break even. Cut deep losses early."
        )

    # --- 4. REAL vs NOMINAL (The Inflation Reality) ---
    # Stocks that look green nominally, but are red in real terms
    inflation_exposed = perf_df[(perf_df['Return'] > 0) & (perf_df['Real_Return'] < 0)]
    if not inflation_exposed.empty:
        victim = inflation_exposed.iloc[0]
        infl_pct = inflation_rate * 100
        add_insight(
            "📉 Inflation Illusion", 
            f"**{victim['Symbol']}** is up nominally (**{victim['Pct']:.1f}%**), but your **Real Return** is negative.", 
            f"After adjusting for ~{infl_pct:.1f}% inflation, this investment has actually reduced your purchasing power."
        )

    # --- 5. OPPORTUNITIES (The Middle Ground) ---
    # Stocks between FD and MF rates
    steady = perf_df[(perf_df['Return'] >= fd_rate) & (perf_df['Return'] <= mf_rate)]
    if not steady.empty:
        add_insight(
            "🌱 Nurturing Phase", 
            f"**{len(steady)}** stocks are performing decently (beating FDs but not yet MFs).", 
            "These are your 'Opportunities'. They have momentum but need time to become multi-baggers."
        )

    # Fallback if few insights
    if not takeaways:
        add_insight("Neutral Portfolio", "Your portfolio is tightly clustered around your benchmarks.", "No extreme outliers found.")

    return {"key_takeaways": takeaways, "recommendations": actions}
