class StockOption < ActiveRecord::Base
  validates_presence_of :symbol, :name
  validates_uniqueness_of :symbol

  scope :search, -> (value) { where(arel_table[:symbol].matches("%#{value}%"))
                                .or(where(arel_table[:name].matches("%#{value}%"))) }
end
