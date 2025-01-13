class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :check_auth


  def index
    def find_enum(input, statuses)
      return nil if input.empty?
      statuses.find_index {  |status| status.include?(input.downcase) }
    end

    def match_no_manager(input)
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
    users = @q.result
            .order(created_at: :desc)
            .page(params[:page] ? params[:page].to_i: 1).per(params[:limit] || 10)
    render json: { users: ActiveModelSerializers::SerializableResource.new(users, each_serializer: UserSerializer), pagination_meta: pagination_meta(users) }
  end

  def show
    user = User.find(params[:id])

    if user
      render json: user, serializer: UserEditSerializer, status: :ok
    else
      render json: { error: user.errors }, status: :bad_request
    end
  end

  def update
    @user = User.includes(:manager).find(params[:id])

    @user.manager_id = params[:manager_id]
    if @user.role == "employee" && params[:role] != "employee"
      manager = ManagerAssignment.find_by(
        user_id: params[:id]
      )
      puts(manager.to_json)
      if manager
        ManagerAssignment.destroy(manager.id)
      end
    end

    def update_manager
      manager_user = User.find_by_id(params[:manager_id])
      if (!manager_user || manager_user.department != @user.department) && params[:manager_id]
        return false
      end

      if params[:role] == "employee" && !params[:manager_id]
        return false
      end

      if  params[:manager_id].present? && params[:role] != "manager"
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


    if @user.role == "manager" && params[:role] != "manager"
      employees = ManagerAssignment.find_by(
        manager_id: params[:id]
      )

      approvals = Approval.find_by(
        reviewer_id: params[:id],
        stage: "manager",
        status: "pending"
      )

      if employees || approvals
        render json: { error: { role: "Manager has assigned employees and/or pending approvals" } }, status: :bad_request
        return
      end
    end

    def update_user
      role = params[:role]
      if role && [ "employee", "manager" ].include?(role)
        @user.update(role: params[:role])
        true
      elsif role && ![ "employee", "manager" ].include?(role)
        render json: { error: { role: "Invalid role" } }, status: :bad_request
        false
      end
    end

    if update_user && update_manager
      render json: @user, serializer: UserSerializer, status: :ok
    else
      render json: { error: @user.errors }, status: :bad_request
    end
  end

  def index_managers
    q = User.where(role: "manager")
              .page(params[:page] ? params[:page].to_i: 1).per(params[:limit] || 10)
              .ransack(params[:q])
    managers = q.result
    render json: { managers: ActiveModelSerializers::SerializableResource.new(managers, each_serializer: ManagerSerializer), pagination_meta: pagination_meta(managers) }
  end

  private

  def check_auth
    unless current_user.role == "admin"
      render json: { error: "Not authorized" }, status: :unauthorized
    end
  end

  def pagination_meta(users) {
    current_page: users.current_page,
    next_page: users.next_page,
    total_pages: users.total_pages,
    total_count: users.total_count
  }
  end
end
