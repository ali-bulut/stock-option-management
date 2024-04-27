class AddQuantityToTradePlanStockOption < ActiveRecord::Migration[7.0]
  def change
    add_column :trade_plan_stock_options, :quantity, :integer, default: 0, null: false
  end
end
