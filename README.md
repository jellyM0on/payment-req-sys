# README

## About 
This project was made for practice during the first few weeks of my internship at Likha-IT as a software engineer intern. Tested by fellow QA intern in the team. 

It is a multi-role request approval system with a configurable 3-step approval workflow where users can submit and track requests, and those with appropriate roles can submit their approval. 

## Features & Specs
- User Roles
  - There are multiple roles: employee, manager, admin
  - There are multiple departments: Technical, HR and Admin, Accounting
  - All those who are under Accounting are "Accountants", and can be an employee or manager
- Request Submission 
  - All users can submit their requests with the following fields: 
    - Vendor Information: Vendor Name, TIN, Address, Email Address, Contact, Certificate of Registration, Attachment  
    - Payment Instruction: Payment Due Date, Make Payable To, Payment Mode 
    - Payment Description: Category, Description, Amount, Supporting Documents
  - Requests are only editable if they have no approval judgements yet
- Request View 
  - All users can view all their own requests in the their home dashboard
    - Managers can additionally view requests made by employees assigned to them
    - Accountants and Admins can view all requests
  - All users can filter through requests using the search bar which searches the following fields: Request No., Status, Requestor, Category, Department, Current Approval Stage, Participants
- Request Approval 
  - There are multiple stages: manager, accountant, admin
  - Managers can approve requests of employees under them
  - Accountants can approve manager approved requests
  - Admins can approve accountant approved requests 
  - Requests made by managers are auto-approved at the manager stage 
  - Requests made by accountant managers can be approved by any other accountant (employee or manager) in the accounting stage
  - Requests made by admins are auto-approved at the manager stage and requires self-approval at the admin stage
- User Management 
  - Admins can create user accounts and edit existing accounts' assigned role and manager
  
- Entity Relational Diagram 
![paymentsys-erd drawio](https://github.com/user-attachments/assets/f32b5f36-c821-42cc-8d2b-288b4c636e59)

## Out of Scope 
- UI Responsiveness 
- Request Form Drafting
- Deployment

## Documentation
- Request Form 

https://github.com/user-attachments/assets/57dd0b52-ba21-45b7-9108-c64c26a24377

- Request Dashboard (Employee) 
![employee_dashboard](https://github.com/user-attachments/assets/9014e0c3-361a-4fe1-b703-02f8b8dcb1bd)

- Request Dashboard (Manager) 
![manager_dashboard](https://github.com/user-attachments/assets/9724049f-42a8-40c1-adef-77fe78fcc36e)

- Request Dashboard (Accountant & Admin)  
![admin_dashboard](https://github.com/user-attachments/assets/4360854b-b50b-4f39-aeed-f2a5234cfea1)

- Request Dashboard Search 

https://github.com/user-attachments/assets/145ef038-198b-463c-a513-8a58882cfe98

- Approval Flow of an employee made request

https://github.com/user-attachments/assets/eac4bd69-419c-48b2-a124-34e3f3bc5de6

https://github.com/user-attachments/assets/745fd353-1abf-40de-bda2-5069b0ce21e1

- Approval Flow of an accountant-employee made request

https://github.com/user-attachments/assets/23b38908-cbb7-4ce8-a869-f54e97232823

https://github.com/user-attachments/assets/0f752029-40f6-4869-b561-3e1483c1976a

- Approval Flow of a manager made request 

https://github.com/user-attachments/assets/ffbc359f-6959-49ae-a2d9-41cfa20c6073

https://github.com/user-attachments/assets/f2b69226-ceba-46ea-a4cf-ed4138808045

- Approval Flow of an account-manager made request

https://github.com/user-attachments/assets/2a427d43-d008-457d-bfef-02e9ed62255b

https://github.com/user-attachments/assets/c0fae68e-51ec-4fdd-8daf-1cf5f9db2930

- Approval Flow of an admin-made request

https://github.com/user-attachments/assets/cf2d0f12-13d1-4520-b750-11afef56d9d8

https://github.com/user-attachments/assets/a64ff1f5-1d08-4888-a497-3d5d2a59020a

- User Creation and Editing

https://github.com/user-attachments/assets/a3ed390e-502d-466c-b023-ba0c4c875b1d

https://github.com/user-attachments/assets/e0ae94a2-c136-455c-ac65-1fbd8d70e488


## Stack 
- React TypeScript
  - Vibes by freee for CSS
- Ruby on Rails
  - Kaminari gem for pagination
  - Ransack gem for search 
- MySQL

## Local Set up
Prerequisites: 
- Ruby
- Rails 
- Node 
- NPM / Yarn

1. Install backend dependencies: 
    - "bundle install" 
2. Set up database 
    - "rails db:create"
    - "rails db:migrate" 
    - "rails db:seed" to seed admin user 
3. Run api
    - "rails s" 
4. Install frontend dependencies: 
    - "cd ./front"
    - "npm install" 
5. Run frontend 
    - "npm run dev" 
