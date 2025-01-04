require "rails_helper"

RSpec.describe "Requests Controller", type: :request do
  let! (:admin_user) { create(:user, role: "admin", department: "hr_admin") }
  let! (:admin_requests) do
    2.times.map do |i|
      request = create(:request, user: admin_user)
      build_approvals(request, admin_user)
    end
  end

  def build_approvals(request, requestor)
    if requestor.role == "employee"
      create(:approval,
      request: request,
      reviewer: requestor.manager,
      stage: "manager",
      status: "pending"
      )
    elsif requestor.role == "manager"
      create(:approval,
      request: request,
      reviewer: requestor,
      stage: "manager",
      status: "accepted")
    else
      create(:approval,
      request: request,
      reviewer: nil,
      stage: "manager",
      status: "accepted")
    end
    create(:approval, request: request, reviewer: nil, stage: "accountant", status: "pending")
    create(:approval, request: request, reviewer: admin_user, stage: "admin", status: "pending")
  end

  let! (:employee_user) { create(:user, department: "technical") }
  let! (:employee_requests) do
    2.times.map do |i|
      request = create(:request, user: employee_user)
      build_approvals(request, employee_user)
    end
  end

  let! (:employee2_user) { create(:user, department: "hr_admin") }
  let! (:employee2_requests) do
    2.times.map do |i|
      request = create(:request, user: employee2_user)
      build_approvals(request, employee2_user)
    end
  end

  let! (:manager_user) { employee_user.manager }
  let! (:manager_requests) do
    2.times.map do |i|
      request = create(:request, user: manager_user)
      build_approvals(request, manager_user)
    end
  end

  let! (:manager2_user) { employee2_user.manager }
  let! (:manager2_requests) do
    2.times.map do |i|
      request = create(:request, user: manager2_user)
      build_approvals(request, manager2_user)
    end
  end

  let! (:accounting_employee_user) { create(:user, department: "accounting") }
  let! (:accounting_employee_requests) do
    2.times.map do |i|
      request = create(:request, user: accounting_employee_user)
      build_approvals(request, accounting_employee_user)
    end
  end

  let! (:accounting_manager_user) { accounting_employee_user.manager }
  let! (:accounting_manager_requests) do
    2.times.map do |i|
      request = create(:request, user: accounting_manager_user)
      build_approvals(request, accounting_manager_user)
    end
  end

  describe "GET /requests" do
    context "when user has an employee role" do
      context "when user is not in the accounting department" do
        it "responds with the user's requests" do
          [ employee_user, employee2_user ].each do |user|
            post "/users/sign_in", params: { email: user.email, password: "password" }
            get "/requests"

            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res).to include(a_hash_including("requests"))
            expect(parsed_res["pagination_meta"]["total_count"]).to eq(user.requests.count)
          end
        end
      end
      context "when user is in the accounting department" do
        before do
          post "/users/sign_in", params: { email: accounting_employee_user.email, password: "password" }
          get "/requests"
        end
        it "responds with all requests" do
          expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            total_requests = employee_requests.count + employee2_requests.count +
            manager_requests.count + manager2_requests.count +
            accounting_employee_requests.count + accounting_manager_requests.count +
            admin_requests.count

            expect(parsed_res).to include(a_hash_including("requests"))
            expect(parsed_res["pagination_meta"]["total_count"]).to eq(total_requests)
        end
      end
    end
    context "when user has a manager role" do
      context "when user is not in the accounting department" do
        it "responds with the user's requests and requests of users assigned to them" do
          [ employee_user, employee2_user ].each do |employee_user|
            post "/users/sign_in", params: { email: employee_user.manager.email, password: "password" }
            get "/requests"

            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            total_requests = employee_user.requests.count + employee_user.manager.requests.count
            expect(parsed_res).to include(a_hash_including("requests"))
            expect(parsed_res["pagination_meta"]["total_count"]).to eq(total_requests)
          end
        end
      end
      context "when user is in the accounting department" do
        before do
          post "/users/sign_in", params: { email: accounting_manager_user.email, password: "password" }
          get "/requests"
        end
        it "responds with all requests" do
          expect(response.status).to eq(200)

          parsed_res = JSON.parse(response.body)
          total_requests = employee_requests.count + employee2_requests.count +
          manager_requests.count + manager2_requests.count +
          accounting_employee_requests.count + accounting_manager_requests.count +
          admin_requests.count

          expect(parsed_res).to include(a_hash_including("requests"))
          expect(parsed_res["pagination_meta"]["total_count"]).to eq(total_requests)
        end
      end
    end
    context "when user has an admin role" do
      before do
        post "/users/sign_in", params: { email: admin_user.email, password: "password" }
        get "/requests"
      end
      it "responds with all requests" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        total_requests = employee_requests.count + employee2_requests.count +
        manager_requests.count + manager2_requests.count +
        accounting_employee_requests.count + accounting_manager_requests.count +
        admin_requests.count

        expect(parsed_res).to include(a_hash_including("requests"))
        expect(parsed_res["pagination_meta"]["total_count"]).to eq(total_requests)
      end
    end
  end

  describe "GET /requests/:id" do
    context "when user is the requestor" do
      before do
        post "/users/sign_in", params: { email: employee_user.email, password: "password" }
        get "/requests/#{employee_user.requests[0].id}"
      end
      it "responds with the request" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["request"]["id"]).to eq(employee_user.requests[0].id)
      end
    end

    context "when user is not the requestor" do
      context "when user is an assigned reviewer" do
        it "responds with the request" do
          [ employee_user.manager, admin_user ].each do |user|
            post "/users/sign_in", params: { email: user.email, password: "password" }
            get "/requests/#{employee_user.requests[0].id}"

            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res["request"]["id"]).to eq(employee_user.requests[0].id)
          end
        end
      end
      context "when user is an accountant" do
        before do
          post "/users/sign_in", params: { email: accounting_employee_user.email, password: "password" }
          get "/requests/#{employee_user.requests[0].id}"
        end
        it "responds with the request" do
          expect(response.status).to eq(200)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["request"]["id"]).to eq(employee_user.requests[0].id)
        end
      end
      context "when user is not a reviewer or accountant" do
        before do
          post "/users/sign_in", params: { email: employee2_user.email, password: "password" }
          get "/requests/#{employee_user.requests[0].id}"
        end
        it "responds with an unauthorized status" do
          expect(response.status).to eq(401)
        end
      end
    end
  end

  describe "GET /requests/edit/:id" do
    context "when user is the requestor" do
      before do
        post "/users/sign_in", params: { email: employee_user.email, password: "password" }
        get "/requests/edit/#{employee_user.requests[0].id}"
      end
      it "responds with the request" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res["request"]["id"]).to eq(employee_user.requests[0].id)
      end
    end

    context "when user is not the requestor" do
      before do
        post "/users/sign_in", params: { email: employee2_user.email, password: "password" }
        get "/requests/edit/#{employee_user.requests[0].id}"
      end
      it "responds with an unauthorized status" do
        expect(response.status).to eq(401)
      end
    end
  end

  describe "POST /requests" do
    context "when request is valid" do
      let(:request_params) do
        {
          vendor_name: "Vendor Name",
          vendor_tin: "123456789",
          vendor_address: "123 Main St",
          vendor_email: "vendor@example.com",
          vendor_contact_num: "09191111111",
          vendor_certificate_of_reg: "applicable",
          payment_due_date: "2025-01-01",
          payment_payable_to: "Company",
          payment_mode: "bank_transfer",
          purchase_category: "office_events",
          purchase_description: "Purchase Description",
          purchase_amount: 20000,
          vendor_attachment: fixture_file_upload('spec/fixtures/files/test.png', 'image/png'),
          supporting_documents:  Array.new(10) { fixture_file_upload('spec/fixtures/files/test.png', 'image/png') }
        }
      end
      before do
        post "/users/sign_in", params: { email: employee_user.email, password: "password" }
        post "/requests", params: { request: request_params }
      end
      it "responds with the created request" do
        expect(response.status).to eq(200)

        parsed_res = JSON.parse(response.body)
        expect(parsed_res).to include(a_hash_including("id"))
      end
      it "creates a request" do
        parsed_res = JSON.parse(response.body)
        expect(employee_user.requests.any? { |req| req.id == parsed_res["id"] }).to be true
      end
    end

    context "when request is invalid" do
      context "when request has missing required fields" do
        let(:request_params) do
          {
            vendor_tin: "123456789",
            vendor_address: "123 Main St",
            vendor_email: "vendor@example.com",
            vendor_contact_num: "09191111111",
            vendor_certificate_of_reg: "applicable",
            payment_due_date: "2025-01-01",
            payment_payable_to: "Company",
            payment_mode: "bank_transfer",
            purchase_category: "office_events",
            purchase_description: "Purchase Description",
            purchase_amount: 20000
          }
        end
        before do
          post "/users/sign_in", params: { email: employee_user.email, password: "password" }
          post "/requests", params: { request: request_params }
        end
        it "responds with a bad request" do
          expect(response.status).to eq(400)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res).to include(a_hash_including("errors"))
        end
      end

      context "when request has invalid fields" do
        let(:request_params) do
          {
          vendor_name: "",
          vendor_tin: "123456789",
          vendor_address: "123 Main St",
          vendor_email: "vendor@example.com",
          vendor_contact_num: "09191111111",
          vendor_certificate_of_reg: "applicable",
          payment_due_date: "2025-01-01",
          payment_payable_to: "Company",
          payment_mode: "bank_transfer",
          purchase_category: "office_events",
          purchase_description: "Purchase Description",
          purchase_amount: 20000,
          vendor_attachment:  Array.new(2) { fixture_file_upload('spec/fixtures/files/test.png', 'image/png') },
          supporting_documents:  Array.new(11) { fixture_file_upload('spec/fixtures/files/test.png', 'image/png') }
          }
        end
        before do
          post "/users/sign_in", params: { email: employee_user.email, password: "password" }
          post "/requests", params: { request: request_params }
        end
        it "responds with a bad request" do
          expect(response.status).to eq(400)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res).to include(a_hash_including("errors"))
        end
      end
    end
  end

  describe "PUT /requests/:id" do
    context "when user is the requestor" do
      context "when request is valid" do
        let(:request_params) do
          {
          vendor_name: "new_name"
          }
        end
        before do
          post "/users/sign_in", params: { email: employee_user.email, password: "password" }
          put "/requests/#{employee_user.requests[0].id}", params: { request: request_params }
        end
        it "responds with an unauthorized status" do
          expect(response.status).to eq(200)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res["vendor_name"]).to eq("new_name")
        end
      end
      context "when request has invalid fields" do
        let(:request_params) do
          {
          vendor_name: ""
          }
        end
        before do
          post "/users/sign_in", params: { email: employee_user.email, password: "password" }
          put "/requests/#{employee_user.requests[0].id}", params: { request: request_params }
        end
        it "responds with a bad request" do
          expect(response.status).to eq(400)

          parsed_res = JSON.parse(response.body)
          expect(parsed_res).to include(a_hash_including("errors"))
        end
      end
    end
    context "when user is not the requestor" do
      let(:request_params) do
        {
        vendor_name: "new_name"
        }
      end
      before do
        post "/users/sign_in", params: { email: employee2_user.email, password: "password" }
        put "/requests/#{employee_user.requests[0].id}", params: { request: request_params }
      end
      it "responds with an unauthorized status" do
        expect(response.status).to eq(401)
      end
    end
  end
end
