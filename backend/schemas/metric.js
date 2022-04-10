const value = {
  description: 'Значение метрики',
  type: 'integer'
}

const createAt = {
  description: 'Время метрики',
  type: 'string',
  format: 'date-time'
}

const begin = {
  description: 'Время метрики "от"',
  type: 'string',
  format: 'date-time'
}

const end = {
  description: 'Время метрики "до"',
  type: 'string',
  format: 'date-time'
}

module.exports = {
  value,
  createAt,
  begin,
  end
}
