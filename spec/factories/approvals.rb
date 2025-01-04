FactoryBot.define do
  factory :approval do
    stage { "manager" }
    status { "pending" }
    decided_at { nil }

    request { nil }
    reviewer { nil }

    trait :manager_stage do
      stage { "manager" }
    end

    trait :accountant_stage do
      stage { "accountant" }
    end

    trait :admin_stage do
      stage { "admin" }
    end

    trait :pending_status do
      status { "pending" }
    end

    trait :approved_status do
      status { "approved" }
    end

    trait :rejected_status do
      status { "rejected" }
    end

    trait :has_decided_at do
      decided_at { Faker::Date.past }
    end
  end
end
