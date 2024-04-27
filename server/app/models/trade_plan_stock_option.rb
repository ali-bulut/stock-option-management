class TradePlanStockOption < ActiveRecord::Base
  belongs_to :trade_plan
  belongs_to :stock_option
  has_one :user, through: :trade_plan

  validates_presence_of :trade_plan_id, :stock_option_id
  validates_uniqueness_of :stock_option_id, scope: :trade_plan_id
  validates_numericality_of :quantity, greater_than_or_equal_to: 0

  scope :available_for_trade, -> do
    is_market_open = Time.current.in_time_zone("America/New_York").hour.between?(10, 16)
    is_market_open ? all : joins(:stock_option).where(stock_options: { partial_buy: true })
                                               .or(where(stock_option_id: StockOption.cash.id))
  end

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
