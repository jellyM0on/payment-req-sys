class Approval < ApplicationRecord
  belongs_to :request
  belongs_to :reviewer, class_name: 'User', foreign_key: :reviewer_id

  # enums 
  enum :stage, { manager: 0, accountant: 1, admin: 2 }
  enum :status, { pending: 0, accepted: 1, rejected: 2 }

end
