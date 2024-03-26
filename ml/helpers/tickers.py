import csv

def retrieve_tickers(search_param):
    tickers = []
    with open('data/tickers.csv') as file:
        reader = csv.reader(file, delimiter=',')
        for row in reader:
            if row[4] == 'USD' or row[4] == 'TRY':
                tickers.append(row[0])

    tickers = [ticker for ticker in tickers if search_param.lower() in ticker.lower()]
    return tickers
