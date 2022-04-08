/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('iot', (table) => {
    table.uuid('iotId').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('title').notNullable()
    table.integer('type').notNullable()
    table.integer('hello').notNullable()
    table.integer('min').notNullable()
    table.integer('max').notNullable()
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('iot')
