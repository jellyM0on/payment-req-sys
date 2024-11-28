class RequestStat < ApplicationRecord
  belongs_to :request
  belongs_to :user

  # enums 
  enum :approval_stage, { manager: 0, accountant: 1, admin: 2 }
  enum :status, { pending: 0, accepted: 1, rejected: 2 }

end
