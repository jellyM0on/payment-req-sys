FactoryBot.define do
  factory :user do
    email { "test@mail.com" }
    password { "password" }
    position { "testposition" }
    name { "testname" }
    role { "employee" }
    department { "technical" }

    trait :with_
  end
end
