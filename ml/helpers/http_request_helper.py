import os
import requests

SIMULATION_ENDPOINT_URL = "/api/v1/stock_simulations"
TRADE_ENDPOINT_URL = "/api/v1/stock_trades"

def get_request(params, auth_token, url=SIMULATION_ENDPOINT_URL):
    response = requests.get(os.environ.get("API_BASE_URL") + url, params=params, headers={ "Authorization": f"Bearer {auth_token}" })
    return response.status_code == 200
