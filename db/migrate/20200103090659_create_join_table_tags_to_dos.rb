class CreateJoinTableTagsToDos < ActiveRecord::Migration[6.0]
  def change
    create_join_table :tags, :to_dos do |t|
      # t.index [:tag_id, :to_do_id]
      # t.index [:to_do_id, :tag_id]
    end
  end
end
