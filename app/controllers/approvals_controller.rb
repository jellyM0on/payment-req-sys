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
    updateCurrentStage(approval) &&
    updatePendingApprovals(approval) &&
    updateOverallStatus(approval)

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

  def updatePendingApprovals(current_approval)
    if current_approval.status == "rejected"
      pending_approvals = Approval.where(
        request_id: current_approval.request_id,
        status: "pending"
      )

      pending_approvals.each do |p_approval|
        # p_approval.update(status: "rejected", decided_at: Time.current.to_s)
        p_approval.update(status: "rejected")
      end
    else
      true
    end
  end

  def updateOverallStatus(current_approval)
    if current_approval.stage == "admin"
      request = Request.find(current_approval.request_id)
      if request.update(overall_status: current_approval.status)
        true
      end

    elsif current_approval.status == "rejected"
      request = Request.find(current_approval.request_id)
      if request.update(overall_status: "rejected")
        true
      end

    else
      true
    end
  end

  def updateCurrentStage(current_approval)
    if current_approval.stage == "admin"
      return true
    end

    request = Request.find(current_approval.request_id)

    if request.update(current_stage: current_approval.stage_before_type_cast + 1)
      true
    end
  end
end
