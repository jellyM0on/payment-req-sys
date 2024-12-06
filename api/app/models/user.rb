class User < ApplicationRecord
  has_many :requests
  has_many :approvals

  # currently users only have 1 manager
  has_one :manager_assignment, foreign_key: :user_id, class_name: 'ManagerAssignment'
  has_one :manager, through: :manager_assignment, source: :manager


  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # enums 
  enum :role, { employee: 0, manager: 1, accountant: 2, admin: 3 }
  enum :department, { technical: 0, accounting: 1, hr_admin: 2 }
  
end
