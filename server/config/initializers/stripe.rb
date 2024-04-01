require 'payment_intent_handler'

Rails.configuration.stripe = {
  :publishable_key => ENV['STRIPE_PUBLISHABLE_KEY'],
  :secret_key => ENV['STRIPE_SECRET_KEY']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]

StripeEvent.signing_secrets = ENV['STRIPE_SIGNING_SECRET']&.split(',')
StripeEvent.configure do |events|
  events.subscribe 'payment_intent.', PaymentIntentHandler.new
end
