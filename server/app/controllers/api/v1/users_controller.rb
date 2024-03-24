class Api::V1::UsersController < Api::V1::ApplicationController
  include AuthHelper

  skip_before_action :authenticate_request!, only: :create

  def show
    render json: V1::UserSerializer.render(current_user), status: :ok
  end

  def create
    user = User.new(create_user_params)

    if user.save
      render json: V1::UserSerializer.render(user, token: generate_auth_token(user)), status: :ok
    else
      render_error(user.errors)
    end
  end

  def update
    if current_user.update(update_user_params)
      render json: V1::UserSerializer.render(current_user), status: :ok
    else
      render_error(current_user.errors)
    end
  end

  def destroy
    if current_user.destroy
      head :ok
    else
      render_error(current_user.errors)
    end
  end

  private

  def create_user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end

  def update_user_params
    params.permit(:name, :password, :password_confirmation)
  end
end
