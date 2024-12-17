class RequestSummarySerializer < ActiveModel::Serializer
  attributes :id, :overall_status, :purchase_category, :current_stage

  belongs_to :user, serializer: UserSummarySerializer
  has_many :approvals, serializer: ApprovalSummarySerializer

  def overall_status
    object.format_overall_status
  end

  def purchase_category
    object.format_purchase_category
  end

  def current_stage
    object.format_current_stage
  end
end
