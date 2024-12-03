# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController

  before_action :authenticate_user!
  before_action :check_auth
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    user = User.new(
      email: params[:email], 
      password: params[:password], 
      password_confirmation: params[:password_confirmation], 
      name: params[:name], 
      position: params[:position],
      role: params[:role],
      department: params[:department]
    )

    puts user

    if(params[:manager_id])
      user.build_manager_assignment(manager: User.find(params[:manager_id]))
    end
    
    if user.save
      render json: user.to_json(include: :manager), status: :created
    else 
      render json: { error: user.errors }, status: :bad_request
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
  # 
  private 

  def check_auth
    puts current_user.inspect
    unless current_user && current_user.role == "admin"
      render json: { error: "Not authorized"}, status: :unauthorized
    end
  end

end
