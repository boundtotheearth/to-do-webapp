Rails.application.routes.draw do
  root 'homepage#index'

  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'
  
  resources :users, only: [:create, :show, :index]

  namespace :api do
    namespace :v1 do
      resources :to_do
      get '/tag_list', to: 'to_do#get_tags'
    end
  end

  get '/*path' => 'homepage#index'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
