class CreateAssignedManagers < ActiveRecord::Migration[7.2]
  def change
    create_table :assigned_managers do |t|
      t.integer :user_id, null: false 
      t.integer :manager_id, null: false 

      t.timestamps
    end
  end
end
