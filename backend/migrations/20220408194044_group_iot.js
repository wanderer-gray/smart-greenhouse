/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('group_iot', (table) => {
    table.uuid('iotId').notNullable()
    table.integer('groupId').notNullable()

    table
      .foreign('iotId')
      .references('iotId')
      .inTable('iot')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .foreign('groupId')
      .references('groupId')
      .inTable('group')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    table.primary(['groupId', 'iotId'])
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('group_iot')
