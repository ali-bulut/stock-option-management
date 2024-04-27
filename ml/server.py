from flask import Flask, request
from multiprocessing import Process
from helpers.simulation_helper import simulate
from helpers.trade_helper import trade
from helpers.stock_option_helper import get_stock_option_price
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
    trade_plan_id = request.get_json().get('trade_plan_id')
    stock_options = request.get_json().get('stock_options')

    p = Process(target=trade, args=(trade_plan_id, stock_options))
    p.daemon = True
    p.start()

    return { 'message': 'Trade started' }


@app.route('/stock_options', methods=['GET'])
def stock_options():
    symbol = request.args.get('symbol')
    if symbol is None:
        return { 'message': 'No symbol parameter provided' }

    return { 'price': get_stock_option_price(symbol) }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 33507)))
