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
    if user.update(@validated_params)
      render json: user, status: :ok
    else 
      render json: { error: user.errors }, status: :bad_request
    end
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