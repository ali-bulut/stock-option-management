class Api::V1::StockSimulationsController < Api::V1::ApplicationController
  include RequestHelper
  before_action :check_user_balance, only: :create

  def show
    transactions = JSON.parse(params[:transactions]).to_h.with_indifferent_access

    ActionCable.server.broadcast("stock_simulation_channel_#{current_user.id}",
                                 { type: "periodic", transactions: transactions, date: params[:date] })

    if params[:end].present? && params[:end] == "True"
      update_user_balance!(transactions[:CASH][transactions[:CASH].keys.last][:total_price])

      result = JSON.parse(params[:result]).to_h.with_indifferent_access
      ActionCable.server.broadcast("stock_simulation_channel_#{current_user.id}",
                                   { type: "end", result: result })
    end
  end

  def create
    http_post_request("#{ENV["ML_API_BASE_URL"]}/stock_simulations",
                      body: create_params.merge({ auth_token: auth_token }))

    update_user_balance!(-create_params[:initial_amount])

    render json: { success: true }, status: :ok
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

  def update_user_balance!(changed_amount)
    current_user.increment!(:balance_in_cents, MoneyFormatHelper.to_cents(changed_amount))
  end
end
