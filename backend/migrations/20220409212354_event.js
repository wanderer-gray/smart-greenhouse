/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('event', (table) => {
    table.integer('metricId').notNullable().primary()
    table.text('subject').notNullable()
    table.text('text').notNullable()

    table
      .foreign('metricId')
      .references('metricId')
      .inTable('metric')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('event')
