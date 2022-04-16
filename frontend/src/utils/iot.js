import { type as iotTypeEnum } from '../enums/iot'

const equal = (left, right) =>
  left.title === right.title &&
  left.hello === right.hello &&
  left.min === right.min &&
  left.max === right.max

const getMinLimit = (type) => {
  return {
    [iotTypeEnum.LIGHTING]: 0,
    [iotTypeEnum.HUMIDITY]: 0,
    [iotTypeEnum.TEMPERATURE]: -100
  }[type] ?? 0
}

const getMaxLimit = (type) => {
  return {
    [iotTypeEnum.LIGHTING]: 24 * 60 * 60,
    [iotTypeEnum.HUMIDITY]: 100,
    [iotTypeEnum.TEMPERATURE]: 100
  }[type] ?? 0
}

const getLimits = (type) => {
  return {
    hello: {
      min: 1,
      max: 30 * 60
    },
    min: getMinLimit(type),
    max: getMaxLimit(type)
  }
}

export default {
  equal,
  getLimits
}
