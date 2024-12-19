require 'rails_helper'

RSpec.describe 'Authentication Routes', type: :routing do
  it 'routes GET /users/sign_in to users/sessions#new' do
    expect(get: '/users/sign_in').to route_to('users/sessions#new')
  end

  it 'routes POST /users/sign_in to users/sessions#create' do
    expect(post: '/users/sign_in').to route_to('users/sessions#create')
  end

  it 'routes DELETE /users/sign_out to users/sessions#destroy' do
    expect(delete: '/users/sign_out').to route_to('users/sessions#destroy')
  end

  it 'routes POST /users to users/registrations#create' do
    expect(post: '/users').to route_to('users/registrations#create')
  end
end
