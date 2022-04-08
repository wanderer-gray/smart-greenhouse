/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) =>
  knex.schema.createTable('group', (table) => {
    table.increments('groupId').primary()
    table.integer('userId').notNullable()
    table.string('title').notNullable()

    table
      .foreign('userId')
      .references('userId')
      .inTable('user')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    table.unique(['userId', 'title'])
  })

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = (knex) =>
  knex.schema.dropTable('group')
