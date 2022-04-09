/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('metric', (table) => {
    table.increments('metricId').primary()
    table.uuid('iotId').notNullable()
    table.integer('value').notNullable()
    table.timestamp('createAt', { useTz: false }).notNullable()

    table
      .foreign('iotId')
      .references('iotId')
      .inTable('iot')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('metric')
