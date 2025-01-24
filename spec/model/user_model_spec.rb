require "rails_helper"

RSpec.describe User, type: :model do
  let! (:employee_user) { create(:user, department: "technical") }
  let! (:manager_user) { employee_user.manager }
  let! (:admin_user) { create(:user, role: "admin", department: "hr_admin") }

  describe "User Model" do
    context "should validate" do
      it "with name, email, position, role, department present" do
        expect(employee_user).to be_valid
        expect(manager_user).to be_valid
        expect(admin_user).to be_valid
      end
    end

    context "should not be valid" do
      it "with name not present" do
        invalid_user =  build(:user, name: nil, role: "manager")
        expect(invalid_user).not_to be_valid
      end
      it "with email not present" do
        invalid_user =  build(:user, email: nil, role: "manager")
        expect(invalid_user).not_to be_valid
      end
      it "with password not present" do
        invalid_user =  build(:user, password: nil, role: "manager")
        expect(invalid_user).not_to be_valid
      end
      it "with position not present" do
        invalid_user =  build(:user, position: nil, role: "manager")
        expect(invalid_user).not_to be_valid
      end
      it "with role having invalid enum" do
        expect { build(:user, role: "invalid_role") }
          .to raise_error(ArgumentError)
          .with_message(/is not a valid role/)
      end
      it "with department having invalid enum" do
        expect { build(:user, department: "invalid_department") }
          .to raise_error(ArgumentError)
          .with_message(/is not a valid department/)
      end
    end
  end
end
