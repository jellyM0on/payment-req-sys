class RequestSerializer < ActiveModel::Serializer
  attributes :id, :user_id,
  :vendor_name, :vendor_tin, :vendor_address, :vendor_email, :vendor_contact_num, :vendor_certificate_of_reg,
  :payment_payable_to, :payment_mode, :purchase_description, :purchase_amount, :purchase_category, :payment_due_date,
  :overall_status, :current_stage, :created_at, 
  :vendor_attachment, :supporting_documents

  has_many :approvals, serializer: ApprovalSerializer

  def vendor_attachment
    [
      {
        id: object.vendor_attachment.id, 
        name: object.vendor_attachment.filename.to_s, 
        url: Rails.application.routes.url_helpers.url_for(object.vendor_attachment)
      }
    ]
  end

  def supporting_documents
    object.supporting_documents.map do | doc |
      {
        id: doc.id, 
        name: doc.filename.to_s,
        url: Rails.application.routes.url_helpers.url_for(doc)
      }
    end
  end
  
  def overall_status
    object.format_overall_status
  end

  def purchase_category
    object.format_purchase_category
  end

  def current_stage
    object.format_current_stage
  end

  def payment_mode
    object.format_payment_mode
  end

  def vendor_certificate_of_reg
    object.format_vendor_certificate_of_reg
  end

  def created_at
    object.format_created_at
  end

  def payment_due_date
    object.format_payment_due_date
  end
end
