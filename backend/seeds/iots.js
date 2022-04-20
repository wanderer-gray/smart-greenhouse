const { iot } = require('../enums')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  const iotsToMerge = [
    {
      iotId: '3bef71a1-8bb6-42be-ab4f-7fd5f4e606b9',
      type: iot.LIGHTING,
      title: 'Тестовый. СВЕТ',
      hello: 15, // sec
      min: 0,
      max: 30
    },
    {
      iotId: 'd0600e60-00c2-472b-8fbb-61dd3cf814da',
      type: iot.HUMIDITY,
      title: 'Тестовый. ВЛАЖНОСТЬ',
      hello: 15, // sec
      min: 0,
      max: 30
    },
    {
      iotId: '73f00a0a-4a50-44ce-b56b-0b31af94d355',
      type: iot.TEMPERATURE,
      title: 'Тестовый. ТЕМПЕРАТУРА',
      hello: 15, // sec
      min: 0,
      max: 30
    }
  ]

  return knex('iot')
    .insert(iotsToMerge)
    .onConflict('iotId')
    .merge()
}
