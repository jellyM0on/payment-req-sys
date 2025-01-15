class Request < ApplicationRecord
  belongs_to :user
  has_many :approvals
  has_one_attached :vendor_attachment
  has_many_attached :supporting_documents

   # enums
   enum :overall_status, { pending: 0, accepted: 1, rejected: 2 }
   enum :current_stage, { manager: 0, accountant: 1, admin: 2 }
   enum :vendor_certificate_of_reg, { n_applicable: 0, applicable: 1 }
   enum :payment_mode, { bank_transfer: 0, credit_card: 1, check: 2 }
   enum :purchase_category, { company_events: 0, office_events: 1, trainings: 2, others: 3 }

  # validation
  validates :vendor_name, presence: true, length: { in: 1..100 }
  validates :vendor_tin, presence: true, length: { is: 9 }
  validates :vendor_address, presence: true, length: { in: 1..250 }
  validates :vendor_email, presence: true, length: { in: 1..100 }
  validates :vendor_contact_num, presence: true, length: { in: 1..50 }
  validates :vendor_certificate_of_reg, presence: true
  validates :payment_due_date, presence: true
  validates :payment_payable_to, presence: true, length: { in: 1..100 }
  validates :payment_mode, presence: true
  validates :purchase_description, presence: true, length: { in: 1..500 }
  validates :purchase_amount, presence: true, comparison: { less_than: 1000000000000000000 }
  validates :purchase_category, presence: true

  validates :vendor_attachment, attached: true, content_type: [ "image/png", "image/jpeg", "application/pdf" ],
            size: { less_than: 10.megabytes, message: "File size is too large" }

  validates :supporting_documents,
            content_type: [ "image/png", "image/jpeg", "application/pdf" ],
            size: { less_than: 10.megabytes,  message: "File size is too large" },
            limit: { min: 1, max: 10, message: "Must upload 1 to 10 files" }

  def self.ransackable_attributes(auth_object = nil)
    %w[id overall_status current_stage purchase_category]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[user approvals]
  end

  def format_overall_status
    overall_status.titleize
  end

  def format_current_stage
    current_stage.titleize
  end

  def format_vendor_certificate_of_reg
    case vendor_certificate_of_reg
    when "n_applicable"
      "Not Applicable"
    when "applicable"
      "Applicable"
    end
  end

  def format_payment_mode
    case payment_mode
    when "bank_transfer"
      "Bank Transfer"
    when "credit_card"
      "Credit Card"
    when "check"
      "Check"
    end
  end

  def format_purchase_category
    case purchase_category
    when "company_events"
      "Company Events and Activities"
    when "office_events"
      "Office Events and Activities"
    when "trainings"
      "Trainings and Seminars"
    when "others"
      "Others"
    end
  end

  def format_created_at
    created_at.strftime("%d %B %Y")
  end

  def format_payment_due_date
    payment_due_date.strftime("%d %B %Y")
  end

  # methods
  def self.get_all(params, current_user)
    filter_param = params[:filter_by]

    requests = Request.includes(:user, approvals: :reviewer)

    user_role = current_user.check_role
    user_unspec_role = current_user.check_unspec_role

    case user_role
    when "admin", "accounting_employee", "accounting_manager"
      requests = requests.all

    when "employee"
      requests = requests.where(
        user_id: current_user.id
      )

    when "manager"
      requests = requests.joins(:approvals).where(approvals: { reviewer: current_user.id }).or(Request.where(user: current_user.id)).distinct
    end

    if filter_param == "own_approvals" && @user_role != "admin" && @user_role != "accounting_manager"
      requests = requests.joins(:approvals)
      .where(current_stage: user_unspec_role, approvals: { status: "pending", stage: user_unspec_role })
      .where.not(user_id: current_user.id)
    end

    if filter_param == "own_approvals" && @user_role == "accounting_manager"
      requests = requests.joins(:approvals)
      .where(current_stage: "accountant", approvals: { status: "pending", stage: "accountant" })
      .or(Request.where(current_stage: "manager", approvals: { status: "pending", stage: "manager", reviewer_id: current_user.id }))
      .where.not(user_id: current_user.id)
    end

    if filter_param == "own_approvals" && @user_role == "admin"
      requests = requests.joins(:approvals)
      .where(current_stage: user_unspec_role, approvals: { status: "pending", stage: user_unspec_role })
    end

    if requests.nil?
      render json: { requests: nil, pagination_meta: nil }, status: :ok
      return
    end

    def self.find_enum(input, statuses)
      return nil if input.empty?
      statuses.find_index {  |status| status.include?(input.downcase) }
    end

    def self.match_no_reviewer(input)
      return nil if input.empty?
      input.match?(/t(b|ba)\z?$/i) ? true : nil
    end

    if current_user.role == "employee" && current_user.department != "accounting" && params[:search_by]
      @q = requests.ransack(
      {
        approvals_reviewer_name_cont: params[:search_by],
        g: [ {
          approvals_reviewer_name_blank: match_no_reviewer(params[:search_by]),
          current_stage_not_eq:  match_no_reviewer(params[:search_by]) ? "admin" : nil
        } ],
        overall_status_eq:
          find_enum(
            params[:search_by],
            [ "pending status", "accepted status", "rejected status" ]
          ),
        current_stage_eq:
          find_enum(
            params[:search_by],
            [ "manager stage", "accountant stage", "admin stage" ]
          ),
        purchase_category_eq:
        find_enum(
          params[:search_by],
          [ "company events and activities", "office_events and activities", "trainings and seminars", "others" ]
          ),
        id_eq: params[:search_by]
      },
      { grouping: Ransack::Constants::OR })
    elsif params[:search_by]
      @q = requests.ransack(
      {
        user_name_cont: params[:search_by],
        approvals_reviewer_name_cont: params[:search_by],
        g: [ {
          approvals_reviewer_name_blank: match_no_reviewer(params[:search_by]),
          current_stage_not_eq:  match_no_reviewer(params[:search_by]) ? "admin" : nil
        } ],
        user_department_eq:
          find_enum(
            params[:search_by],
            [ "technical department", "accounting department", "hr and admin department" ]
          ),
        overall_status_eq:
          find_enum(
            params[:search_by],
            [ "pending status", "accepted status", "rejected status" ]
          ),
        current_stage_eq:
          find_enum(
            params[:search_by],
            [ "manager stage", "accountant stage", "admin stage" ]
          ),
        purchase_category_eq:
          find_enum(
            params[:search_by],
            [ "company events and activities", "office_events and activities", "trainings and seminars", "others" ]
          ),
        id_eq: params[:search_by]
      },
      { grouping: Ransack::Constants::OR })
    else
      @q = requests.ransack()
    end

    requests = @q.result(distinct: true)
    requests.order(created_at: :desc).page(params[:page] ? params[:page].to_i: 1).per(params[:limit] || 5)
  end

  def is_user_reviewer(current_user)
    is_reviewer = false
    approvals.each do |approval|
      if approval.reviewer_id == current_user.id || approval.stage == "accountant" && current_user.department == "accounting"
        is_reviewer = true
      end
    end
    is_reviewer
  end

  def is_editable
    is_editable = true
    approvals.each do |approval|
      if approval.status != "pending"
        is_editable = false
      end
    end
    is_editable
  end

  def attach_documents(params)
    if params[:vendor_attachment].present?
      vendor_attachment.purge if vendor_attachment.attached?
      vendor_attachment.attach(params[:vendor_attachment])
    end

    if params[:supporting_documents].present?
      supporting_documents.purge if supporting_documents.attached?
      supporting_documents.attach(params[:supporting_documents])
    end
  end

  def build_approvals(current_user)
    build_manager_approval(current_user)
    build_accountant_approval
    build_admin_approval
  end

  def build_manager_approval(current_user)
    user_role = current_user.check_role
    if user_role == "manager" || user_role == "accounting_manager"
      approvals.build(stage: "manager", reviewer_id: current_user.id, status: "accepted", decided_at: Time.current.to_s)
    elsif user_role == "admin"
      approvals.build(stage: "manager", reviewer_id: nil, status: "accepted", decided_at: Time.current.to_s)
    else
      approvals.build(stage: "manager", reviewer_id: current_user.manager.id, status: "pending")
    end
  end

  def build_accountant_approval
    approvals.build(stage: "accountant", reviewer_id: nil, status: "pending")
  end

  def build_admin_approval
    approvals.build(stage: "admin", reviewer_id: User.find_by(role: "admin").id, status: "pending")
  end

  def has_decided_approval
    has_decided_approval = false

    approvals.each do |approval|
      if approval.status == "accepted" || approval.status == "rejected"
        has_decided_approval = true
        break
      end
    end
    has_decided_approval
  end

  def update_documents(params)
    @new_vendor_attachment = params[:new_vendor_attachment]
    @deleted_vendor_attachment = params[:deleted_vendor_attachment]

    def self.vendor_attachment_is_invalid
      return true if !@new_vendor_attachment.present? && @deleted_vendor_attachment.present?
      false
    end

    if @deleted_vendor_attachment.present? && vendor_attachment_is_invalid
      errors.add(:vendor_attachment, :blank)
    end

    if @new_vendor_attachment.present? && !vendor_attachment_is_invalid
      vendor_attachment.purge
      vendor_attachment.attach(@new_vendor_attachment)
    end

    @deleted_supporting_documents = params[:deleted_supporting_documents]
    @new_supporting_documents = params[:new_supporting_documents]

    def self.supporting_documents_is_invalid
      return true if @new_supporting_documents && @new_supporting_documents.length > 10
      return true if @deleted_supporting_documents.present? &&
        @deleted_supporting_documents.length >= supporting_documents.length &&
        !@new_supporting_documents.present?

      false
    end

    if (@new_supporting_documents.present? || @deleted_supporting_documents.present?) && supporting_documents_is_invalid
      errors.add(:supporting_documents, :limit, message: "Must upload 1 to 10 files")
    end

    if @deleted_supporting_documents.present? && !supporting_documents_is_invalid
      @deleted_supporting_documents.each do | document_id |
        file = supporting_documents.find_by(id: document_id)
        if file
          file.purge
        end
      end
    end

    if @new_supporting_documents.present? && !supporting_documents_is_invalid
      supporting_documents.attach(@new_supporting_documents)
    end
  end
end
