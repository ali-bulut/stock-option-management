class V1::UserSerializer < V1::ApplicationSerializer
  identifier :id
  fields :name, :email, :stripe_customer_id, :balance_in_cents

  field :token do |_, options|
    options[:token]
  end
end