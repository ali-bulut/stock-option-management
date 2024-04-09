# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

list = %w[localhost:3000 localhost:3001 stock-management-client-18d9a86897cc.herokuapp.com stockmng.com www.stockmng.com]

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins list
    resource '*', headers: :any, methods: [:get, :post, :patch, :put, :delete], credentials: true
  end
end
