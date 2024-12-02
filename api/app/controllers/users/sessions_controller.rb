# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  before_action :set_current_user
  # 
  respond_to :json

  # GET /resource/sign_in
  def new
    if @current_user
      render json: { user: @current_user, logged_in: true}
    else 
      render json: { signed_in: false }
    end
  end

  # POST /resource/sign_in
  def create
    user = User.find_by(email: params[:email])

    if user&.valid_password?(params[:password])
      session[:user_id] = user.id
      sign_in user
      render json: { user: user, signed_in: true }, status: :created
    else 
      render json: { error: 'Invalid' }, status: :unauthorized
    end
  end

  # DELETE /resource/sign_out
  def destroy
    reset_session
    render json: { signed_out: true }, status: :ok
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
  # 

  private

  def set_current_user
    if session[:user_id]
      @current_user = User.find(session[:user_id])
    end
  end

  # def respond_with(resource, _opts = {})
  #   if resource.persisted?
  #     render json: { message: 'Logged in successfully.' }, status: :ok
  #   else
  #     render json: { error: 'Invalid email or password.' }, status: :unauthorized
  #   end
  # end

  def respond_to_on_destroy
    reset_session
    render json: { message: 'Logged out successfully.' }, status: :ok
  end
end
