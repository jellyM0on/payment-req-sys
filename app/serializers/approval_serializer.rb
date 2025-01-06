class ApprovalSerializer < ActiveModel::Serializer
  attributes :id, :stage, :status, :decided_at, :reviewer

  def reviewer
    if object.reviewer
      { id: object.reviewer.id }
    end
  end

  def stage
    object.format_stage
  end

  def status
    object.format_status
  end

  def decided_at
    if object.decided_at
      object.format_decided_at
    end
  end
end
