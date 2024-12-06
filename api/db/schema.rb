# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_28_163844) do
  create_table "approvals", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "request_id", null: false
    t.integer "stage", null: false
    t.bigint "reviewer_id"
    t.integer "status", null: false
    t.timestamp "decided_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["request_id"], name: "index_approvals_on_request_id"
    t.index ["reviewer_id"], name: "index_approvals_on_reviewer_id"
  end

  create_table "manager_assignments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "manager_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["manager_id"], name: "index_manager_assignments_on_manager_id"
    t.index ["user_id"], name: "index_manager_assignments_on_user_id"
  end

  create_table "requests", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "overall_status", null: false
    t.integer "current_stage", null: false
    t.string "vendor_name", null: false
    t.string "vendor_tin", null: false
    t.string "vendor_address", null: false
    t.string "vendor_email", null: false
    t.string "vendor_contact_num", null: false
    t.integer "vendor_certificate_of_reg", null: false
    t.integer "vendor_attachment", null: false
    t.timestamp "payment_due_date"
    t.string "payment_payable_to", null: false
    t.integer "payment_mode", null: false
    t.integer "purchase_category", null: false
    t.text "purchase_description", null: false
    t.decimal "purchase_amount", precision: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_requests_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "position", null: false
    t.integer "role", null: false
    t.integer "department", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "approvals", "requests"
  add_foreign_key "approvals", "users", column: "reviewer_id"
  add_foreign_key "manager_assignments", "users"
  add_foreign_key "manager_assignments", "users", column: "manager_id"
  add_foreign_key "requests", "users"
end
