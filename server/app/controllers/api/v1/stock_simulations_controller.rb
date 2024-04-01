class Api::V1::StockSimulationsController < Api::V1::ApplicationController
  include RequestHelper
  before_action :check_user_balance, only: :create

  def create
    response = http_post_request("#{ENV["ML_API_BASE_URL"]}/stock_simulations", body: create_params)

    if response
      update_user_balance!(response)
      render json: response, status: :ok
    else
      render_error(I18n.t(:"api.v1.stock_simulations.failure"), status: :bad_request)
    end
  end

  private

  def create_params
    params.permit(:initial_amount, tickers: [])
  end

  def check_user_balance
    if current_user.balance_in_cents < MoneyFormatHelper.to_cents(create_params[:initial_amount])
      render_error(I18n.t(:"api.v1.stock_simulations.insufficient_balance"), status: :bad_request)
    end
  end

  def update_user_balance!(response)
    data = JSON.parse(response).deep_symbolize_keys
    changed_amount = data[:final_portfolio_value] - data[:initial_amount]
    current_user.increment!(:balance_in_cents, MoneyFormatHelper.to_cents(changed_amount))
  end
end
