class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :check_auth


  def index
    users = User.get_all(params)
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

    user.manager_id = params[:manager_id]
    if user.role == "employee" && params[:role] != "employee"
      user.destory_manager_assignment(params[:id])
    end

    if user.role == "manager" && params[:role] != "manager"
      if !user.is_manager_update_valid(params[:id])
        render json: { error: { role: "Manager has assigned employees and/or pending approvals" } }, status: :bad_request
        return
      end
    end

    if user.update_role(params) && user.update_manager(params)
      user.reload
      render json: user, serializer: UserSerializer, status: :ok
    else
      render json: { error: user.errors }, status: :bad_request
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
