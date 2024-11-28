# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

testuser = User.create(
  name: "test", 
  position: "Dev", 
  role: 0, 
  department: 0, 
  email: "test15@mail.com", 
  password: "password", 
)

testmanager = User.create(
  name: "test", 
  position: "ManagerDev", 
  role: 1, 
  department: 0, 
  email: "test19@mail.com", 
  password: "password", 
)

testassignedmanager = AssignedManager.create(
  user_id: testuser.id, 
  manager_id: testmanager.id
)

testrequest = Request.create(
  user_id: testuser.id, 
  overall_status: 0, 
  current_stage: 0, 
  vendor_name: "vendor", 
  vendor_tin: "123456789", 
  vendor_email: "vendor@mail.com",
  vendor_address: "address", 
  vendor_contact_num: "0912345678",
  vendor_certificate_of_reg: 0, 
  vendor_attachment: 0, 
  payment_due_date: nil, 
  payment_payable_to: "test", 
  payment_mode: 0, 
  purchase_category: 0, 
  purchase_description: "test description", 
  purchase_amount: 1000, 
)
 
testreqstat =  RequestStat.create(
  request_id: testrequest.id,
  approval_stage: 0,
  user_id: testmanager.id, 
  status: 0,
  approval_date: nil,
)
