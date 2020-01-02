class AddPriorityToToDos < ActiveRecord::Migration[6.0]
  def change
    add_column :to_dos, :priority, :integer
  end
end
