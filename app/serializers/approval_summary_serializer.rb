class ApprovalSummarySerializer < ActiveModel::Serializer
  attributes :stage, :reviewer

  def reviewer  
    if(object.reviewer)
      { name: object.reviewer.name }
    elsif(!object.reviewer && object.stage == "accountant")
      { name: "TBA" }
    end
  end

  def stage
    object.format_stage
  end

end
