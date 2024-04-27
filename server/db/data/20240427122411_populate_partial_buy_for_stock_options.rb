# frozen_string_literal: true

class PopulatePartialBuyForStockOptions < ActiveRecord::Migration[7.0]
  def up
    partial_buy_stock_options = ["BTC-USD", "ETH-USD", "BNB-USD", "SOL-USD", "XRP-USD"]
    StockOption.where(symbol: partial_buy_stock_options).update_all(partial_buy: true)
  end

  def down
    StockOption.update_all(partial_buy: false)
  end
end
