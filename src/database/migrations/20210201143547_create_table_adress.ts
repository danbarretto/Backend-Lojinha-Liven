import * as Knex from "knex";


export async function up(knex: Knex) {
    return knex.schema.createTable('address', (table) => {
        table.increments('id').primary()
        table.integer('userId').unsigned()
        table.text('cep').notNullable()
        table.text('state').notNullable()
        table.text('city').notNullable()
        table.text('addressName').notNullable()
        table.integer('addressNumber').notNullable()
        table.text('complement')
        table.foreign('userId').references('id').inTable('user').onDelete('cascade')

    })

}


export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('address')
}

