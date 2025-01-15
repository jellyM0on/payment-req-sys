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

  # methods
  def update_current_stage(current_approval)
    if current_approval.stage == "admin"
      return true
    end

    request = Request.find(current_approval.request_id)

    if request.update(current_stage: current_approval.stage_before_type_cast + 1)
      true
    end
  end

  def update_pending_approvals(current_approval)
    if current_approval.status == "rejected"
      pending_approvals = Approval.where(
        request_id: current_approval.request_id,
        status: "pending"
      )

      pending_approvals.each do |p_approval|
        # p_approval.update(status: "rejected", decided_at: Time.current.to_s)
        p_approval.update(status: "rejected")
      end
    else
      true
    end
  end

  def update_overall_status(current_approval)
    if current_approval.stage == "admin"
      request = Request.find(current_approval.request_id)
      if request.update(overall_status: current_approval.status)
        true
      end

    elsif current_approval.status == "rejected"
      request = Request.find(current_approval.request_id)
      if request.update(overall_status: "rejected")
        true
      end

    else
      true
    end
  end
end
