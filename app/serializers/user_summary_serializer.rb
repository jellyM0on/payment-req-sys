class UserSummarySerializer < ActiveModel::Serializer
  attributes :name, :department

  def department
    object.format_department
  end
end
