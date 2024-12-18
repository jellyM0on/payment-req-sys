class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :check_auth
  before_action :validate_params, only: [ :update ]


  def index
    @q = User.includes(:manager).ransack(params[:q])
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
    user = User.includes(:manager).find(params[:id])

    if params[:role] == "employee" && !(params[:manager_id].present?)
      render json: { error: { manager_id: "Manager assignment is required" } }, status: :bad_request
        return
    end

    def update_manager
      if params[:manager_id].present?
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


    if user.role == "employee" && params[:role] != "employee"
      puts(true)
      manager = ManagerAssignment.find_by(
        user_id: params[:id]
      )
      if manager
        ManagerAssignment.destroy(manager.id)
      end
    end

    if user.role == "manager" && params[:role] != "manager"
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

    if user.update(@validated_params) && update_manager
      render json: user, serializer: UserSerializer, status: :ok
    else
      render json: { error: user.errors }, status: :bad_request
    end
  end

  def index_managers
    managers = User.where(role: "manager")
              .page(params[:page] ? params[:page].to_i: 1).per(params[:limit] || 10)
    render json: { managers: ActiveModelSerializers::SerializableResource.new(managers, each_serializer: ManagerSerializer), pagination_meta: pagination_meta(managers) }
  end

  private

  def check_auth
    unless current_user.role == "admin"
      render json: { error: "Not authorized" }, status: :unauthorized
    end
  end

  def validate_params
    @validated_params = params.require(:user).permit(:role)
  end

  def pagination_meta(users) {
    current_page: users.current_page,
    next_page: users.next_page,
    total_pages: users.total_pages,
    total_count: users.total_count
  }
  end
end
