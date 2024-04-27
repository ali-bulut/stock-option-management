class AddPartialBuyToStockOptions < ActiveRecord::Migration[7.0]
  def change
    add_column :stock_options, :partial_buy, :boolean, default: false, null: false
  end
end
