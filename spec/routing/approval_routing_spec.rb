require 'rails_helper'

RSpec.describe 'Approval Routes', type: :routing do
  it 'routes PUT /requests/:request_id/approvals/:id to approvals#index' do
    expect(put: '/requests/1/approvals/1').to route_to(controller: 'approvals', action: 'update', request_id: "1", id: '1')
  end
end
