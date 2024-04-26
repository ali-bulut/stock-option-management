class User < ActiveRecord::Base
  include RailsAdmin::Configs::User

  has_secure_password

  validates_presence_of :name, :email
  validates_uniqueness_of :email

  before_create :set_stripe_customer_id

  private

  def set_stripe_customer_id
    self.stripe_customer_id = Stripe::Customer.create(email: self.email).id
  end
end
