class CreateManagerAssignments < ActiveRecord::Migration[7.2]
  def change
    create_table :manager_assignments do |t|
      t.references :user, null: false, foreign_key: { to_table: :users, column: :user_id }
      t.references :manager, null: false, foreign_key: { to_table: :users, column: :user_id }

      t.timestamps
    end
  end
end
