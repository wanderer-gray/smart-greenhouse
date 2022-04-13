import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { useDebounce } from '../utils'
import { type as iotTypeEnum } from '../enums/iot'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CampaignIcon from '@mui/icons-material/Campaign'
import ShowChartIcon from '@mui/icons-material/ShowChart'

const equalIots = (left, right) =>
  left.title === right.title &&
  left.hello === right.hello &&
  left.min === right.min &&
  left.max === right.max

const getMinMaxByType = (type) => {
  return {
    [iotTypeEnum.LIGHTING]: {
      min: 0,
      max: 24 * 60 * 60
    },
    [iotTypeEnum.HUMIDITY]: {
      min: 0,
      max: 100
    },
    [iotTypeEnum.TEMPERATURE]: {
      min: -100,
      max: +100
    }
  }[type]
}

export default function Iot ({
  iotId,
  types,
  type,
  title,
  hello,
  min,
  max,
  onUpdate,
  onOwnerDelete
}) {
  const [iot, setIot] = useState({
    title,
    hello,
    min,
    max
  })

  const setIotProps = (props) => setIot({
    ...iot,
    ...props
  })

  const setTitle = (title) => setIotProps({ title })
  const setHello = (hello) => setIotProps({ hello })
  const setMin = (min) => {
    const { max } = iot

    setIotProps({
      min: Math.min(min, max),
      max: Math.max(min, max)
    })
  }
  const setMax = (max) => {
    const { min } = iot

    setIotProps({
      min: Math.min(min, max),
      max: Math.max(min, max)
    })
  }

  const debouncedIot = useDebounce(iot, 500)

  const update = useCallback(async () => {
    if (equalIots(iot, debouncedIot)) {
      return
    }

    try {
      await IotsAPI.update(iotId, debouncedIot)

      onUpdate()
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось обновить устройство'
      })
    }
  })

  const ownerDelete = useCallback(async () => {
    try {
      await IotsAPI.ownerDelete(iotId)

      onOwnerDelete()
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось отвязать устройство'
      })
    }
  })

  useEffect(update, [debouncedIot])

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={
          <TextField
            size={'small'}
            fullWidth={true}
            placeholder={'Название'}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        }
        subheader={types[type]?.title ?? type}
        action={
          <IconButton onClick={ownerDelete}>
            <DeleteIcon />
          </IconButton>
        }
      />
      <CardContent>
        <TextField
          sx={{ mb: 1 }}
          size={'small'}
          type={'number'}
          inputProps={{
            min: 1,
            max: 24 * 60 * 60
          }}
          fullWidth={true}
          placeholder={'Таймер обновления (сек.)'}
          value={hello}
          onChange={(event) => setHello(event.target.value)}
        />
        <TextField
          sx={{ mb: 1 }}
          size={'small'}
          type={'number'}
          inputProps={getMinMaxByType(type)}
          fullWidth={true}
          placeholder={'Критический показатель минимума'}
          value={min}
          onChange={(event) => setMin(event.target.value)}
        />
        <TextField
          size={'small'}
          type={'number'}
          inputProps={getMinMaxByType(type)}
          fullWidth={true}
          placeholder={'Критический показатель максимума'}
          value={max}
          onChange={(event) => setMax(event.target.value)}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton>
          <MenuBookIcon />
        </IconButton>
        <IconButton>
          <CampaignIcon />
        </IconButton>
        <IconButton>
          <ShowChartIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

Iot.propTypes = {
  iotId: PropTypes.string,
  types: PropTypes.object,
  type: PropTypes.number,
  title: PropTypes.string,
  hello: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  onUpdate: PropTypes.func,
  onOwnerDelete: PropTypes.func
}
