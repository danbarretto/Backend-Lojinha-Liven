import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("address").del();

    // Inserts seed entries
    await knex("address").insert([
        { userId: 7, cep: "13561-090", addressName:'Rua Profa. Nicoleta Stella Germano', addressNumber:60, complement:'apto 103' },
        { userId: 8, cep: "13566-580", addressName:'Rua Miguel Alves Margarido', addressNumber:61, complement:'apto 4' }
    ]);
};
