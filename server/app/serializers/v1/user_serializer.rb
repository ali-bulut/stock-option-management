class V1::UserSerializer < V1::ApplicationSerializer
  identifier :id
  fields :name, :email

  field :token do |_, options|
    options[:token]
  end
end