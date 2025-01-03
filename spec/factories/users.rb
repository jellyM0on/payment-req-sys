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

    trait :manager_role do
      role { "manager" }
    end

    trait :admin_role do
      role { "admin" }
    end

    trait :technical_department do
      department { "technical" }
    end

    trait :accounting_department do
      department { "accounting" }
    end

    trait :hr_admin_department do
      department { "hr_admin" }
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
