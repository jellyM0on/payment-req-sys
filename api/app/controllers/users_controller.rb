class UsersController < ApplicationController
 
  before_action :authenticate_user!
  before_action :check_auth
  before_action :validate_params, only: [ :update ]


  def index 
    users = User.all 
    render json: { users: users }
  end

  def update
    user = User.find(params[:id])

    def update_manager
      if (params[:manager_id])
        manager = ManagerAssignment.find_by(
          user_id: params[:id]
        )
  
        manager.update(manager_id: params[:manager_id])
      end
    end
      
    if user.update(@validated_params) && update_manager
      render json: user.to_json(include: :manager), status: :ok
    else 
      render json: { error: user.errors }, status: :bad_request
    end
  end

  def index_managers
    managers = User.where(role: "manager")
    render json: { managers: managers }
  end

  private

  def check_auth
    puts current_user.inspect
    unless current_user.role == "admin"
      render json: { error: "Not authorized"}, status: :unauthorized
    end
  end

  def validate_params
    @validated_params = params.require(:user).permit(:name, :position, :role, :department, :email, :manager_id)
  end

end