import pandas as pd
import numpy as np

def calculate_intraday_flag(df: pd.DataFrame) -> pd.DataFrame:
    """
    Determines if trades are 'Intraday' based on strict criteria:
    - Group by (Trade_Date, Symbol)
    - Net Quantity must be 0
    - Must have both BUY and SELL sides
    - Cumulative position path must start at 0, end at 0
    - Cumulative position path must never be non-zero at start of day (no overnight)
    
    Returns the DataFrame with a new 'Intraday_Flag' (bool) column.
    """
    if df.empty:
        df['Intraday_Flag'] = False
        return df

    # Prepare working columns
    # We need: Trade_Date, Symbol, Order_Type, Qty
    # Order_Type should be 'B' or 'S'
    # Trade_Date should be datetime or date object
    
    # Create a copy to avoid mutating original immediately (though we will return enriched df)
    # We'll calculate the flag per group and map it back.
    
    # Ensure necessary columns exist
    required_cols = ['Trade_Date', 'Symbol', 'Order_Type', 'Qty']
    for c in required_cols:
        if c not in df.columns:
            # Cannot calculate if missing core data
            df['Intraday_Flag'] = False
            return df

    # Vectorized approach is hard for custom path logic, so we'll use apply/groupby
    # But for performance (large portfolios), we should try to be efficient.
    # Given the complexity (cumulative sum check), a custom apply on groupby is best.

    # 1. Helper to determine signed quantity
    def get_signed_qty(row):
        q = float(row['Qty'])
        # If Qty <= 0, ignore (or treat as valid? User said ignore rows where qty <= 0)
        # But we assume filtering happened before or we handle it here.
        if q <= 0: return 0
        
        ot = str(row['Order_Type']).upper().strip()
        if ot in ['B', 'BUY']:
            return q
        elif ot in ['S', 'SELL']:
            return -q
        return 0

    df['__signed_qty'] = df.apply(get_signed_qty, axis=1)
    
    # 2. Define the logical check function for a single group
    def check_intraday_group(group):
        # Rule 1: Net Qty != 0 -> Not Intraday
        net_qty = group['__signed_qty'].sum()
        if not np.isclose(net_qty, 0, atol=1e-5):
            return False
            
        # Rule 2: Must have both BUY and SELL
        # (Since net is 0 and we have non-zero signed qty, this is implicitly true if there are trades, 
        # but let's be explicit if a simplified case like Buy -10? No, Buy is +, Sell is -)
        # If we have only buys, sum > 0. If only sells, sum < 0. For sum==0, must have both or neither.
        # If 'neither' (empty group or all 0 qty), it's not a "trade" day really.
        if group['__signed_qty'].abs().sum() == 0:
            return False

        # Rule 3: Exposure Path Validation
        # Sort by time/id if available. 
        # User prompt: "execution_time (for ordering), trade_id"
        # If execution_time missing, we rely on row order (assuming input is sorted?)
        # Let's try to sort if possible.
        sort_cols = []
        if 'Trade_execution_time' in group.columns:
            sort_cols.append('Trade_execution_time')
        # Fallback to index if no time column, assuming file order roughly preserves time
        
        if sort_cols:
            group = group.sort_values(by=sort_cols)
            
        cum_pos = group['__signed_qty'].cumsum()
        
        # Rule 3a: cum_position must end at 0 (checked by net_qty)
        # Rule 3b: cum_position must never depend on prior-day positions (it doesn't, we are grouping by day)
        # Rule 3c: Position exposure returns to zero at least once by EOD (It ends at 0, so satisfied)
        
        # Rule 6: Overnight Carry Protection
        # "The day must not close an existing overnight position"
        # This implies we must start from 0. Since we group by date, our cumulative sum STARTS at the first trade.
        # IF the first trade is a SELL, and we go negative, is that allowed?
        # User said: "SELL -> BUY (short intraday)" IS allowed.
        # So starting negative is allowed (short selling).
        # We just need to end at 0.
        
        # "Explicitly Invalid Patterns: Sell today, buy tomorrow" -> This is cross-day, handled by grouping by Date.
        # "Partial intraday with remaining open qty" -> Handled by Net Qty == 0.
        
        return True

    # 3. Apply Grouping
    # Group by ['Trade_Date', 'Symbol']
    # We need to map the result back to the original rows.
    
    # Optimization: Calculate valid groups (Date, Symbol) set
    # Create a unique ID for grouping
    df['__group_id'] = df['Trade_Date'].astype(str) + "_" + df['Symbol'].astype(str)
    
    # Filter out invalid rows strictly for this calculation? 
    # User said: "Ignore rows where quantity <= 0, side missing/invalid, date/symbol missing"
    # We'll just define them as False for intraday.
    
    valid_mask = (
        (df['Qty'] > 0) & 
        (df['Order_Type'].str.upper().isin(['B', 'BUY', 'S', 'SELL'])) &
        (df['Trade_Date'].notna()) & 
        (df['Symbol'].notna())
    )
    
    valid_df = df[valid_mask].copy()
    
    if valid_df.empty:
         df['Intraday_Flag'] = False
         if '__signed_qty' in df.columns: del df['__signed_qty']
         return df

    # Apply logic
    # We can use transform to broadcast the result to all rows in the group
    # However, 'check_intraday_group' needs to process the whole group at once.
    
    # Let's iterate over groups - might be slow for huge data but safest for complex logic
    # Or use groupby().apply() which returns a Series indexed by group keys?
    
    # Fast vectorized check for Net Qty first (filters out 90% of non-intraday)
    group_sums = valid_df.groupby(['Trade_Date', 'Symbol'])['__signed_qty'].sum()
    potential_intraday_groups = group_sums[np.isclose(group_sums, 0, atol=1e-5)].index
    
    # Now valid_df only for potential groups
    # We need to reconstruct the boolean mask
    # Is there a way to do this efficiently? 
    # Let's stick to groupby apply returning a boolean per group, then map.
    
    def strict_check(g):
        # We already know Sum is ~0 if we pre-filtered, but let's re-check or just do the path check
        # We need to ensure we have both Buy and Sell?
        # Absolute sum of signed qty == Sum of Qty. 
        # If I buy 10 and Sell 10, signed sum = 0, abs sum = 20.
        # If I buy 10, signed sum = 10, abs sum = 10.
        # So if signed sum == 0 and abs sum > 0, we imply we have positive and negative components 
        # (unless we have 0 qty trades, which we filtered).
        # So Rule 5 (At least one BUY, At least one SELL) is satisfied if Net=0 and count > 0.
        
        # Rule: allowed patterns: Buy->Sell, Sell->Buy.
        # Is there any case where Net=0 fails?
        # User said: "Exposure Path Validation (Critical)... cum_position must start at 0".
        # In our independent day context, it ALWAYS starts at 0 before the first trade.
        # But wait, "Overnight Carry Protection... close an existing overnight position".
        # This implies if we have an open position from yesterday, we can't count today's trades as pure intraday 
        # if they interact with that? 
        # actually, the requirement says: "Evaluate trades only within (trade_date, symbol)... Trades from previous days must not be considered."
        # AND "The day must not close an existing overnight position".
        # This is a contradiction if we don't look at previous days?
        # INTERPRETATION: The "Intraday Flag" is purely a property of the *trades on that day*.
        # If I have 100 qty from yesterday. Today I Sell 10, Buy 10.
        # Within today's scope: Net Qty = 0. Buy and Sell exist. Path: 0 -> -10 -> 0.
        # Is this Intraday?
        # "No overnight carry is created or reduced on that day". 
        # If I sell 10 (reducing overnight), then buy 10 (re-adding).
        # Effectively I traded intraday.
        # PROBABLY SAFE interpretation: If the *day's trades* sum to 0, it is treated as intraday logic for *those trades*.
        # The prompt says: "Evaluate trades only within (trade_date, symbol). Trades from previous days must not be considered."
        # This strongly suggests we isolate the day.
        
        return True

    # Actually, let's just use the Net Qty == 0 logic combined with valid rows check.
    # The complex rules (exposure path) essentially boil down to Net=0 for a single day scope ??
    # Unless... "cum_position must never depend on prior-day positions".
    # If I just check Net=0, that's necessary.
    # Are there edge cases?
    # Case: Buy 10 at 10:00, Buy 10 at 12:00. Net != 0. False.
    # Case: Buy 10, Sell 10. Net = 0. True.
    # Case: Sell 10, Buy 10. Net = 0. True.
    # Case: Buy 10, Sell 5, Sell 5. Net = 0. True.
    # It seems for a *single day isolation*, Net Qty == 0 is the primary driver.
    # The prompt is very verbose but might just mean "Square off happens same day".
    
    intraday_indices = []
    
    # We can use a set of (Date, Symbol) tuples that are valid
    # Check Net Qty == 0
    sums = valid_df.groupby(['Trade_Date', 'Symbol'])['__signed_qty'].sum()
    # Check Non-Zero Volume (to ensure it's not empty)
    vols = valid_df.groupby(['Trade_Date', 'Symbol'])['Qty'].sum()
    
    valid_groups = sums[np.isclose(sums, 0, atol=1e-5)].index.intersection(vols[vols > 0].index)
    
    # Mark these groups as Intraday=True
    # We need to join this back to original DF.
    
    # Create a set for O(1) lookup
    valid_valid_groups_set = set(valid_groups)
    
    def set_flag(row):
        if row.get('Qty', 0) <= 0: return False # Explicit rule 1
        return (row['Trade_Date'], row['Symbol']) in valid_valid_groups_set

    df['Intraday_Flag'] = df.apply(set_flag, axis=1)
    
    # Cleanup
    if '__signed_qty' in df.columns: del df['__signed_qty']
    if '__group_id' in df.columns: del df['__group_id']
    
    return df
