class PaymentIntentHandler
  def call(event)
    method = "handle_#{event.type.tr('.', '_')}"
    send method, event
  rescue JSON::ParserError => e
    raise # re-raise the exception to return a 500 error to stripe
  rescue NoMethodError => e
    # Ignored
  end

  def handle_payment_intent_succeeded(event)
    payment_intent = event.data['object']

    user = User.find_by_stripe_customer_id(payment_intent.customer)
    return unless user.present?

    user.increment!(:balance_in_cents, payment_intent.amount)
  end
end
