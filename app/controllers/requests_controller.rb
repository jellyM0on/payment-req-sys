class RequestsController < ApplicationController
  include Rails.application.routes.url_helpers

  before_action :authenticate_user!
  before_action :validate_params, only: [ :create ]
  before_action :validate_params_update, only: [ :update ]

  def index
    requests = Request.get_all(params, current_user)

    render json: { requests: ActiveModelSerializers::SerializableResource.new(requests, each_serializer: RequestSummarySerializer),
                    pagination_meta: pagination_meta(requests)
                },  status: :ok
  end

  def show
    request = Request.includes(:approvals).find(params[:id])

    if request.user_id == current_user.id || request.is_user_reviewer(current_user)
        render json: { request: ActiveModelSerializers::SerializableResource.new(request, serializer: RequestSerializer) }
    else
      render json: "Unauthorized", status: :unauthorized
    end
  end

  def show_edit
    request = Request.includes(:approvals).find(params[:id])

    if request.user_id == current_user.id && request.is_editable
        render json: { request: ActiveModelSerializers::SerializableResource.new(request, serializer: RequestEditSerializer) }
    else
      render json: "Unauthorized", status: :unauthorized
    end
  end

  def create
    request = Request.new(@validated_params)
    request.user_id = current_user.id
    request.overall_status = "pending"
    request.attach_documents(params)

    case current_user.check_role
    when "employee", "accounting_employee"
      request.current_stage = "manager"

    when "manager", "accounting_manager"
      request.current_stage = "accountant"

    when "admin"
      request.current_stage = "accountant"
    end

    request.build_approvals(current_user)

    if request.save
      render json: request, serializer: RequestSerializer, status: :ok
    else
      render json: { errors: request.errors }, status: :bad_request
    end
  end

  def update
    request = Request.find(params[:id])

    if request.user_id != current_user.id || request.has_decided_approval
      render json: "Unauthorized", status: :unauthorized
      return
    end

    request.update(@validated_params_update)
    request.update_documents(@custom_params)

    if request.errors.empty?
      render json: request, serializer: RequestSerializer, status: :ok
    else
      render json: { errors: request.errors },  status: :bad_request
    end
  end

  private

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
        supporting_documents: []
      )
  end

  def validate_params_update
    @validated_params_update = params.require(:request).permit(
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
      :purchase_amount
    )

    @custom_params = params.require(:request).permit(
      :new_vendor_attachment,
      deleted_vendor_attachment: [],
      new_supporting_documents: [],
      deleted_supporting_documents: []
    )
  end

  def pagination_meta(requests) {
    current_page: requests.current_page,
    next_page: requests.next_page,
    total_pages: requests.total_pages,
    total_count: requests.total_count
  }
  end
end
