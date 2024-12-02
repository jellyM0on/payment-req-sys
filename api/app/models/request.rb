class Request < ApplicationRecord
  belongs_to :user
  has_many :approvals
  
   # enums 
   enum :overall_status, { pending: 0, accepted: 1, rejected: 2 }
   enum :current_stage, { manager: 0, accountant: 1, admin: 2 }
   enum :vendor_certificate_of_reg, { n_applicable: 0, applicable: 1}
   enum :payment_mode, { bank_transfer: 0, credit_card: 1, check: 2}
   enum :purchase_category, { company_events: 0, office_events: 1, trainings: 2, others: 3}

end
