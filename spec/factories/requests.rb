FactoryBot.define do
  factory :request do
    overall_status { "pending" }
    current_stage { "manager" }

    vendor_name { Faker::Name.name }
    vendor_tin { "123456789" }
    vendor_address { Faker::Address.street_address }
    vendor_email { Faker::Internet.email }
    vendor_contact_num { "09191111111" }
    vendor_certificate_of_reg { %w[n_applicable applicable].sample  }

    payment_due_date { Faker::Date.future }
    payment_payable_to { Faker::Name.name }
    payment_mode { %w[bank_transfer credit_card check].sample }
    purchase_category { %w[company_events office_events trainings others].sample }
    purchase_description { Faker::Lorem.sentence }
    purchase_amount { 20000 }

    user

    # request = FactoryBot.create(:request, user: user)

    transient do
      vendor_attacments_count { 1 }
      supporting_documents_count { 10 }
    end

    after(:create) do |request, eval|
      eval.vendor_attachments_count.times do
        request.vendor_attachment.attach(
          io: File.open(Rails.root.join("spec", "fixtures", "files", "test.png")),
          filename: "test.png",
          content_type: "image/png"
        )
      end

      eval.supporting_documents_count.times do
        request.supporting_documents_count.times do
          request.supporting_documents.attach(
            io: File.open(Rails.root.join("spec", "fixtures", "files", "test.png")),
            filename: "test.png",
            content_type: "image/png"
          )
      end
     end
    end
  end
end
