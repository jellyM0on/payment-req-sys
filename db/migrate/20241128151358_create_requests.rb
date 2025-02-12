class CreateRequests < ActiveRecord::Migration[7.2]
  def change
    create_table :requests do |t|
      t.references :user, null: false, foreign_key: { to_table: :users, column: :user_id }
      t.integer :overall_status, null: false
      t.integer :current_stage, null: false

      # vendor
      t.string :vendor_name, null: false
      t.string :vendor_tin, null: false
      t.string :vendor_address, null: false
      t.string :vendor_email, null: false
      t.string :vendor_contact_num, null: false
      t.integer :vendor_certificate_of_reg, null: false

      # payment
      t.timestamp :payment_due_date, null: false
      t.string :payment_payable_to, null: false
      t.integer :payment_mode, null: false
      t.integer :purchase_category, null: false
      t.text :purchase_description, null: false
      t.decimal :purchase_amount, null: false, precision: 20, scale: 2

      t.timestamps
    end
  end
end
