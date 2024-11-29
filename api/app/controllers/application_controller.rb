class ApplicationController < ActionController::API
    # skip_before_action :verify_authenticity_token 
    before_action :configure_permitted_parameters, if: :devise_controller?

    protected

    def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :position, :role, :department])
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
