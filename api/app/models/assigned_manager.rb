class AssignedManager < ApplicationRecord
  belongs_to :user
  # manager can also have a manager 
  belongs_to :manager, class_name: 'User'

end
