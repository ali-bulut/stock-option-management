from flask import Flask, request
import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

def simulation_result(initial_amount):
    # Step 1: Define the available stock options
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
        training_data = pd.concat([training_data, stock_data])

    # Data preprocessing for training
    training_data['MA_50'] = training_data.groupby('Symbol')['Close'].transform(lambda x: x.rolling(window=50).mean())
    training_data['MA_200'] = training_data.groupby('Symbol')['Close'].transform(lambda x: x.rolling(window=200).mean())

    delta = training_data.groupby('Symbol')['Close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = (-delta).where(delta < 0, 0).rolling(window=14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))

    training_data['RSI'] = rsi

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
        forecast_data = pd.concat([forecast_data, stock_data])

    # Data preprocessing for forecasting
    forecast_data['MA_50'] = forecast_data.groupby('Symbol')['Close'].transform(lambda x: x.rolling(window=50).mean())
    forecast_data['MA_200'] = forecast_data.groupby('Symbol')['Close'].transform(lambda x: x.rolling(window=200).mean())

    delta = forecast_data.groupby('Symbol')['Close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = (-delta).where(delta < 0, 0).rolling(window=14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))

    forecast_data['RSI'] = rsi

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
                    shares_to_buy = int(cash / current_price)
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
        "end_date": end_date
    }
 
@app.route('/stock_simulations', methods=['POST'])
def stock_simulations():
    initial_amount = request.get_json().get('initial_amount')
    if initial_amount is None:
        initial_amount = 10000
    else:
        initial_amount = float(initial_amount)

    return simulation_result(initial_amount)
 
if __name__ == '__main__':
    app.run(port=8000, debug=True)
