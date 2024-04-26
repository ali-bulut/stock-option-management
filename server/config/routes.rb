Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use ActionDispatch::Session::CookieStore, key: "_interslice_session"

Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/', as: 'rails_admin'
  mount StripeEvent::Engine, at: '/stripe-webhooks'
  mount Sidekiq::Web => '/sidekiq'

  namespace :api do
    namespace :v1 do
      resource :sessions, only: [:create]
      resource :users, only: [:show, :create, :update, :destroy]
      resources :stock_options, only: [:index]
      resource :stock_simulations, only: [:create, :show]
      resource :payment_intents, only: [:create]
      resources :payment_methods, only: [:index]
    end
  end
end
