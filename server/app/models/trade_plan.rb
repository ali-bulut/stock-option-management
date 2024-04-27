class TradePlan < ActiveRecord::Base
  belongs_to :user
  has_many :trade_plan_stock_options, dependent: :destroy
  has_many :stock_options, through: :trade_plan_stock_options

  validates_presence_of :name, :initial_amount, :user_id

  scope :active, -> { where(active: true) }

  attr_accessor :stock_option_ids

  after_create :deduct_amount_from_user
  after_destroy :transfer_amount_to_user

  after_commit :set_stock_options!

  def total_amount
    trade_plan_stock_options.sum(&:amount)
  end

  private

  def transfer_amount_to_user(amount = self.total_amount)
    unless user.transfer_amount(amount)
      errors.merge!(user.errors)
      raise ActiveRecord::RecordInvalid.new(self)
    end
  end

  def deduct_amount_from_user
    transfer_amount_to_user(-initial_amount)
  end

  def set_stock_options!
    return unless stock_option_ids.present?

    TradePlanStockOption.transaction do
      cash_id = StockOption.cash.id
      stock_option_ids = self.stock_option_ids + [cash_id]

      stock_option_ids.each do |stock_option_id|
        unless trade_plan_stock_options.exists?(stock_option_id: stock_option_id)
          quantity = stock_option_id == cash_id ? initial_amount : 0
          trade_plan_stock_options.create!(stock_option_id: stock_option_id, quantity: quantity)
        end
      end

      trade_plan_stock_options.where.not(stock_option_id: stock_option_ids).find_each do |trade_plan_stock_option|
        trade_plan_stock_options.cash.increment!(:quantity, trade_plan_stock_option.amount)
        trade_plan_stock_option.destroy!
      end
    end
  end
end
