class Request < ApplicationRecord
  belongs_to :user
  has_many :approvals
  
   # enums 
   enum :overall_status, { pending: 0, accepted: 1, rejected: 2 }
   enum :current_stage, { manager: 0, accountant: 1, admin: 2 }
   enum :vendor_certificate_of_reg, { n_applicable: 0, applicable: 1}
   enum :payment_mode, { bank_transfer: 0, credit_card: 1, check: 2}
   enum :purchase_category, { company_events: 0, office_events: 1, trainings: 2, others: 3}

   # validation 
  validates :vendor_name, presence: true, length: { in: 1..100 }
  validates :vendor_tin, presence: true, length: { is: 9 }
  validates :vendor_address, presence: true, length: { in: 1..250 }
  validates :vendor_email, presence: true, length: { in: 1..100 }
  validates :vendor_contact_num, presence: true, length: { in: 1..250 }
  validates :vendor_certificate_of_reg, presence: true
  validates :vendor_attachment, presence: true 
  validates :payment_payable_to, presence: true, length: { in: 1..100 }
  validates :payment_mode, presence: true
  validates :purchase_description, presence: true, length: { in: 1..500 }
  validates :purchase_amount, presence: true
  validates :purchase_category, presence: true
end
