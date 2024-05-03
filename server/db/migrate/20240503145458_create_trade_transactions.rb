class CreateTradeTransactions < ActiveRecord::Migration[7.0]
  def change
    create_table :trade_transactions do |t|
      t.integer :price, null: false
      t.decimal :quantity, precision: 30, scale: 15, null: false
      t.integer :action, null: false

      t.references :trade_plan, null: false, foreign_key: true
      t.references :stock_option, null: false, foreign_key: true

      t.timestamps
    end
  end
end
