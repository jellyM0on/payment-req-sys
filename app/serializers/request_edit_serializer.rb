class RequestEditSerializer < ActiveModel::Serializer
  attributes :id,
  :vendor_name, :vendor_tin, :vendor_address, :vendor_email, :vendor_contact_num, :vendor_certificate_of_reg,
  :payment_payable_to, :payment_mode, :purchase_description, :purchase_amount, :purchase_category, :payment_due_date,
  :overall_status, :current_stage,
  :vendor_attachment, :supporting_documents

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
end
