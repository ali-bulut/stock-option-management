import json
import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression
from helpers.technical_analysis_helper import calculate_moving_average, calculate_rsi
from helpers.date_helper import get_date
from helpers.http_request_helper import put_request

def trade(trade_plan_id, stock_options):
    for stock_option in stock_options:
        stock_option["quantity"] = float(stock_option["quantity"])

    cash = float(list(filter(lambda p: p["stock_option_symbol"] == "CASH", stock_options))[0]["quantity"] / 100)
    if cash > 100:
        max_cash_percentage_per_trade = 0.1
    else:
        max_cash_percentage_per_trade = 1

    stock_options = list(filter(lambda p: p["stock_option_symbol"] != "CASH", stock_options))

    # Collect historical data for training (from 2018-01-01 to NOW) and train the model
    training_data = pd.DataFrame()
    for option in stock_options:
        stock_data = yf.download(option["stock_option_symbol"], start="2018-01-01", end=get_date(1))
        stock_data['Symbol'] = option["stock_option_symbol"]  # Add symbol as a column for identification
        stock_data.dropna(inplace=True)
        training_data = pd.concat([training_data, stock_data])

    # Data preprocessing for training
    training_data['MA_20'] = calculate_moving_average(training_data.groupby('Symbol')['Close'], 20)
    training_data['MA_50'] = calculate_moving_average(training_data.groupby('Symbol')['Close'], 50)
    training_data['MA_100'] = calculate_moving_average(training_data.groupby('Symbol')['Close'], 100)
    training_data['RSI'] = calculate_rsi(training_data.groupby('Symbol')['Close'])

    # Drop NaN values after preprocessing
    training_data.dropna(inplace=True)

    # Model training
    X_train = training_data[['MA_20', 'MA_50', 'MA_100', 'RSI']]
    y_train = training_data['Close']

    model = LinearRegression()
    model.fit(X_train, y_train)

    forecast_data = training_data
    X_forecast = forecast_data[['MA_20', 'MA_50', 'MA_100', 'RSI']]
    todays_forecast = X_forecast.filter(like=str(get_date()), axis=0)
    
    if todays_forecast.empty:
        return cash, stock_options

    predictions = model.predict(todays_forecast) # Get today's predictions

    index = 0
    for i, option in enumerate(stock_options):
        data_for_option = forecast_data[forecast_data['Symbol'] == option["stock_option_symbol"]]
        row = data_for_option.filter(like=str(get_date()), axis=0)
        if row.empty:
            continue
        
        row = row.iloc[0]

        prediction = predictions[index]
        current_price = row['Close']
        index += 1

        if prediction > current_price * 1.01 or prediction > current_price * 0.99:
            # Partial Buy for Coins
            if stock_options[i]["partial_buy"] == True:
                max_cash_to_invest = cash * max_cash_percentage_per_trade
                shares_to_buy = max_cash_to_invest / current_price
                if shares_to_buy <= 0:
                    continue
            else: # Full Buy for Regular Stocks
                if cash > current_price:
                    max_cash_to_invest = cash * max_cash_percentage_per_trade
                    if max_cash_to_invest < current_price:
                        max_cash_to_invest = current_price

                    shares_to_buy = min(int(max_cash_to_invest / current_price), int(cash / current_price))
                    if shares_to_buy <= 0:
                        continue 

            stock_options[i]["quantity"] += shares_to_buy
            cash -= shares_to_buy * current_price
        elif prediction < current_price * 0.99 or prediction < current_price * 1.01:
            # Sell
            if stock_options[i]["quantity"] > 0:
                cash += stock_options[i]["quantity"] * current_price
                stock_options[i]["quantity"] = 0

    stock_options.append({ "stock_option_symbol": "CASH", "quantity": int(cash * 100) })
    put_request(dict(trade_plan_id=trade_plan_id, stock_options=json.dumps(stock_options)))

    return cash, stock_options
