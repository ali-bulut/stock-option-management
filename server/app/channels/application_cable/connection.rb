module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      if self.request.params['user_email'].present?
        @current_user = find_user(self.request.params['user_email'])
      end
    end

    private

    def find_user(user_email)
      current_user = User.find_by(email: user_email)
      if current_user
        current_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
