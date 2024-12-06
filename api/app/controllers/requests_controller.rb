class RequestsController < ApplicationController

  before_action :authenticate_user!
  before_action :check_role 
  before_action :validate_params, only: [ :create, :update ]

  def index
    case @user_role
    when "admin" || "accounting_employee" || "accounting_manager"
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
    when "employee" || "accounting_employee"
      request.current_stage = "manager"

    when "manager" || "accounting_manager"
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

  def update 
    request = Request.find(params[:id])
    hasDecidedApproval = false

    request.approvals.each do |approval|
      if(approval.status == "accepted" || approval.status == "rejected")
        hasDecidedApproval = true
      end
    end

    if (request.user_id != current_user.id || hasDecidedApproval)
      render json: "Unauthorized", status: :unauthorized
      return
    end

    if request.update(@validated_params)
      render json: request, status: :ok
    else 
      render json: { errors: request.errors },  status: :bad_request
    end

  end

  private

  def check_role
    if(current_user.department == "accounting" && current_user.role == "employee")
      @user_role = "accounting_employee"
    elsif (current_user.department == "accounting" && current_user.role == "manager")
      @user_role = "accounting_manager"
    else 
      @user_role = current_user.role
    end
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
