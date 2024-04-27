class ChangeAmountToInitialAmountInTradePlans < ActiveRecord::Migration[7.0]
  def change
    rename_column :trade_plans, :amount, :initial_amount
  end
end
