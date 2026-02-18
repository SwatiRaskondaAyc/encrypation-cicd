import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import json
import sys

def create_calculator(json_path, percent_change_sensex):
    try:
        # Attempt to read as NDJSON
        data = pd.read_json(json_path, lines=True)
    except ValueError:
        # If it fails, read as standard JSON array
        data = pd.read_json(json_path, lines=False)

    df = data.copy()
    df1 = pd.read_csv('data/sensex_data/nifty_50.csv')

    # Convert Date columns to datetime format in both dataframes
    df['Date'] = pd.to_datetime(df['Date'])
    df1['Date'] = pd.to_datetime(df1['Date'])

    # Rename columns to avoid conflicts
    df.rename(columns={'Close': 'Close_stock'}, inplace=True)
    df1.rename(columns={'Close': 'Close_sensex'}, inplace=True)

    # Merge the two dataframes on 'Date' column
    merged_df = pd.merge(df, df1, on='Date', suffixes=('_stock', '_sensex'))

    # Standardize the prices (z-scores)
    merged_df['Z_Sensex'] = (merged_df['Close_sensex'] - merged_df['Close_sensex'].mean()) / merged_df['Close_sensex'].std()
    merged_df['Z_Stock'] = (merged_df['Close_stock'] - merged_df['Close_stock'].mean()) / merged_df['Close_stock'].std()

    # Normalize TotalTradedQty and DeliveryPercentage (For entire data)
    merged_df['Normalized_TotalTradedQty'] = (merged_df['TotalTradedQty'] - merged_df['TotalTradedQty'].mean()) / merged_df['TotalTradedQty'].std()
    merged_df['Normalized_DeliveryPercentage'] = (merged_df['DeliveryPercentage'] - merged_df['DeliveryPercentage'].mean()) / merged_df['DeliveryPercentage'].std()

    # Adjusted Dispersion (using entire dataset)
    k, m = 0.5, 0.5  # Scaling factors for volatility and stability
    merged_df['Adjusted_Dispersion'] = abs(merged_df['Z_Sensex'] - merged_df['Z_Stock']) * \
        (1 + k * merged_df['Normalized_TotalTradedQty']) * (1 - m * merged_df['Normalized_DeliveryPercentage'])

    # Perform linear regression to calculate beta
    X = merged_df[['Z_Sensex']].values  # Predictor (Sensex)
    y = merged_df['Z_Stock'].values  # Response (Stock)
    regressor = LinearRegression()
    regressor.fit(X, y)
    beta = regressor.coef_[0]  # Regression coefficient (beta)

    # Weighted Beta (using latest normalized values)
    latest_row = merged_df.iloc[-1]  # Get the latest row (most recent data)
    normalized_qty = latest_row['Normalized_TotalTradedQty']
    normalized_delivery = latest_row['Normalized_DeliveryPercentage']
    weighted_beta = beta * (1 + 0.3 * normalized_qty) * (1 - 0.3 * normalized_delivery)

    beta = weighted_beta

    # Calculate median dispersion from the entire dataset
    median_dispersion = merged_df['Adjusted_Dispersion'].median()

    # Calculate percentiles for tighter dispersion range
    low_dispersion = merged_df['Adjusted_Dispersion'].quantile(0.1)  # 10th percentile
    high_dispersion = merged_df['Adjusted_Dispersion'].quantile(0.9)  # 90th percentile

    # Beta effective calculations
    beta_effective_median = weighted_beta / (1 + median_dispersion)
    beta_effective_low = weighted_beta / (1 + low_dispersion)
    beta_effective_high = weighted_beta / (1 + high_dispersion)

    # Percent changes
    percent_change_stock_median = beta_effective_median * percent_change_sensex
    percent_change_stock_low = beta_effective_low * percent_change_sensex
    percent_change_stock_high = beta_effective_high * percent_change_sensex

    # Get the most recent stock price
    recent_stock_price = df['Close_stock'].iloc[-1]

    last_15_days = df.iloc[-16:-1]  # Excludes the latest price, takes the 15 days prior

    # Calculate daily percentage changes
    last_15_days.loc[:, 'Daily_Percent'] = last_15_days['Close_stock'].pct_change()

    # Separate positive and negative daily percentage changes
    rise_percent_changes = last_15_days['Daily_Percent'][last_15_days['Daily_Percent'] > 0]
    fall_percent_changes = last_15_days['Daily_Percent'][last_15_days['Daily_Percent'] < 0]

    # Calculate volatility for rises and falls
    volatility_rise = rise_percent_changes.std()
    volatility_fall = fall_percent_changes.std()

    # Calculate adjustments using the volatilities
    adjustment_rise = recent_stock_price * volatility_rise
    adjustment_fall = recent_stock_price * volatility_fall

    adjustment_rise = adjustment_rise / 2 if adjustment_rise > 5 else adjustment_rise
    adjustment_fall = adjustment_fall / 2 if adjustment_fall > 5 else adjustment_fall

    # Apply adjustments in price range calculations
    price_low_rise = (recent_stock_price * (1 + percent_change_stock_low / 100) + adjustment_rise)
    price_high_rise = (recent_stock_price * (1 + percent_change_stock_high / 100) - adjustment_rise)

    price_low_fall = (recent_stock_price * (1 - percent_change_stock_low / 100) + adjustment_fall)
    price_high_fall = (recent_stock_price * (1 - percent_change_stock_high / 100) - adjustment_fall)

    # Return as JSON
    result = {
        "percent_change_stock_low": percent_change_stock_low,
        "percent_change_stock_median": percent_change_stock_median,
        "percent_change_stock_high": percent_change_stock_high,
        "beta": beta,
        "low_dispersion": low_dispersion,
        "high_dispersion": high_dispersion,
        "median_dispersion": median_dispersion,
        "beta_effective_high": beta_effective_high,
        "beta_effective_low": beta_effective_low,
        "beta_effective_median": beta_effective_median,
        "recent_stock_price": recent_stock_price,
        "adjustment_rise": adjustment_rise,
        "adjustment_fall": adjustment_fall
        # "percent_change_stock_high": df1['percent_change_stock_high'].tolist(),
        # "percent_change_stock_low": df1['percent_change_stock_low'].tolist(),
        # "predicted_price_high": df1['predicted_price_high'].tolist(),
        # "predicted_price_low": df1['predicted_price_low'].tolist(),
        # "price_high_rise": price_high_rise,
        # "price_low_rise": price_low_rise,
        # "price_high_fall": price_high_fall,
        # "price_low_fall": price_low_fall
    }

    return json.dumps(result)

if __name__ == "__main__":
    json_path = sys.argv[1]
    # Parse percent_change_sensex from the second argument
    percent_change_sensex = float(sys.argv[2])  # Convert to float for calculations
    result = create_calculator(json_path, percent_change_sensex)
    print(json.dumps(result, indent=4))
