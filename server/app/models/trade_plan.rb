class TradePlan < ActiveRecord::Base
  belongs_to :user
  has_many :trade_plan_stock_options, dependent: :destroy
  has_many :stock_options, through: :trade_plan_stock_options

  validates_presence_of :name, :amount, :user_id

  scope :active, -> { where(active: true) }

  attr_accessor :stock_option_ids

  after_save :deduct_amount_from_user, if: -> { saved_change_to_amount? }
  after_destroy :transfer_amount_to_user

  after_save :set_stock_options!

  private

  def transfer_amount_to_user(amount = self.amount)
    unless user.transfer_amount(amount)
      errors.merge!(user.errors)
      raise ActiveRecord::RecordInvalid.new(self)
    end
  end

  def deduct_amount_from_user
    changed_amount = (amount_before_last_save || 0) - amount
    transfer_amount_to_user(changed_amount)
  end

  def set_stock_options!
    return unless stock_option_ids.present?

    TradePlanStockOption.transaction do
      stock_option_ids.each do |stock_option_id|
        unless trade_plan_stock_options.exists?(stock_option_id: stock_option_id)
          trade_plan_stock_options.create!(stock_option_id: stock_option_id)
        end
      end

      trade_plan_stock_options.where.not(stock_option_id: stock_option_ids).map(&:destroy!)
    end
  end
end
