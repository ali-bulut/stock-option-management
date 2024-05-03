Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use ActionDispatch::Session::CookieStore, key: "_interslice_session"

Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  mount StripeEvent::Engine, at: '/stripe-webhooks'
  mount Sidekiq::Web => '/sidekiq'

  root to: redirect('/admin')

  namespace :api do
    namespace :v1 do
      resource :sessions, only: [:create]
      resource :users, only: [:show, :create, :update, :destroy]
      resources :stock_options, only: [:index]
      resources :trade_plans, only: [:index, :show, :create, :update, :destroy] do
        put :update_stock_options_quantity, on: :member
      end
      resource :stock_simulations, only: [:create] do
        post :trade, on: :collection
      end
      resource :payment_intents, only: [:create]
      resources :payment_methods, only: [:index]
    end
  end
end
