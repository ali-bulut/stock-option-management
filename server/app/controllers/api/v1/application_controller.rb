class Api::V1::ApplicationController < ApplicationController
  include TokenAuthenticatableConcern

  before_action :authenticate_request!

  protected

  def current_user
    @current_user
  end

  private

  def set_current_user
    @current_user ||= User.find_by(id: auth_token_data['user_id'])
    render_error(I18n.t(:"api.v1.authentication.deny_action"), status: :unauthorized) if @current_user.nil?
  end

  # TODO: implement role management
  #def authorize_except_basic_user
  #  if current_user.basic?
  #    render_authorization_error
  #  end
  #end

  #def render_authorization_error
  #  user_type = current_user.user_type
  #  error_message = I18n.t(:"api.v1.authorization.deny_action", user_type: user_type.capitalize)
  #
  #  render_error([error_message], status: :forbidden, code: error_code)
  #end
end
