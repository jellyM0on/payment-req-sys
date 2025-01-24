require "rails_helper"

RSpec.describe Approval, type: :model do
  let! (:admin_user) { create(:user, role: "admin", department: "hr_admin") }

  def build_approval(request, reviewer, stage, status)
    create(
      :approval,
      request: request,
      reviewer: reviewer,
      stage: stage,
      status: status
    )
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
  let! (:employee_request) do
    request = create(:request, user: employee_user)
    build_approvals(request, employee_user)
    request
  end

  describe "Approval Model" do
    context "should validate" do
      let(:approval) { employee_request.approvals[0] }
      it "with stage and status" do
        expect(approval).to be_valid
      end
      it "when it belongs to 1 request" do
        expect(approval.request_id).to eq(employee_request.id)
      end
    end

    context "should not be valid" do
      it "with stage having an invalid enum" do
        expect { build(:approval, stage: "invalid_stage") }
        .to raise_error(ArgumentError)
        .with_message(/is not a valid stage/)
      end
      it "with status having an invalid enum" do
        expect { build(:approval, status: "invalid_status") }
        .to raise_error(ArgumentError)
        .with_message(/is not a valid status/)
      end
    end
  end
end
