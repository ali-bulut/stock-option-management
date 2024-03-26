import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression

def calculate_moving_average(data, window):
    return data.transform(lambda x: x.rolling(window=window).mean())

def calculate_rsi(data):
    delta = data.diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = (-delta).where(delta < 0, 0).rolling(window=14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))

    return rsi

def simulation_result(initial_amount, options):
    if initial_amount is None:
        initial_amount = 10000
    else:
        initial_amount = float(initial_amount)

    max_cash_percentage_per_trade = 0.1  # Example: 10% of available cash

    # Step 1: Define the available stock options
    if options is None or not options:
        options = ['NVDA', 'AAPL', 'GOOGL', 'AMZN', 'TSLA']

    # Step 3: Initialize cash, shares owned, and transaction history for each option
    cash = initial_amount
    shares_owned = {option: 0 for option in options}
    transaction_history = []

    # Step 4: Collect historical data for training (from 2018-01-01 to 2022-01-01) and train the model
    training_data = pd.DataFrame()
    for option in options:
        stock_data = yf.download(option, start="2018-01-01", end="2022-01-01")
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

    # Step 5: Collect data for forecasting (year 2023) and make predictions
    forecast_data = pd.DataFrame()
    for option in options:
        stock_data = yf.download(option, start="2022-04-01", end="2023-12-31")
        stock_data['Symbol'] = option  # Add symbol as a column for identification
        stock_data.dropna(inplace=True)
        forecast_data = pd.concat([forecast_data, stock_data])

    # Data preprocessing for forecasting
    forecast_data['MA_50'] = calculate_moving_average(forecast_data.groupby('Symbol')['Close'], 50)
    forecast_data['MA_200'] = calculate_moving_average(forecast_data.groupby('Symbol')['Close'], 200)
    forecast_data['RSI'] = calculate_rsi(forecast_data.groupby('Symbol')['Close'])

    # Drop NaN values after preprocessing
    forecast_data.dropna(inplace=True)

    # Make predictions for 2023 using the trained model
    X_forecast = forecast_data[['MA_50', 'MA_200', 'RSI']]
    predictions = model.predict(X_forecast)

    # Simulate trading and calculate final portfolio value
    for i, option in enumerate(options):
        data_for_option = forecast_data[forecast_data['Symbol'] == option]
        prediction_for_option = predictions[i * len(data_for_option):(i + 1) * len(data_for_option)]

        for j, (_, row) in enumerate(data_for_option.iterrows()):
            prediction = prediction_for_option[j]
            current_price = row['Close']
            date = row.name

            if prediction > current_price:
                # Buy
                if cash > current_price:
                    max_cash_to_invest = cash * max_cash_percentage_per_trade
                    shares_to_buy = min(int(max_cash_to_invest / current_price), int(cash / current_price))
                    if shares_to_buy <= 0:
                        continue 

                    shares_owned[option] += shares_to_buy
                    cash -= shares_to_buy * current_price
                    transaction_history.append((date, 'Buy', option, shares_to_buy, current_price))
            elif prediction < current_price:
                # Sell
                if shares_owned[option] > 0:
                    cash += shares_owned[option] * current_price
                    transaction_history.append((date, 'Sell', option, shares_owned[option], current_price))
                    shares_owned[option] = 0

    start_date = forecast_data.index[0]
    end_date = forecast_data.index[-1]

    # Sell all remaining options at the end of the simulation
    for option, shares in shares_owned.items():
        if shares > 0:
            current_price = forecast_data[forecast_data['Symbol'] == option].iloc[-1]['Close']
            cash += shares * current_price
            transaction_history.append((end_date, 'Sell', option, shares, current_price))
            shares_owned[option] = 0

    transaction_history = sorted(transaction_history, key=lambda x: x[0])

    # Calculate total return
    final_portfolio_value = cash
    total_return = (final_portfolio_value - initial_amount) / initial_amount

    return {
        "transaction_history": transaction_history,
        "initial_amount": initial_amount,
        "final_portfolio_value": final_portfolio_value,
        "total_return": total_return,
        "start_date": start_date,
        "end_date": end_date,
        "options_used": list(set(transaction[2] for transaction in transaction_history))
    }
