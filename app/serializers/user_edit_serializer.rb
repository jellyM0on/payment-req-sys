class UserEditSerializer < ActiveModel::Serializer
  attributes :id, :name, :role, :email, :position, :department

  has_one :manager, serializer: ManagerSerializer
end
