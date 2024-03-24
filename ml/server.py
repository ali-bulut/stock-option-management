from flask import Flask, request
from simulation import simulation_result

app = Flask(__name__)

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
