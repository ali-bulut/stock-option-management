module MoneyFormatHelper
  module_function

  def to_cents(amount)
    (amount.to_f * 100).round
  end
end
