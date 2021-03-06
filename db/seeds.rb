# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
2.times do |i|
  @todo = ToDo.create(
    title: "Test Task",
    description: "This is a test task",
    start_date: DateTime.new(2019, 9, 1, 17, 30),
    due_date: DateTime.new(2019, 9, 2, 10, 45),
    priority: 0,
    supertask_id: 86
  )

  @todo.tags.create({
    to_do_id: @todo.id,
    tag: "test"
  })

  @todo.tags.create({
    to_do_id: @todo.id,
    tag: "tag"
  })

end
