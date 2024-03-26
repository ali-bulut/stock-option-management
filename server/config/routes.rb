Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :sessions, only: [:create]
      resource :users, only: [:show, :create, :update, :destroy]
      resource :stock_simulations, only: [:create]
      resources :tickers, only: [:index]
      #resources :users, only: [:index, :update, :destroy] # TODO: role management
    end
  end
end
