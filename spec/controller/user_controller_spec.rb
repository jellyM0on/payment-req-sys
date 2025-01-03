require "rails_helper"

RSpec.describe "User Controller", type: :request do
  let! (:employee_user) { create(:user, department: "technical") }
  let! (:manager_user) { employee_user.manager }
  let! (:admin_user) { create(:user, role: "admin", department: "hr_admin") }
  let! (:total_users) { 3 }

  describe "GET /users" do
    context "when user does not have an admin role" do
      it "responds with an unauthorized status" do
        [ employee_user, manager_user ].each do |user|
          post "/users/sign_in", params: { email: user.email, password: "password" }
          get "/users"

          expect(response.status).to eq(401), "Failed: #{user.role}"

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["error"]).to eq("Not authorized")
        end
      end
    end

    context "when user has an admin role" do
      before do
        post "/users/sign_in", params: { email: admin_user.email, password: "password" }
        get "/users"
      end

      it "responds with users and pagination_meta" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res).to include("users", "pagination_meta")
        expect(parsed_res["users"]).to be_an(Array)
      end


      it "responds with all users" do
        parsed_res = JSON.parse(response.body)
        expect(parsed_res["users"].size).to eq(total_users)
      end
    end
  end

  describe "GET /users/:id" do
    context "when user does not have an admin role" do
      it "responds with an unauthorized status" do
        [ employee_user, manager_user ].each do |user|
          post "/users/sign_in", params: { email: user.email, password: "password" }
          get "/users/1"

          expect(response.status).to eq(401), "Failed: #{user.role}"

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["error"]).to eq("Not authorized")
        end
      end
    end
    context "when user has an admin role" do
      before do
        post "/users/sign_in", params: { email: admin_user.email, password: "password" }
        get "/users/#{employee_user.id}"
      end
      it "responds with user information" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["id"]).to eq(employee_user.id)
      end
    end
  end

  describe "UPDATE /users/:id" do
    context "when user does not have an admin role" do
      it "responds with an unauthorized status" do
        [ employee_user, manager_user ].each do |user|
          post "/users/sign_in", params: { email: user.email, password: "password" }
          put "/users/#{employee_user.id}",
          params: { role: "manager" }.to_json,
          headers: { "CONTENT_TYPE" => "application/json" }

          expect(response.status).to eq(401), "Failed: #{user.role}"

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["error"]).to eq("Not authorized")
        end
      end
    end

    context "when user has an admin role" do
      before do
        post "/users/sign_in", params: { email: admin_user.email, password: "password" }
      end

      it "responds with the updated user if request is valid" do
        new_manager_user = create(:user, role: "manager", department: "technical")

        put "/users/#{employee_user.id}",
        params: { role: "employee", manager_id: new_manager_user.id.to_i }.to_json,
        headers: { "CONTENT_TYPE" => "application/json" }

        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["id"]).to eq(employee_user.id)
      end

      it "responds with a bad request if request is not valid" do
        put "/users/#{employee_user.id}",
        params: { role: "employee", manager_id: 0 }.to_json,
        headers: { "CONTENT_TYPE" => "application/json" }

        expect(response.status).to eq(400)
      end
    end
  end

  describe "GET /managers" do
    context "when user does not have an admin role" do
      it "responds with an unauthorized status" do
        [ employee_user, manager_user ].each do |user|
          post "/users/sign_in", params: { email: user.email, password: "password" }
          get "/managers"

          expect(response.status).to eq(401), "Failed: #{user.role}"

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["error"]).to eq("Not authorized")
        end
      end
    end

    context "when user has an admin role" do
      before do
        post "/users/sign_in", params: { email: admin_user.email, password: "password" }
        get "/managers"
      end

      it "responds with managers and pagination_meta" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res).to include("managers", "pagination_meta")
        expect(parsed_res["managers"]).to be_an(Array)
      end

      it "responds with all managers" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["managers"].size).to eq(1)
      end
    end
  end
end
