FactoryBot.define do
  factory :approval do
    stage { "manager" }
    status { "pending" }
    decided_at { nil }

    request { nil }
    reviewer { nil }
  end
end
