class AddNotifyToTradePlans < ActiveRecord::Migration[7.0]
  def change
    add_column :trade_plans, :notify, :boolean, default: false, null: false
  end
end
