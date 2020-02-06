# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_01_30_025721) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "tags", force: :cascade do |t|
    t.bigint "to_do_id", null: false
    t.text "tag"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["to_do_id"], name: "index_tags_on_to_do_id"
  end

  create_table "tags_to_dos", id: false, force: :cascade do |t|
    t.bigint "tag_id", null: false
    t.bigint "to_do_id", null: false
  end

  create_table "to_dos", force: :cascade do |t|
    t.text "title"
    t.text "description"
    t.datetime "start_date"
    t.datetime "due_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "priority"
    t.bigint "supertask_id"
    t.boolean "completed", default: false
    t.index ["supertask_id"], name: "index_to_dos_on_supertask_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "tags", "to_dos"
  add_foreign_key "to_dos", "to_dos", column: "supertask_id"
end
