FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    role { "employee" }
    department { "technical" }
    email { Faker::Internet.email }
    password { "password" }
    position { "Test Position" }

    trait :employee_role do
      role { "employee" }
    end

    after(:build) do |user|
      if user.role == "employee"
        manager = create(:user, role: "manager", department: user.department)
        user.manager_id = manager.id
        create(:manager_assignment, user: user, manager: manager)
      end
    end
  end

  factory :manager_assignment do
   user
   manager { create(:user, role: "manager") }
 end
end
