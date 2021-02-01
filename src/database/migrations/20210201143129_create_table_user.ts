import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user', (table) => {
        table.increments('id').unsigned().primary()
        table.string('email',255).unique().notNullable()
        table.text('password').notNullable()
        table.text('name').notNullable()
        table.date('birthday').notNullable()

        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user')
}

