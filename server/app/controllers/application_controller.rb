class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  protected

  def render_error(errors, status: :bad_request)
    if errors.is_a?(ActiveModel::Errors)
      errors_info = errors.full_messages
    else
      errors_info = Array.wrap(errors)
    end

    render json: { errors: errors_info }, status: status
  end

  def record_not_found
    render_error(I18n.t(:"api.v1.not_found"), status: :not_found)
  end
end
