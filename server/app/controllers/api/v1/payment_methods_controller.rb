class Api::V1::PaymentMethodsController < Api::V1::ApplicationController
  def index
    data = Stripe::PaymentMethod.list({ customer: current_user.stripe_customer_id }).data
    render json: data, status: :ok
  end
end
