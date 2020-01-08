class RemoveTagsFromToDos < ActiveRecord::Migration[6.0]
  def change

    remove_column :to_dos, :tags, :text
  end
end
