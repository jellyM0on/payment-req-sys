class User < ApplicationRecord
  has_many :requests
  has_many :request_stats

  # currently users only have 1 manager
  has_one :assigned_manager, foreign_key: :user_id
  has_one :manager, through: :assigned_manager, source: :manager


  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # enums 
  enum :role, { employee: 0, manager: 1, admin: 2 }
  enum :department, { technical: 0, accounting: 1, hr_admin: 2 }
  
end
