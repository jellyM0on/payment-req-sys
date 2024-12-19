require 'rails_helper'

RSpec.describe 'Request Routes', type: :routing do
  it 'routes GET /requests to requests#index' do
    expect(get: '/requests').to route_to('requests#index')
  end

  it 'routes GET /requests/:id to requests#show' do
    expect(get: '/requests/1').to route_to(controller: 'requests', action: 'show', id: '1')
  end

  it 'routes GET /requests/edit/:id to requests#show_edit' do
    expect(get: '/requests/edit/1').to route_to(controller: 'requests', action: 'show_edit', id: '1')
  end

  it 'routes POST /requests to requests#create' do
    expect(post: '/requests').to route_to(controller: 'requests', action: 'create')
  end

  it 'routes PUT /requests to requests#update' do
    expect(put: '/requests/1').to route_to(controller: 'requests', action: 'update', id: '1')
  end
end
