require "rails_helper"

RSpec.describe "User Routes", type: :routing do
  it "routes GET /users to users#index" do
    expect(get: "/users").to route_to("users#index")
  end

  it "routes GET /users/:id to users#show" do
    expect(get: "/users/1").to route_to(controller: "users", action: "show", id: "1")
  end

  it "routes GET /managers to users#index_managers" do
    expect(get: "/managers").to route_to("users#index_managers")
  end

  it "routes PUT /users/:id to users#update" do
    expect(put: "/users/1").to route_to(controller: "users", action: "update", id: "1")
  end
end
