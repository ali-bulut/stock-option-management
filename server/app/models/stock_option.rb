class StockOption < ActiveRecord::Base
  include RequestHelper

  validates_presence_of :symbol, :name
  validates_uniqueness_of :symbol

  scope :exclude_cash, -> { where.not(symbol: "CASH") }
  scope :search, -> (value) { where(arel_table[:symbol].matches("%#{value}%"))
                                .or(where(arel_table[:name].matches("%#{value}%"))) }

  def self.cash
    find_by(symbol: "CASH")
  end

  def price
    return 1 if cash?

    response = http_get_request("#{ENV["ML_API_BASE_URL"]}/stock_options", query_params: { symbol: symbol })
    if response.present? && response
      MoneyFormatHelper.to_cents(JSON.parse(response)["price"])
    end
  end

  def cash?
    symbol == "CASH"
  end
end
