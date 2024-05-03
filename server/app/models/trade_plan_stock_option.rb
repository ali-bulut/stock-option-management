class TradePlanStockOption < ActiveRecord::Base
  belongs_to :trade_plan
  belongs_to :stock_option
  has_one :user, through: :trade_plan

  validates_presence_of :trade_plan_id, :stock_option_id
  validates_uniqueness_of :stock_option_id, scope: :trade_plan_id
  validates_numericality_of :quantity, greater_than_or_equal_to: 0

  delegate :symbol, to: :stock_option

  scope :available_for_trade, -> do
    is_market_open = Time.current.in_time_zone("America/New_York").hour.between?(10, 16)
    is_market_open ? all : joins(:stock_option).where(stock_options: { partial_buy: true })
                                               .or(where(stock_option_id: StockOption.cash.id))
  end

  scope :order_by_quantity, -> { order(quantity: :desc) }
  scope :exclude_cash, -> { where.not(stock_option_id: StockOption.cash.id) }

  def self.by_symbol(symbol)
    joins(:stock_option).where(stock_options: { symbol: symbol }).first
  end

  def self.cash
    by_symbol("CASH")
  end

  def amount
    (stock_option.price * quantity).round
  end

  def transactions
    trade_plan.transactions.by_stock_option(stock_option_id)
  end

  def cost
    return nil if quantity.zero? || transactions.empty?

    buy_actions = transactions.buy.sum(&:amount)
    sell_actions = transactions.sell.sum(&:amount)
    (buy_actions - sell_actions) / quantity
  end
end
