class User < ActiveRecord::Base
  include RailsAdmin::Configs::User

  has_secure_password

  has_many :trade_plans, dependent: :destroy

  validates_presence_of :name, :email
  validates_uniqueness_of :email
  validates :balance_in_cents, numericality: { greater_than_or_equal_to: 0, message: 'is insufficient' }

  before_create :set_stripe_customer_id

  def transfer_amount(amount)
    self.update(balance_in_cents: self.balance_in_cents + amount)
  end

  private

  def set_stripe_customer_id
    self.stripe_customer_id = Stripe::Customer.create(email: self.email).id
  end
end
