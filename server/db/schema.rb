# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_04_26_213656) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "data_migrations", primary_key: "version", id: :string, force: :cascade do |t|
  end

  create_table "stock_options", force: :cascade do |t|
    t.string "symbol", null: false
    t.string "name", null: false
    t.index ["symbol"], name: "index_stock_options_on_symbol", unique: true
  end

  create_table "trade_plan_stock_options", force: :cascade do |t|
    t.bigint "trade_plan_id", null: false
    t.bigint "stock_option_id", null: false
    t.index ["stock_option_id"], name: "index_trade_plan_stock_options_on_stock_option_id"
    t.index ["trade_plan_id", "stock_option_id"], name: "index_on_trade_plan_id_and_stock_option_id", unique: true
    t.index ["trade_plan_id"], name: "index_trade_plan_stock_options_on_trade_plan_id"
  end

  create_table "trade_plans", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.integer "amount", null: false
    t.boolean "active", default: true, null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_trade_plans_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "stripe_customer_id", null: false
    t.integer "balance_in_cents", default: 0, null: false
    t.index ["email"], name: "index_users_on_email"
  end

  add_foreign_key "trade_plan_stock_options", "stock_options"
  add_foreign_key "trade_plan_stock_options", "trade_plans"
  add_foreign_key "trade_plans", "users"
end
