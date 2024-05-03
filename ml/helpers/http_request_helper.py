import os
import requests

SIMULATION_ENDPOINT_URL = "/api/v1/stock_simulations"
TRADE_ENDPOINT_URL = "/api/v1/trade_plans"

def get_request(params, auth_token, url=SIMULATION_ENDPOINT_URL):
    response = requests.get(os.environ.get("API_BASE_URL") + url, params=params, headers={ "Authorization": f"Bearer {auth_token}" })
    return response.status_code == 200

def post_request(data, auth_token=None, url=SIMULATION_ENDPOINT_URL):
    response = requests.post(os.environ.get("API_BASE_URL") + url + "/trade", data=data, headers={ "Authorization": f"Bearer {auth_token}" })
    return response.status_code == 200

def put_request(data, auth_token=None, url=TRADE_ENDPOINT_URL):
    response = requests.put(os.environ.get("API_BASE_URL") + url + "/" + str(data['trade_plan_id']) + "/update_stock_options_quantity", data=data, headers={ "Authorization": f"Bearer {auth_token}" })
    return response.status_code == 200
