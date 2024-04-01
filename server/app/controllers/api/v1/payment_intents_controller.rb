class Api::V1::PaymentIntentsController < Api::V1::ApplicationController
  def create
    begin
      intent = Stripe::PaymentIntent.create({ customer: current_user.stripe_customer_id,
                                              amount: MoneyFormatHelper.to_cents(create_params[:amount]),
                                              currency: 'usd' })

      render json: { client_secret: intent.client_secret }, status: :created
    rescue Stripe::StripeError => e
      render_error(e.message, status: :unprocessable_entity)
    end
  end

  private

  def create_params
    params.permit(:amount)
  end
end
