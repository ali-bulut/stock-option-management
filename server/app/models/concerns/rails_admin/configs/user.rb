module RailsAdmin::Configs::User
  extend ActiveSupport::Concern

  included do
    rails_admin do
      show do
        exclude_fields :password_digest, :stripe_customer_id
      end

      list do
        exclude_fields :password_digest, :stripe_customer_id
      end

      edit do
        exclude_fields :password_digest, :stripe_customer_id
      end
    end
  end
end
