class ToDo < ApplicationRecord
  has_and_belongs_to_many :tags
  has_many :subtasks, class_name: "ToDo", foreign_key: "supertask_id"
  belongs_to :supertask, class_name: "ToDo", optional: true

  before_destroy do
    tags.each { |tag| tag.destroy }
    subtasks.each { |subtask| subtask.destroy }
  end
end
