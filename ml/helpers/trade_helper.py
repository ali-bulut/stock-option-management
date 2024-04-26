import json
import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression
from helpers.technical_analysis_helper import calculate_moving_average, calculate_rsi
from helpers.date_helper import get_date
from helpers.http_request_helper import get_request, TRADE_ENDPOINT_URL

def trade(cash, options, shares_owned, auth_token):
    cash = float(cash)
    max_cash_percentage_per_trade = 0.1

    # Collect historical data for training (from 2018-01-01 to NOW) and train the model
    training_data = pd.DataFrame()
    for option in options:
        stock_data = yf.download(option, start="2018-01-01", end=get_date(1))
        stock_data['Symbol'] = option  # Add symbol as a column for identification
        stock_data.dropna(inplace=True)
        training_data = pd.concat([training_data, stock_data])

    # Data preprocessing for training
    training_data['MA_50'] = calculate_moving_average(training_data.groupby('Symbol')['Close'], 50)
    training_data['MA_200'] = calculate_moving_average(training_data.groupby('Symbol')['Close'], 200)
    training_data['RSI'] = calculate_rsi(training_data.groupby('Symbol')['Close'])

    # Drop NaN values after preprocessing
    training_data.dropna(inplace=True)

    # Model training
    X_train = training_data[['MA_50', 'MA_200', 'RSI']]
    y_train = training_data['Close']

    model = LinearRegression()
    model.fit(X_train, y_train)

    forecast_data = training_data
    X_forecast = forecast_data[['MA_50', 'MA_200', 'RSI']]
    predictions = model.predict(X_forecast.filter(like=str(get_date()), axis=0)) # Get today's predictions

    index = 0
    for i, option in enumerate(options):
        data_for_option = forecast_data[forecast_data['Symbol'] == option]
        row = data_for_option.filter(like=str(get_date()), axis=0)
        if row.empty:
            continue
        
        row = row.iloc[0]

        prediction = predictions[index]
        current_price = row['Close']
        index += 1

        if prediction > current_price:
            print(f"Prediction for {option} is higher than current price. Buying shares..., {prediction} > {current_price}")
            # Buy
            if cash > current_price:
                max_cash_to_invest = cash * max_cash_percentage_per_trade
                if max_cash_to_invest < current_price:
                    max_cash_to_invest = current_price

                shares_to_buy = min(int(max_cash_to_invest / current_price), int(cash / current_price))
                if shares_to_buy <= 0:
                    continue 

                shares_owned[option] += shares_to_buy
                cash -= shares_to_buy * current_price
        elif prediction < current_price:
            print(f"Prediction for {option} is lower than current price. Selling shares..., {prediction} < {current_price}")
            # Sell
            if shares_owned[option] > 0:
                cash += shares_owned[option] * current_price
                shares_owned[option] = 0

    get_request(dict(cash=cash, shares_owned=json.dumps(shares_owned)), auth_token, TRADE_ENDPOINT_URL)

    return cash, shares_owned
