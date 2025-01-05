class Approval < ApplicationRecord
  belongs_to :request
  belongs_to :reviewer, class_name: "User", foreign_key: :reviewer_id, optional: true

  # enums
  enum :stage, { manager: 0, accountant: 1, admin: 2 }
  enum :status, { pending: 0, accepted: 1, rejected: 2 }

  def self.ransackable_associations(auth_object = nil)
    %w[reviewer]
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[]
  end

  def format_stage
    stage.titleize
  end

  def format_status
    status.titleize
  end

  def format_decided_at
    decided_at.strftime("%d %B %Y %H:%M")
  end
end
