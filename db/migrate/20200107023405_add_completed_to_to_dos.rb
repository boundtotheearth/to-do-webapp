class AddCompletedToToDos < ActiveRecord::Migration[6.0]
  def change
    add_column :to_dos, :completed, :boolean, default: false
  end
end
