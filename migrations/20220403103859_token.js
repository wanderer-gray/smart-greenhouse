/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('token', (table) => {
    table.string('email').primary()
    table.integer('token').unsigned().notNullable()
    table.timestamp('createdAt', { useTz: false }).notNullable()
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('token')
