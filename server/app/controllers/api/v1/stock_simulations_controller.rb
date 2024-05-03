class Api::V1::StockSimulationsController < Api::V1::ApplicationController
  include RequestHelper

  def trade
    transactions = JSON.parse(params[:transactions]).to_h.with_indifferent_access

    ActionCable.server.broadcast("stock_simulation_channel_#{current_user.id}",
                                 { type: "periodic", transactions: transactions, date: params[:date] })

    if params[:end].present? && params[:end] == "True"
      result = JSON.parse(params[:result]).to_h.with_indifferent_access
      ActionCable.server.broadcast("stock_simulation_channel_#{current_user.id}",
                                   { type: "end", result: result })
    end
  end

  def create
    http_post_request("#{ENV["ML_API_BASE_URL"]}/stock_simulations",
                      body: create_params.merge({ auth_token: auth_token }))

    render json: { success: true }, status: :ok
  end

  private

  def create_params
    params.permit(:initial_amount, stock_options: [])
  end
end
