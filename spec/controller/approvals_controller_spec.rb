require "rails_helper"

RSpec.describe "Requests Controller", type: :request do
  let! (:admin_user) { create(:user, role: "admin", department: "hr_admin") }
  let! (:accounting_employee_user) { create(:user, department: "accounting") }

  def build_approval(request, reviewer, stage, status)
    create(
      :approval,
      request: request,
      reviewer: reviewer,
      stage: stage,
      status: status
    )
  end

  let! (:employee_user) { create(:user, department: "technical") }
  let! (:manager_user) { employee_user.manager }
  let! (:manager2_user) { create(:user, role: "admin", department: "technical") }

  let! (:manager_request) { create(:request, user: employee_user, current_stage: "manager") }
  let! (:rejected_manager_request) { create(:request, user: employee_user, current_stage: "manager", overall_status: "rejected") }

  let! (:accountant_request) { create(:request, user: employee_user, current_stage: "accountant") }
  let! (:rejected_accountant_request) { create(:request, user: employee_user, current_stage: "accountant", overall_status: "rejected") }

  let! (:admin_request) { create(:request, user: employee_user, current_stage: "admin") }
  let! (:accepted_admin_request) {  create(:request, user: employee_user, current_stage: "admin", overall_status: "accepted") }

  describe "PUT /requests/:request_id/approvals/:id" do
    context "when user is a reviewer of the request" do
      before do
        build_approval(accepted_admin_request, manager_user, "manager", "accepted")
        build_approval(accepted_admin_request, accounting_employee_user, "accountant", "accepted")
        build_approval(accepted_admin_request, admin_user, "admin", "accepted")
      end
      context "when user has a manager role" do
        before do
          build_approval(manager_request, manager_user, "manager", "pending")
          build_approval(manager_request, nil, "accountant", "pending")
          build_approval(manager_request, admin_user, "admin", "pending")

          build_approval(rejected_manager_request, manager_user, "manager", "rejected")
          build_approval(rejected_manager_request, nil, "accountant", "rejected")
          build_approval(rejected_manager_request, admin_user, "admin", "rejected")

          post "/users/sign_in", params: { email: manager_user.email, password: "password" }
        end
        context "when manager user updates an approval not in the manager stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          it "responds with an unauthorized status" do
            [ manager_request.approvals[1], manager_request.approvals[2] ].each do |approval|
              put "/requests/#{manager_request.id}/approvals/#{approval.id}",
              params: { approval: request_params }

              expect(response.status).to eq(401)
            end
          end
        end
        context "when manager user updates an approval that already has a decided manager approval" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{accepted_admin_request.id}/approvals/#{accepted_admin_request.approvals[0].id}",
            params: { approval: request_params }
          end
          it "responds with an unauthorized status" do
            expect(response.status).to eq(401)
          end
        end
        context "when manager user accepts a request in the manager stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{manager_request.id}/approvals/#{manager_request.approvals[0].id}",
            params: { approval: request_params }
          end
          it "responds with approvals" do
            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res).to include(a_hash_including("approvals"))
          end
          it "updates the approval" do
            manager_request.approvals[0].reload
            expect(manager_request.approvals[0].status).to eq("accepted")
          end
        end
        context "when manager user rejects a request in the manager stage" do
          let(:request_params) do
            { status: "rejected" }
          end
          before do
            put "/requests/#{manager_request.id}/approvals/#{manager_request.approvals[0].id}",
            params: { approval: request_params }
          end
          it "responds with approvals" do
            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res).to include(a_hash_including("approvals"))
          end
          it "updates the approval" do
            manager_request.approvals[0].reload
            expect(manager_request.approvals[0].status).to eq("rejected")
          end
          it "updates the accountant and admin approval" do
            manager_request.approvals[1].reload
            manager_request.approvals[2].reload
            expect(manager_request.approvals[1].status).to eq("rejected")
            expect(manager_request.approvals[2].status).to eq("rejected")
          end
        end
      end
      context "when user is in the accounting department" do
        before do
          build_approval(accountant_request, manager_user, "manager", "accepted")
          build_approval(accountant_request, nil, "accountant", "pending")
          build_approval(accountant_request, admin_user, "admin", "pending")

          build_approval(rejected_accountant_request, manager_user, "manager", "rejected")
          build_approval(rejected_accountant_request, accounting_employee_user, "accountant", "rejected")
          build_approval(rejected_accountant_request, admin_user, "admin", "rejected")

          post "/users/sign_in", params: { email: accounting_employee_user.email, password: "password" }
        end
        context "when accountant user updates an approval not in the accountant stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          it "responds with an unauthorized status" do
            [ accountant_request.approvals[0], accountant_request.approvals[2] ].each do |approval|
              put "/requests/#{accountant_request.id}/approvals/#{approval.id}",
              params: { approval: request_params }

              expect(response.status).to eq(401)
            end
          end
        end
        context "when accountant user updates an approval that already has a decided accountant approval" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{accepted_admin_request.id}/approvals/#{accepted_admin_request.approvals[1].id}",
            params: { approval: request_params }
          end
          it "responds with an unauthorized status" do
            expect(response.status).to eq(401)
          end
        end
        context "when accountant user updates an approval rejected in the manager stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{rejected_accountant_request.id}/approvals/#{rejected_accountant_request.approvals[1].id}",
            params: { approval: request_params }
          end
          it "responds with an unauthorized status" do
            expect(response.status).to eq(401)
          end
        end
        context "when accountant user accepts a request in the accountant stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{accountant_request.id}/approvals/#{accountant_request.approvals[1].id}",
            params: { approval: request_params }
          end
          it "responds with approvals" do
            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res).to include(a_hash_including("approvals"))
          end
          it "updates the approval" do
            accountant_request.approvals[1].reload
            expect(accountant_request.approvals[1].status).to eq("accepted")
          end
        end
        context "when accountant user rejects a request in the accountant stage" do
          let(:request_params) do
            { status: "rejected" }
          end
          before do
            put "/requests/#{accountant_request.id}/approvals/#{accountant_request.approvals[1].id}",
            params: { approval: request_params }
          end
          it "responds with approvals" do
            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res).to include(a_hash_including("approvals"))
          end
          it "updates the approval" do
            accountant_request.approvals[1].reload
            expect(accountant_request.approvals[1].status).to eq("rejected")
          end
          it "updates the admin approval" do
            accountant_request.approvals[2].reload
            expect(accountant_request.approvals[2].status).to eq("rejected")
          end
        end
      end
      context "when user has an admin role" do
        before do
          build_approval(admin_request, manager_user, "manager", "accepted")
          build_approval(admin_request, accounting_employee_user, "accountant", "accepted")
          build_approval(admin_request, admin_user, "admin", "pending")

          build_approval(rejected_accountant_request, manager_user, "manager", "rejected")
          build_approval(rejected_accountant_request, accounting_employee_user, "accountant", "rejected")
          build_approval(rejected_accountant_request, admin_user, "admin", "rejected")

          post "/users/sign_in", params: { email: admin_user.email, password: "password" }
        end
        context "when admin user updates an approval not in the admin stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          it "responds with an unauthorized status" do
            [ admin_request.approvals[0], admin_request.approvals[1] ].each do |approval|
              put "/requests/#{admin_request.id}/approvals/#{approval.id}",
              params: { approval: request_params }

              expect(response.status).to eq(401)
            end
          end
        end
        context "when admin user updates an approval that already has a decided admin approval" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{accepted_admin_request.id}/approvals/#{accepted_admin_request.approvals[2].id}",
            params: { approval: request_params }
          end
          it "responds with an unauthorized status" do
            expect(response.status).to eq(401)
          end
        end
        context "when admin user updates an approval rejected in the accountant stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{rejected_accountant_request.id}/approvals/#{rejected_accountant_request.approvals[2].id}",
            params: { approval: request_params }
          end
          it "responds with an unauthorized status" do
            expect(response.status).to eq(401)
          end
        end
        context "when admin user accepts a request in the admin stage" do
          let(:request_params) do
            { status: "accepted" }
          end
          before do
            put "/requests/#{admin_request.id}/approvals/#{admin_request.approvals[2].id}",
            params: { approval: request_params }
          end
          it "responds with approvals" do
            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res).to include(a_hash_including("approvals"))
          end
          it "updates the approval" do
            admin_request.approvals[2].reload
            expect(admin_request.approvals[2].status).to eq("accepted")
          end
          it "updates the overall status of the request" do
            admin_request.reload
            expect(admin_request.overall_status).to eq("accepted")
          end
        end
        context "when admin user rejects a request in the admin stage" do
          let(:request_params) do
            { status: "rejected" }
          end
          before do
            put "/requests/#{admin_request.id}/approvals/#{admin_request.approvals[2].id}",
            params: { approval: request_params }
          end
          it "responds with approvals" do
            expect(response.status).to eq(200)

            parsed_res = JSON.parse(response.body)
            expect(parsed_res).to include(a_hash_including("approvals"))
          end
          it "updates the approval" do
            admin_request.approvals[2].reload
            expect(admin_request.approvals[2].status).to eq("rejected")
          end
          it "updates the overall status of the request" do
            admin_request.reload
            expect(admin_request.overall_status).to eq("rejected")
          end
        end
      end
    end
    context "when user is not a reviewer of the request" do
      let(:request_params) do
        { status: "accepted" }
      end
      before do
        build_approval(manager_request, manager_user, "manager", "pending")
        build_approval(manager_request, nil, "accountant", "pending")
        build_approval(manager_request, admin_user, "admin", "pending")

        post "/users/sign_in", params: { email: manager2_user.email, password: "password" }
        put "/requests/#{manager_request.id}/approvals/#{manager_request.approvals[0].id}",
        params: { approval: request_params }
      end
      it "responds with an unauthorized status" do
        expect(response.status).to eq(401)
      end
    end
  end
end
