module TokenAuthenticatableConcern
  extend ActiveSupport::Concern

  included do
    private

    def auth_token
      token = request.headers['Authorization']
      token = token.split(' ').last if token.present?
      token
    end

    def decoded_auth_token(validate: false)
      JWT.decode(auth_token, ENV['SECRET_KEY_BASE'], validate, { algorithm: 'HS256' })
    end

    def auth_token_data
      decoded_auth_token[0]
    end

    def authenticate_request!
      unless request_has_valid_token?
        render_error(I18n.t(:"api.v1.authentication.deny_action"), status: :unauthorized)
        return
      end

      set_current_user
    end

    def request_has_valid_token?
      begin
        decoded_auth_token(validate: true)
        true
      rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
        false
      end
    end
  end
end
