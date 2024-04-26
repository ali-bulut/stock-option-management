class Api::V1::StockOptionsController < Api::V1::ApplicationController
  include RequestHelper

  def index
    stock_options = StockOption.search(index_params[:search])
    render json: V1::StockOptionSerializer.render(stock_options), status: :ok
  end

  private

  def index_params
    params.permit(:search)
  end
end
