class ApplicationController < ActionController::API
    # skip_before_action :verify_authenticity_token
    before_action :configure_permitted_parameters, if: :devise_controller?

    def authenticate_user!
        if user_signed_in?
            @user = current_user
        else
            render json: { error: "Must sign in or sign up." }, status: :unauthorized
        end
    end
    protected

    def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up, keys: [ :name, :position, :role, :department, :manager_id ])
      # devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
    end
  # before_action :set_csrf_cookie

  # include ActionController::Cookies
  # include ActionController::RequestForgeryProtection

  # protect_from_forgery with: :exception

  # private

  # def set_csrf_cookie
  #   cookies["CSRF-TOKEN"] = form_authenticity_token
  # end
end
