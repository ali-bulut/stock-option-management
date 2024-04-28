module MoneyFormatHelper
  module_function

  def to_cents(amount)
    (amount.to_f * 100).round
  end

  def from_cents(amount)
    (amount.to_f / 100).round(2)
  end

  def to_currency(amount)
    ActionController::Base.helpers.number_to_currency(from_cents(amount))
  end
end
