class User < ApplicationRecord
  has_many :requests

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # enums 
  enum :role, { employee: 0, manager: 1, admin: 2 }
  enum :department, { technical: 0, accounting: 1, hr_admin: 2 }
  
end
