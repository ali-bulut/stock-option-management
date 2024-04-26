class CreateTradePlanStockOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :trade_plan_stock_options do |t|
      t.references :trade_plan, null: false, foreign_key: true, index: true
      t.references :stock_option, null: false, foreign_key: true, index: true
    end

    add_index :trade_plan_stock_options, [:trade_plan_id, :stock_option_id], unique: true, name: "index_on_trade_plan_id_and_stock_option_id"
  end
end
