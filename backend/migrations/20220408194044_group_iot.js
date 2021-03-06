/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('group_iot', (table) => {
    table.integer('groupId').notNullable().primary()
    table.uuid('iotId').notNullable()

    table
      .foreign('groupId')
      .references('groupId')
      .inTable('group')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .foreign('iotId')
      .references('iotId')
      .inTable('iot')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    table.unique(['iotId', 'groupId'])
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('group_iot')
