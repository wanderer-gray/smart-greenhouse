const existsKnex = (subQuery, knex) => {
  const alias = 'exists'

  return knex.first(knex.raw('exists ? as ??', [subQuery, alias]))
    .then(({ [alias]: exists }) => exists)
}

module.exports = {
  existsKnex
}
