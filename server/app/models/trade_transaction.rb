class TradeTransaction < ActiveRecord::Base
  belongs_to :trade_plan
  belongs_to :stock_option

  enum action: { buy: 0, sell: 1 }

  validates_presence_of :price, :quantity, :action, :trade_plan_id, :stock_option_id
  validates_numericality_of :quantity, greater_than: 0

  scope :sort_by_created_at, -> { order(created_at: :desc) }
  scope :by_stock_option, ->(stock_option_id) { where(stock_option_id: stock_option_id) }

  def amount
    price * quantity
  end
end
