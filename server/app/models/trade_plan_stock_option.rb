class TradePlanStockOption < ActiveRecord::Base
  belongs_to :trade_plan
  belongs_to :stock_option

  validates_presence_of :trade_plan_id, :stock_option_id
  validates_uniqueness_of :stock_option_id, scope: :trade_plan_id
end
