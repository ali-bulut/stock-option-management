import yfinance as yf
import pandas as pd
import json
from sklearn.linear_model import LinearRegression
from helpers.technical_analysis_helper import calculate_moving_average, calculate_rsi
from helpers.http_request_helper import get_request

def simulate(initial_amount, options, auth_token):
    if initial_amount is None:
        initial_amount = 10000
    else:
        initial_amount = float(initial_amount)

    max_cash_percentage_per_trade = 0.1  # Example: 10% of available cash

    # Define the available stock options
    if options is None or not options:
        options = ["NVDA", "AAPL", "AMZN", "BTC-USD", "ETH-USD"]

    # Initialize cash, shares owned, and transaction history for each option
    cash = initial_amount
    shares_owned = {option: 0 for option in options}
    transaction_history = []

    # Collect historical data for training (from 2018-01-01 to 2023-01-01) and train the model
    training_data = pd.DataFrame()
    for option in options:
        stock_data = yf.download(option, start="2018-01-01", end="2023-01-01")
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

    # Collect data for forecasting (year 2023) and make predictions
    forecast_data = pd.DataFrame()
    for option in options:
        stock_data = yf.download(option, start="2023-01-04", end="2023-12-31")
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

    # Simulate trading for each day and calculate final portfolio value
    j = 0
    transactions = {"CASH": {}}
    for date in pd.date_range(start=forecast_data.index[0], end=forecast_data.index[-1]):
        skip_day = False

        if date.month not in transactions["CASH"]:
            transactions["CASH"][date.month] = {
                "total_price": cash,
                "total_shares": 0,
            }
        
        for i, option in enumerate(options):
            if option not in transactions:
                transactions[option] = {}
            if date.month not in transactions[option]:
                transactions[option][date.month] = {
                    "total_price": transactions[option][date.month - 1]["total_price"] if date.month > 1 else 0,
                    "total_shares": transactions[option][date.month - 1]["total_shares"] if date.month > 1 else 0
                }

            if i == 0:
                total_length = 0

            data_for_option = forecast_data[forecast_data['Symbol'] == option]
            row = data_for_option.filter(like=str(date), axis=0)
            if row.empty or skip_day:
                skip_day = True
                continue
            
            row = row.iloc[0]

            prediction_for_option = predictions[total_length:len(data_for_option) + total_length]
            prediction = prediction_for_option[j]
            current_price = row['Close']

            # Update total price for each transaction
            if date.month in transactions[option] and transactions[option][date.month]["total_shares"] > 0:
                transactions[option][date.month]["total_price"] = transactions[option][date.month]["total_shares"] * current_price

            if prediction > current_price:
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
                    transactions[option][date.month]["total_price"] += shares_to_buy * current_price
                    transactions[option][date.month]["total_shares"] += shares_to_buy
                    transactions["CASH"][date.month]["total_price"] = cash
                    transaction_history.append({ 'date': date.strftime('%Y-%m-%d %H:%M:%S'), 'action': 'BUY', 'ticker': option, 'amount_of_options': shares_to_buy, 'price': current_price, 'total_options': shares_owned[option], 'cash': cash })
            elif prediction < current_price:
                # Sell
                if shares_owned[option] > 0:
                    cash += shares_owned[option] * current_price
                    transactions[option][date.month]["total_price"] = 0
                    transactions[option][date.month]["total_shares"] = 0
                    transactions["CASH"][date.month]["total_price"] = cash
                    transaction_history.append({ 'date': date.strftime('%Y-%m-%d %H:%M:%S'), 'action': 'SELL', 'ticker': option, 'amount_of_options': shares_owned[option], 'price': current_price, 'total_options': 0, 'cash': cash })
                    shares_owned[option] = 0

            # Retrain the model after each iteration/day with most upto date data
            row_df = pd.DataFrame(row).transpose()
            training_data = pd.concat([training_data, row_df])
            X_train = training_data[['MA_50', 'MA_200', 'RSI']]
            y_train = training_data['Close']
            model.fit(X_train, y_train)

            # Make new predictions after retraining
            predictions = model.predict(X_forecast)

            total_length += len(data_for_option)
        
        if not skip_day:
            j += 1

        if j % 5 == 0:
            get_request(dict(transactions=json.dumps(transactions), date=date.strftime('%B %d, %Y')), auth_token)

    start_date = forecast_data.index[0]
    end_date = forecast_data.index[-1]

    # Sell all remaining options at the end of the simulation
    for option, shares in shares_owned.items():
        if shares > 0:
            current_price = forecast_data[forecast_data['Symbol'] == option].iloc[-1]['Close']
            cash += shares * current_price
            transactions[option][date.month]["total_price"] = 0
            transactions[option][date.month]["total_shares"] = 0
            transactions["CASH"][date.month]["total_price"] = cash
            transaction_history.append({ 'date': end_date.strftime('%Y-%m-%d %H:%M:%S'), 'action': 'SELL', 'ticker': option, 'amount_of_options': shares, 'price': current_price, 'total_options': 0, 'cash': cash })
            shares_owned[option] = 0

    # Calculate total return
    final_portfolio_value = cash
    total_return = (final_portfolio_value - initial_amount) / initial_amount

    result = {
        "initial_amount": initial_amount,
        "final_portfolio_value": final_portfolio_value,
        "total_return": total_return,
        "start_date": start_date.strftime('%Y-%m-%d %H:%M:%S'),
        "end_date": end_date.strftime('%Y-%m-%d %H:%M:%S'),
        "options_used": list(set(transaction['ticker'] for transaction in transaction_history)),
    }

    get_request(dict(transactions=json.dumps(transactions), result=json.dumps(result), end=True, date=date.strftime('%B %d, %Y')), auth_token)
    
    return result
