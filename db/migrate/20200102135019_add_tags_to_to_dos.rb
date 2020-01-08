class AddTagsToToDos < ActiveRecord::Migration[6.0]
  def change
    add_column :to_dos, :tags, :text, array: true, default: []
  end
end
