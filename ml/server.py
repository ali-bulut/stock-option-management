from flask import Flask, request
from helpers.simulation import simulation_result
from helpers.tickers import retrieve_tickers

app = Flask(__name__)

@app.route('/stock_simulations', methods=['POST'])
def stock_simulations():
    tickers = request.get_json().get('tickers')
    initial_amount = request.get_json().get('initial_amount')

    return simulation_result(initial_amount, tickers)

@app.route('/tickers', methods=['GET'])
def tickers():
    search_param = request.args.get('search')
    if search_param is None:
        search_param = ''

    return retrieve_tickers(search_param)
 
if __name__ == '__main__':
    app.run(port=8000, debug=True)
