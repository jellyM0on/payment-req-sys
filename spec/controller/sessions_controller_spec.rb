require "rails_helper"

RSpec.describe "User Sessions", type: :request do
  let (:user) { create(:user, department: "technical") }

  describe "GET /users/sign_in" do
    context "when user is not signed in" do
      before do
        get "/users/sign_in"
      end
      it "responds with false signed_in status" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["signed_in"]).to be false
      end
    end

    context "when user is signed in" do
      before do
        post "/users/sign_in", params: { email: user.email, password: "password" }
        get "/users/sign_in"
      end
      it "responds with user and true logged_in status" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["logged_in"]).to be true
        expect(parsed_res["user"]["id"]).to eq(user.id)
      end
    end
  end

  describe "POST /users/sign_in" do
    context "with valid credentials" do
      before do
        post "/users/sign_in", params: { email: user.email, password: "password" }
      end
      it "authenticates then responds with user and true signed_in status" do
        expect(response.status).to eq(201)
        expect(session[:user_id]).to eq(user.id)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["signed_in"]).to be true
        expect(parsed_res["user"]["id"]).to eq(user.id)
      end
    end

    context "with invalid credentials" do
      before do
        post "/users/sign_in", params: { email: "wrongmail@mail.com", password: "invalidpassword" }
      end
      it "responds with an unauthorized status and an error" do
        expect(response.status).to eq(401)
        expect(session[:user_id]).to be_nil

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["error"]).to eq("Invalid credentials")
      end
    end
  end

  describe "DELETE /users/sign_out" do
    context "when user is not signed in" do
      before do
        delete "/users/sign_out"
      end
      it "responds with a true signed_out status" do
        expect(response.status).to eq(200)
        expect(session[:user_id]).to be_nil

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["signed_out"]).to be true
      end
    end

    context "when user is signed in" do
      before do
        post "/users/sign_in", params: { email: user.email, password: "password" }
         delete "/users/sign_out"
      end
      it "signs out user then responds with a signed out successfully message" do
        expect(response.status).to eq(200)
        expect(session[:user_id]).to be_nil

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["message"]).to eq("Signed out successfully.")
      end
    end
  end
end
