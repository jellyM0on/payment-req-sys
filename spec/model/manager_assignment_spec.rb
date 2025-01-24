require "rails_helper"

RSpec.describe ManagerAssignment, type: :model do
  let! (:employee_user) { create(:user, department: "technical") }
  let! (:manager_user) { create(:user, role: "manager", department: "technical") }
  let! (:admin_user) { create(:user, role: "admin", department: "hr_admin") }

  describe "Manager Assignment Model" do
    context "when user has employee role" do
      it "should have 1 assigned manager" do
        manager_assignment = ManagerAssignment.where(user_id: employee_user.id)
        expect(manager_assignment.length).to eq(1)
        expect(employee_user.manager).to be_valid
      end
    end

    context "when user has manager role" do
      it "can have no assigned users" do
        manager_assignments = ManagerAssignment.where(manager_id: manager_user.id)
        expect(manager_assignments.length).to eq(0)
      end
      it "can have many assigned users" do
        manager_assignments = ManagerAssignment.where(manager_id: employee_user.manager.id)
        expect(manager_assignments.length).to be > 0
      end
    end

    context "when user has admin role" do
      it "should not have an assigned manager or users" do
        manager_assignments = ManagerAssignment.where(manager_id: admin_user.id)
        expect(manager_assignments.length).to eq(0)
      end
    end
  end
end
