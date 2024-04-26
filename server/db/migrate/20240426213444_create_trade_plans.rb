class CreateTradePlans < ActiveRecord::Migration[7.0]
  def change
    create_table :trade_plans do |t|
      t.string :name, null: false
      t.text :description
      t.integer :amount, null: false
      t.boolean :active, default: true, null: false

      t.references :user, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
