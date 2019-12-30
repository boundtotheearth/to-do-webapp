class CreateToDos < ActiveRecord::Migration[6.0]
  def change
    create_table :to_dos do |t|
      t.text :title
      t.text :description
      t.datetime :start_date
      t.datetime :due_date

      t.timestamps
    end
  end
end
