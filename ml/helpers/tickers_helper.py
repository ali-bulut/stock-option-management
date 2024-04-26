import csv

def retrieve_tickers(search_param):
    tickers = []
    with open('data/tickers.csv') as file:
        reader = csv.reader(file, delimiter=',')
        for row in reader:
            ticker = { "symbol": row[0], "name": row[1] }
            tickers.append(ticker)

    tickers = [ticker for ticker in tickers if search_param.lower() in ticker["symbol"].lower() or search_param.lower() in ticker["name"].lower()]
    return tickers
