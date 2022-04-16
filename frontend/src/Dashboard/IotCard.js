import React, {
  useState,
  useMemo,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import {
  iotUtils,
  useDebounce
} from '../utils'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Slider,
  IconButton
} from '@mui/material'
import MetricIotModal from './MetricIotModal'
import EventIotModal from './EventIotModal'
import ChartIotModal from './ChartIotModal'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CampaignIcon from '@mui/icons-material/Campaign'
import ShowChartIcon from '@mui/icons-material/ShowChart'

function MetricIotButton ({ iotId }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <MenuBookIcon />
      </IconButton>
      <MetricIotModal
        iotId={iotId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

MetricIotButton.propTypes = {
  iotId: PropTypes.string
}

function EventIotButton ({ iotId }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <CampaignIcon />
      </IconButton>
      <EventIotModal
        iotId={iotId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

EventIotButton.propTypes = {
  iotId: PropTypes.string
}

function ChartIotButton ({ iotId }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <ShowChartIcon />
      </IconButton>
      <ChartIotModal
        iotId={iotId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

ChartIotButton.propTypes = {
  iotId: PropTypes.string
}

export default function IotCard ({ typesMap, iot, onUpdate, onOwnerDelete }) {
  const [updatedIot, setUpdatedIot] = useState(iot)

  const debouncedIot = useDebounce(updatedIot, 500)

  const iotId = useMemo(() => updatedIot.iotId, [updatedIot])
  const type = useMemo(() => updatedIot.type, [updatedIot])
  const title = useMemo(() => updatedIot.title, [updatedIot])
  const hello = useMemo(() => updatedIot.hello, [updatedIot])
  const min = useMemo(() => updatedIot.min, [updatedIot])
  const max = useMemo(() => updatedIot.max, [updatedIot])

  const limits = iotUtils.getLimits(type)

  const setIotProps = (props) => setUpdatedIot({
    ...updatedIot,
    ...props
  })

  const update = useCallback(async () => {
    if (iotUtils.equal(iot, debouncedIot)) {
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
    <Card>
      <CardHeader
        title={
          <TextField
            size={'small'}
            fullWidth={true}
            placeholder={'Название'}
            value={title}
            onChange={(event) => setIotProps({ title: event.target.value })}
          />
        }
        subheader={typesMap[type]?.title ?? type}
        action={
          <IconButton onClick={ownerDelete}>
            <DeleteIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Typography>
          Таймер обновления {hello} (сек)
        </Typography>
        <Slider
          size={'small'}
          min={limits.hello.min}
          max={limits.hello.max}
          value={hello}
          onChange={(_, hello) => setIotProps({ hello })}
        />

        <Typography sx={{ mt: 1 }}>
          Критический показатель минимума {min}
        </Typography>
        <Typography>
          Критический показатель максимума {max}
        </Typography>
        <Slider
          size={'small'}
          min={limits.min}
          max={limits.max}
          value={[min, max]}
          onChange={(_, [min, max]) => setIotProps({ min, max })}
        />
      </CardContent>
      <CardActions disableSpacing={true}>
        <MetricIotButton iotId={iotId} />
        <EventIotButton iotId={iotId} />
        <ChartIotButton iotId={iotId} />
      </CardActions>
    </Card>
  )
}

IotCard.propTypes = {
  typesMap: PropTypes.object,
  iot: PropTypes.shape({
    iotId: PropTypes.string,
    type: PropTypes.number,
    title: PropTypes.string,
    hello: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number
  }),
  onUpdate: PropTypes.func,
  onOwnerDelete: PropTypes.func
}
