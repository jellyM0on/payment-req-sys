class RequestsController < ApplicationController
  include Rails.application.routes.url_helpers

  before_action :authenticate_user!
  before_action :check_role 
  before_action :check_unspec_role, only: [ :index ]
  before_action :validate_params, only: [ :create, :update ]

  def index
    filter_param = params[:filter_by]

    case @user_role
    when "admin", "accounting_employee", "accounting_manager"
      requests = Request.all

    when "employee"
      requests = Request.where(
        user_id: current_user.id
      )

    when "manager"
      requests = Request.joins(:approvals).where(:approvals => {:reviewer => current_user.id}).or(Request.where(user: current_user.id)).distinct
    end

    if(filter_param == "own_approvals" && @user_role != "admin")
      requests = requests.joins(:approvals)
      .where(current_stage: @user_unspec_role, approvals: {status: "pending", stage: @user_unspec_role})
      .where.not(user_id: current_user.id)
    end

    if(filter_param == "own_approvals" && @user_role == "admin")
      requests = requests.joins(:approvals)
      .where(current_stage: @user_unspec_role, approvals: {status: "pending", stage: @user_unspec_role})
    end

    if(requests.nil?) 
      render json: { requests: nil, pagination_meta: nil }, status: :ok
      return 
    end

    @q = requests.ransack(params[:q])
    requests = @q.result

    requests = requests.order(created_at: :desc).page(params[:page] ? params[:page].to_i: 1).per(params[:limit] || 5)
 
    render json: { requests: requests.as_json(:only =>  [:id, :overall_status, :purchase_category, :current_stage],:include => [{:user => { :only => [:name, :department]}}, { :approvals => { :only => [:stage], :include => { :reviewer => {:only => [:name]}}} }]),
                    pagination_meta: pagination_meta(requests)
                },  status: :ok
  end

  def show
    request = Request.find(params[:id])

    isReviewer = false 
    request.approvals.each do |approval|
      if(approval.reviewer_id == current_user.id || approval.stage == "accountant" && current_user.department == "accounting")
        isReviewer = true 
      end
    end

    request = request.as_json(
      include: {
        approvals: { only: [:id, :stage, :status, :decided_at] }
      }
    ).merge(
      vendor_attachment_url: url_for(request.vendor_attachment),
      supporting_documents_urls: request.supporting_documents.map { |document| url_for(document) }
    )

    if(request.user_id == current_user.id || isReviewer)
        render json: { request: build_request(request) }
    else 
      render json: "Unauthorized", status: :unauthorized
    end

  end

  def create 
    request = Request.new(@validated_params)
    request.user_id = current_user.id
    request.overall_status = "pending"
    attach_documents(request)

    puts @user_role

    case @user_role
    when "employee", "accounting_employee"
      request.current_stage = "manager"

    when "manager", "accounting_manager"
      request.current_stage = "accountant"

    when "admin"
      request.current_stage = "accountant"
    end

    buildApprovals(request, @user_role)
  
    if request.save
      render json: build_request_with_documents(request), status: :ok
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
        break; 
      end
    end

    if (request.user_id != current_user.id || hasDecidedApproval)
      render json: "Unauthorized", status: :unauthorized
      return
    end

    attach_documents(request)

    if request.update(@validated_params)
      render json: build_request_with_documents(request), status: :ok
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

  def check_unspec_role
    if(current_user.department == "accounting")
      @user_unspec_role = "accountant"
    else 
      @user_unspec_role = current_user.role
    end
  end

  def validate_params
    @validated_params = params.require(:request).permit(
        :vendor_name, 
        :vendor_tin, 
        :vendor_address, 
        :vendor_email, 
        :vendor_contact_num, 
        :vendor_certificate_of_reg, 
        :payment_due_date, 
        :payment_payable_to, 
        :payment_mode,
        :purchase_category, 
        :purchase_description, 
        :purchase_amount, 
        :vendor_attachment, 
        supporting_documents:[]
      )
  end

  def attach_documents(request)
    if params[:vendor_attachment].present?
      request.vendor_attachment.purge if request.vendor_attachment.attached? 
      request.vendor_attachment.attach(params[:vendor_attachment])
    end

    if params[:supporting_documents].present?
      request.supporting_documents.purge if request.supporting_documents.attached?
      request.supporting_documents.attach(params[:supporting_documents])
    end
  end

  def build_request_with_documents(request)
    request.as_json.merge(
      vendor_attachment_url: url_for(request.vendor_attachment), 
      supporting_documents_urls: request.supporting_documents.map { |document| url_for(document) }
    )
  end

  def buildApprovals(request, user_role)
    buildManagerApproval(request, user_role)
    buildAccountantApproval(request)
    buildAdminApproval(request)
  end
  
  def buildManagerApproval(request, user_role)
    if(user_role == "manager" || user_role == "accounting_manager")
      request.approvals.build(stage: "manager", reviewer_id: current_user.id, status: "accepted", decided_at:Time.current.to_s)
    elsif(user_role == "admin")
      request.approvals.build(stage: "manager", reviewer_id: nil, status: "accepted", decided_at:Time.current.to_s)
    else 
      request.approvals.build(stage: "manager", reviewer_id: current_user.manager.id, status: "pending")
    end
  end

  def buildAccountantApproval(request)
    request.approvals.build(stage: "accountant", reviewer_id: nil, status: "pending")
  end

  def buildAdminApproval(request)
    request.approvals.build(stage: "admin", reviewer_id: User.find_by(role: "admin").id, status: "pending")
  end

  def pagination_meta(requests) {
    current_page: requests.current_page, 
    next_page: requests.next_page, 
    total_pages: requests.total_pages, 
    total_count: requests.total_count
  } 
  end

end