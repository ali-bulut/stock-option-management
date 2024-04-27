import yfinance as yf

def get_stock_option_price(option):
    stock_option_data = yf.Ticker(option).history(period="1d")
    return stock_option_data["Close"][0]
