class ApprovalSerializer < ActiveModel::Serializer
  attributes :id, :stage, :status, :decided_at

  def stage
    object.format_stage
  end

  def status
    object.format_status
  end

  def decided_at
    if(object.decided_at)
      object.format_decided_at
    end
  end

end
