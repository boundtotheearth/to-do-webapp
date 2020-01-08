class CreateTags < ActiveRecord::Migration[6.0]
  def change
    create_table :tags do |t|
      t.references :to_do, null: false, foreign_key: true
      t.text :tag

      t.timestamps
    end
  end
end
