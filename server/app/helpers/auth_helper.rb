module AuthHelper
  module_function

  def generate_auth_token(user)
    data = { scope: User.name.downcase, user_id: user.id, env: Rails.env, created_at: Time.now }
    JWT.encode(data, ENV['SECRET_KEY_BASE'], 'HS256')
  end
end
