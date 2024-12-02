class CreateApprovals < ActiveRecord::Migration[7.2]
  def change
    create_table :approvals do |t|
      t.references :request, null: false, foreign_key: { to_table: :requests, column: :request_id }
      t.integer :stage, null: false 
      t.references :reviewer, foreign_key: { to_table: :users, column: :user_id }
      t.integer :status, null: false
      t.timestamp :decided_at

      t.timestamps
    end
  end
end
