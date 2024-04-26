class CreateStockOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :stock_options do |t|
      t.string :symbol, null: false
      t.string :name, null: false
    end

    add_index :stock_options, :symbol, unique: true
  end
end
