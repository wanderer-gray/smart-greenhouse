/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('iot_owner', (table) => {
    table.uuid('iotId').notNullable().primary()
    table.integer('userId').notNullable()

    table
      .foreign('iotId')
      .references('iotId')
      .inTable('iot')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .foreign('userId')
      .references('userId')
      .inTable('user')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    table.unique(['userId', 'iotId'])
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('iot_owner')
