class TradePlanJob < ApplicationJob
  include RequestHelper
  queue_as :default

  def perform
    TradePlan.active.find_each do |trade_plan|
      stock_options = trade_plan.trade_plan_stock_options.available_for_trade.map do |trade_plan_stock_option|
        {
          stock_option_symbol: trade_plan_stock_option.stock_option.symbol,
          quantity: trade_plan_stock_option.quantity,
          partial_buy: trade_plan_stock_option.stock_option.partial_buy
        }
      end

      http_post_request("#{ENV["ML_API_BASE_URL"]}/stock_trades",
                        body: { trade_plan_id: trade_plan.id, stock_options: stock_options })
    end
  end
end
