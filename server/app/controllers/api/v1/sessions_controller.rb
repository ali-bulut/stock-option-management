class Api::V1::SessionsController < Api::V1::ApplicationController
  include AuthHelper

  skip_before_action :authenticate_request!
  before_action :set_user, only: :create

  def create
    if @user.authenticate(params[:password])
      render json: V1::UserSerializer.render(@user, token: generate_auth_token(@user)), status: :ok
    else
      render_error('Invalid email or password', status: :unauthorized)
    end
  end

  private

  def set_user
    @user = User.find_by!(email: params[:email])
  end
end
