class RequestsController < ApplicationController

  before_action :authenticate_user!
  before_action :check_role 
  before_action :validate_params, only: [ :create ]

  def index
    case @user_role
    when "admin" || "accountant"
      requests = Request.all

    when "employee"
      requests = Request.find_by(
        user_id: current_user.id
      )

    when "manager"
      requests = Request.joins(:approvals).where(:approvals => {:reviewer => current_user.id}).or(Request.where(user: current_user.id))
    end
 
    render json: requests.to_json(:include => [ {:user => { :only => [:name, :department]}}, { :approvals => { :include => { :reviewer => {:only => :name}}} }])
  end

  def create 
    request = Request.new(@validated_params)
    request.user_id = current_user.id
    request.overall_status = "pending"

    case @user_role
    when "employee" || "accountant"
      request.current_stage = "manager"

    when "manager"
      request.current_stage = "accountant"

    when "admin"
      request.current_stage = "accountant"
    end
  
    if request.save
      render json: request, status: :ok
    else 
      render json: { errors: request.errors }, status: :bad_request
    end
  end

  private

  def check_role
    @user_role = current_user.role

  end

  def validate_params
    @validated_params = params.require(:request)
      .permit(
        :vendor_name, 
        :vendor_tin, 
        :vendor_address, 
        :vendor_email, 
        :vendor_contact_num, 
        :vendor_certificate_of_reg, 
        :vendor_attachment,
        :payment_due_date, 
        :payment_payable_to, 
        :payment_mode,
        :purchase_category, 
        :purchase_description, 
        :purchase_amount
      )
    
  end

end
