require "rails_helper"

RSpec.describe Request, type: :model do
  let! (:employee_user) { create(:user, department: "technical") }
  let! (:request) { create(:request, user: employee_user) }

  describe "Request Model" do
    context "should validate" do
      it "with overall_status, current_stage, vendor_name, vendor_tin, vendor_address,
      vendor_email, vendor_contact_num, vendor_certificate_of_reg, payment_due_date,
      payment_payable_to, payment_mode, purchase_category, purchase_description,
      purchase_amount, vendor_attachment, and supporting_documents present" do
        expect(request).to be_valid
        expect(request.vendor_attachment).to be_attached
        expect(request.supporting_documents).to be_attached
      end

      it "belongs to 1 user" do
        expect(request.user_id).to eq(employee_user.id)
        expect(employee_user).to be_valid
      end
    end

    context "should not be valid" do
      it "with vendor_name not present" do
        invalid_request = build(:request, vendor_name: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with vendor_tin not present" do
        invalid_request = build(:request, vendor_tin: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with vendor_address not present" do
        invalid_request = build(:request, vendor_address: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with vendor_email not present" do
        invalid_request = build(:request, vendor_email: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with vendor_contact_num not present" do
        invalid_request = build(:request, vendor_contact_num: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with payment_due_date not present" do
        invalid_request = build(:request, payment_due_date: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with payment_payable_to not present" do
        invalid_request = build(:request, payment_payable_to: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with purchase_description not present" do
        invalid_request = build(:request, purchase_description: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with purchase_description not present" do
        invalid_request = build(:request, purchase_amount: nil)
        expect(invalid_request).not_to be_valid
      end
      it "with vendor_attachment not present" do
        invalid_request = request
        invalid_request.vendor_attachment = nil
        expect(invalid_request).not_to be_valid
      end
      it "with supporting_documents not present" do
        invalid_request = request
        invalid_request.supporting_documents = nil
        expect(invalid_request).not_to be_valid
      end
      it "with vendor_certificate_of_reg not present" do
        expect { build(:request, vendor_certificate_of_reg: "invalid_reg") }
        .to raise_error(ArgumentError)
        .with_message(/is not a valid vendor_certificate_of_reg/)
      end
      it "with payment_mode having invalid enum" do
        expect { build(:request, payment_mode: "invalid_mode") }
        .to raise_error(ArgumentError)
        .with_message(/is not a valid payment_mode/)
      end
      it "with purchase_category having invalid enum" do
        expect { build(:request, purchase_category: "invalid_category") }
        .to raise_error(ArgumentError)
        .with_message(/is not a valid purchase_category/)
      end
      it "with overall_status having invalid enum" do
        expect { build(:request, overall_status: "invalid_status") }
          .to raise_error(ArgumentError)
          .with_message(/is not a valid overall_status/)
      end
      it "with current_stage having invalid enum" do
        expect { build(:request, current_stage: "invalid_stage") }
          .to raise_error(ArgumentError)
          .with_message(/is not a valid current_stage/)
      end
    end
  end
end
