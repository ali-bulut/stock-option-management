RailsAdmin.config do |config|
  config.asset_source = :sprockets
  config.main_app_name = ['Stock Option Management', '']

  config.authorize_with do
    authenticate_or_request_with_http_basic('Login required') do |username, password|
      username == ENV.fetch('RAILS_ADMIN_USERNAME') &&
        password == ENV.fetch('RAILS_ADMIN_PASSWORD')
    end
  end

  config.actions do
    dashboard
    index
    new
    export
    show
    edit
    delete
  end
end
