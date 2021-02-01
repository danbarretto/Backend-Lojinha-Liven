exports.up = (knex) => {
  knex.schema.createTable("user", (table) => {
    table.increments("id")
    table.text("email").unique().notNullable()
    table.text("password").notNullable()
    table.text("name").notNullable()
    table.date("birthday").notNullable()
    table.text("address").notNullable()
    table.text("cep").notNullable()

    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = (knex) => knex.schema.dropTable("user")
