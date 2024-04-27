class ChangeQuantityTypeOnTradePlanStockOption < ActiveRecord::Migration[7.0]
  def change
    change_column :trade_plan_stock_options, :quantity, :decimal, precision: 30, scale: 15
  end
end
