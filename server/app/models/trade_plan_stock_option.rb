class TradePlanStockOption < ActiveRecord::Base
  belongs_to :trade_plan
  belongs_to :stock_option
  has_one :user, through: :trade_plan

  validates_presence_of :trade_plan_id, :stock_option_id
  validates_uniqueness_of :stock_option_id, scope: :trade_plan_id
  validates_numericality_of :quantity, greater_than_or_equal_to: 0

  def self.by_symbol(symbol)
    joins(:stock_option).where(stock_options: { symbol: symbol }).first
  end

  def self.cash
    by_symbol("CASH")
  end

  def amount
    (stock_option.price * quantity).round
  end
end
