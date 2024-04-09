from flask import Flask, request
from multiprocessing import Process
from helpers.simulation import simulation_result
from helpers.tickers import retrieve_tickers
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()

@app.route('/stock_simulations', methods=['POST'])
def stock_simulations():
    tickers = request.get_json().get('tickers')
    initial_amount = request.get_json().get('initial_amount')
    auth_token = request.get_json().get('auth_token')

    p = Process(target=simulation_result, args=(initial_amount, tickers, auth_token))
    p.daemon = True
    p.start()

    return { 'message': 'Simulation started' }

@app.route('/tickers', methods=['GET'])
def tickers():
    search_param = request.args.get('search')
    if search_param is None:
        search_param = ''

    return retrieve_tickers(search_param)
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 33507)))
