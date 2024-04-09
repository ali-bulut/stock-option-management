Rails.application.routes.draw do
  mount StripeEvent::Engine, at: '/stripe-webhooks'

  namespace :api do
    namespace :v1 do
      resource :sessions, only: [:create]
      resource :users, only: [:show, :create, :update, :destroy]
      resource :stock_simulations, only: [:create, :show]
      resources :tickers, only: [:index]
      resource :payment_intents, only: [:create]
      resources :payment_methods, only: [:index]
    end
  end
end
