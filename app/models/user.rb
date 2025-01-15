class User < ApplicationRecord
  has_many :requests
  has_many :approvals

  # currently users only have 1 manager
  has_one :manager_assignment, foreign_key: :user_id, class_name: "ManagerAssignment"
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
  validates :role, presence: true

  attr_accessor :manager_id

  validates :manager_id, presence: true, if: :is_employee
  validate :manager_is_same_department
  validate :manager_has_valid_role

  def manager_is_same_department
    if manager_id
      manager = User.find(manager_id)
      if manager.department != department
        errors.add(:manager_id, "Must be the same department")
      end
    end
  end

  def manager_has_valid_role
    if manager_id
      manager = User.find(manager_id)
      if manager.role != "manager"
        errors.add(:manager_id, "Must be a manager")
      end
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[ id name department role email position department ]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[ manager ]
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

  def is_employee
    role == "employee"
  end

  # methods
  def self.get_all(params)
    def self.find_enum(input, statuses)
      return nil if input.empty?
      statuses.find_index {  |status| status.include?(input.downcase) }
    end

    def self.match_no_manager(input)
      return nil if input.empty?
      input.match?(/N(\/|\/A)\z?/i) ? true : nil
    end

    if params[:search_by]
      @q = User.includes(:manager).ransack(
        {
          id_eq: params[:search_by],
          name_cont: params[:search_by],
          email_cont: params[:search_by],
          position_cont: params[:search_by],
          manager_name_cont: params[:search_by],
          manager_name_blank: match_no_manager(params[:search_by]),
          department_eq:
            find_enum(
              params[:search_by],
              [ "technical department", "accounting department", "hr and admin department" ]
            ),
          role_eq:
            find_enum(
              params[:search_by],
              [ "employee role", "manager role", "admin role" ]
            )
        },
        { grouping: Ransack::Constants::OR }
      )
    else
      @q = User.includes(:manager).ransack()
    end
    @q.result
      .order(created_at: :desc)
      .page(params[:page] ? params[:page].to_i: 1).per(params[:limit] || 10)
  end

  def destory_manager_assignment(id)
    manager = ManagerAssignment.find_by(
      user_id: id
    )
    if manager
      ManagerAssignment.destroy(manager.id)
    end
  end

  def is_manager_update_valid(id)
    employees = ManagerAssignment.find_by(
        manager_id: id
      )

    approvals = Approval.find_by(
        reviewer_id: id,
        stage: "manager",
        status: "pending"
    )

    if employees.nil? || approvals.nil?
      true
    else
      false
    end
  end

  def update_manager(params)
    manager_user = User.find_by_id(params[:manager_id])
    if ((!manager_user || manager_user.department != department) && params[:manager_id]) ||
      (params[:role] == "employee" && !params[:manager_id]) ||
      (params[:manager_id] && manager_user.role != "manager")
      return false
    end

    if params[:manager_id].present? && params[:role] != "manager"
      manager = ManagerAssignment.find_by(
        user_id: params[:id]
      )

      if !manager
        new_assign = ManagerAssignment.new(user_id: params[:id], manager_id: params[:manager_id])
        new_assign.save
      else
        manager.update(manager_id: params[:manager_id])
      end
    else
      true
    end
  end

  def update_role(params)
    role = params[:role]
    if role && [ "employee", "manager" ].include?(role)
      update(role: params[:role])
      true
    elsif role && ![ "employee", "manager" ].include?(role)
      render json: { error: { role: "Invalid role" } }, status: :bad_request
      false
    end
  end

  def check_role
    if department == "accounting" && role == "employee"
      "accounting_employee"
    elsif department == "accounting" && role == "manager"
      "accounting_manager"
    else
      role
    end
  end

  def check_unspec_role
    if department == "accounting"
      "accountant"
    else
      role
    end
  end
end
