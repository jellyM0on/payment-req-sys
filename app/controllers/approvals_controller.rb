class ApprovalsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_role
  before_action :validate_params, only: [ :update ]


  def update
    approval = Approval.find(params[:id])
    previous_approval = Approval.find_by(
      request_id: approval.request_id,
      stage: approval.stage_before_type_cast - 1
    )

    if (@user_role == "manager" && approval.reviewer_id != current_user.id) ||
      (approval.stage != @user_role && (current_user.department != "accounting" && current_user.role != "manager")) ||
      (approval.request.user == current_user && current_user.role != "admin")||
      approval.status != "pending" ||
      (previous_approval && previous_approval.status == "pending")

      render json: "Unauthorized", status: :unauthorized
      return
    end

    if approval.update(@validated_params.merge({ decided_at: Time.current.to_s, reviewer_id: current_user.id })) &&
    approval.update_current_stage(approval) &&
    approval.update_pending_approvals(approval) &&
    approval.update_overall_status(approval)

      approval.request.reload

      render json: approval.request, serializer: RequestSerializer, status: :ok
    else
      render json: { errors: approval.errors.full_messages },  status: :bad_request
    end
  end

  private

  def check_role
    if current_user.department == "accounting"
      @user_role = "accountant"
    else
      @user_role = current_user.role
    end
  end

  def validate_params
    @validated_params = params.require(:approval).permit(:status)
  end
end
