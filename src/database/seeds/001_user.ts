import * as Knex from "knex";

export async function seed(knex: Knex) {
    // Deletes ALL existing entries
    await knex("user").del();

    // Inserts seed entries
    await knex("user").insert([
        { name: "Daniel Sá", email: 'danielbarretto@usp.br', password: 'temp', birthday: new Date('1998-11-04:01:00') },
        { name: "Juliana Ferreira", email: 'julianaferreira@usp.br', password: 'temp2', birthday: new Date('1999-10-06:01:00') },
    ]);
};
