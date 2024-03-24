class Api::V1::StockSimulationsController < Api::V1::ApplicationController
  include RequestHelper

  def create
    response = http_post_request("#{ENV["ML_API_BASE_URL"]}/stock_simulations", body: create_params)

    if response
      render json: response, status: :ok
    else
      render_error('An error occurred while running stock simulation', status: :bad_request)
    end
  end

  private

  def create_params
    params.permit(:initial_amount)
  end
end
