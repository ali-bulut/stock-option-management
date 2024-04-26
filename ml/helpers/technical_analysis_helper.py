def calculate_moving_average(data, window):
    return data.transform(lambda x: x.rolling(window=window, min_periods=1).mean())

def calculate_rsi(data):
    delta = data.diff()
    gain = delta.where(delta > 0, 0).rolling(window=14, min_periods=1).mean()
    loss = (-delta).where(delta < 0, 0).rolling(window=14, min_periods=1).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    rsi = rsi.fillna(1) # Replace NaN values in rsi with 1

    return rsi
