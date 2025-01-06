require "rails_helper"

RSpec.describe "User Registration Controller", type: :request do
  let! (:employee_user) { create(:user, department: "technical") }
  let! (:manager_user) { employee_user.manager }
  let! (:admin_user) { create(:user, role: "admin", department: "hr_admin") }

  describe "POST /users" do
    context "when user does not have an admin role" do
      it "responds with unauthorized status" do
        [ employee_user, manager_user ].each do |user|
          post "/users/sign_in", params: { email: user.email, password: "password" }
          post "/users", params: {
            name: "test",
            position: "test",
            role: "employee",
            password: "password",
            password_confirmation: "password",
            department: "technical",
            email: "test@mail.com",
            manager_id: manager_user.id
          }

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
      context "when request is valid" do
        before do
          post "/users", params: {
            name: "test",
            position: "test",
            role: "employee",
            password: "password",
            password_confirmation: "password",
            department: "technical",
            email: "test@mail.com",
            manager_id: manager_user.id
          }
        end
        it "responds with the created user" do
          expect(response.status).to eq(201)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["email"]).to eq("test@mail.com")
        end
        it "creates a new user" do
          get "/users"

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["users"]).to include(a_hash_including("email" => "test@mail.com"))
        end
      end

      context "when request is invalid" do
        it "responds with a bad request if it has missing required fields" do
          post "/users", params: {
            position: "test",
            role: "employee",
            password: "password",
            password_confirmation: "password",
            department: "technical",
            email: "test@mail.com",
            manager_id: manager_user.id
          }

          expect(response.status).to eq(400)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res).to include(a_hash_including("error"))
        end
        it "responds with a bad request if it has invalid fields" do
          post "/users", params: {
            name: "test",
            position: "test",
            role: "employee",
            password: "password",
            password_confirmation: "invalid_confirm",
            department: "technical",
            email: "test@mail.com",
            manager_id: manager_user.id
          }

          expect(response.status).to eq(400)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res).to include(a_hash_including("error"))
        end
      end
    end
  end
end
