class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :role, :email, :position, :department

  has_one :manager, serializer: ManagerSerializer

  def role
    object.format_role
  end

  def department
    object.format_department
  end
end
