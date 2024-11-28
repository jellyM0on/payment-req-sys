class CreateRequestStats < ActiveRecord::Migration[7.2]
  def change
    create_table :request_stats do |t|
      t.integer :request_id, null: false
      t.integer :approval_stage, null: false 
      t.integer :user_id
      t.integer :status, null: false
      t.timestamp :approval_date

      t.timestamps
    end
  end
end
