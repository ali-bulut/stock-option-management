class Api::V1::TickersController < Api::V1::ApplicationController
  include RequestHelper

  def index
    response = http_get_request("#{ENV["ML_API_BASE_URL"]}/tickers", query_params: index_params)

    if response
      render json: response, status: :ok
    else
      render_error(I18n.t(:"api.v1.tickers.failure"), status: :bad_request)
    end
  end

  private

  def index_params
    params.permit(:search)
  end
end
