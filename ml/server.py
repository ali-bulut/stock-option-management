from flask import Flask, request
from multiprocessing import Process
from helpers.simulation_helper import simulate
from helpers.trade_helper import trade
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()

@app.route('/stock_simulations', methods=['POST'])
def stock_simulations():
    stock_options = request.get_json().get('stock_options')
    initial_amount = request.get_json().get('initial_amount')
    auth_token = request.get_json().get('auth_token')

    p = Process(target=simulate, args=(initial_amount, stock_options, auth_token))
    p.daemon = True
    p.start()

    return { 'message': 'Simulation started' }


@app.route('/stock_trades', methods=['POST'])
def stock_trades():
    options = request.get_json().get('options')
    cash = request.get_json().get('cash')
    shares_owned = request.get_json().get('shares_owned') # { "AAPL": 10, "AMZN": 5 }
    auth_token = request.get_json().get('auth_token')

    p = Process(target=trade, args=(cash, options, shares_owned, auth_token))
    p.daemon = True
    p.start()

    return { 'message': 'Trade started' }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 33507)))
