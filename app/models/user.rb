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
  enum :role, { employee: 0, manager: 1, admin: 2 }
  enum :department, { technical: 0, accounting: 1, hr_admin: 2 }

  # validations 
  validates :name, presence: true, length: { in: 1..100 }
  validates :email, presence: true, length: { in: 1..100 }
  validates :position, presence: true, length: { in: 1..250 }


  def self.ransackable_attributes(auth_object = nil)
    %w[name]
  end

  def format_role
    role.titleize
  end

  def format_department
    case department
    when "technical"
      "Technical"
    when "accounting"
      "Accounting"
    when "hr_admin"
      "HR & Admin"
    end
  end

end
