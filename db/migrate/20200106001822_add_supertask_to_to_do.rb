class AddSupertaskToToDo < ActiveRecord::Migration[6.0]
  def change
    add_reference :to_dos, :supertask, foreign_key: { to_table: :to_dos }
  end
end
