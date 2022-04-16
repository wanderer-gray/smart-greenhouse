import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import {
  ModalView,
  LineChart
} from '../components'
import {
  Stack,
  TextField
} from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

export default function ChartIotModal ({ iotId, open, onClose }) {
  const [metrics, setMetrics] = useState([])
  const [begin, setBegin] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000))
  const [end, setEnd] = useState(new Date())

  const searchMetricIot = useCallback(async () => {
    if (!open) {
      return
    }

    try {
      const metrics = await MetricAPI.searchIot(
        iotId,
        begin.toISOString(),
        end.toISOString()
      )

      setMetrics(metrics)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось получить метрики'
      })
    }
  })

  useEffect(searchMetricIot, [begin, end])

  return (
    <ModalView
      title={'Метрики умного устройства'}
      open={open}
      onClose={onClose}
    >
      <Stack direction={'row'} spacing={2}>
        <MobileDatePicker
          label={'Время метрики "от"'}
          inputFormat={'dd.MM.yyyy'}
          value={begin}
          onChange={setBegin}
          renderInput={(params) => <TextField {...params} />}
        />
        <MobileDatePicker
          label={'Время метрики "до"'}
          inputFormat={'dd.MM.yyyy'}
          value={end}
          onChange={setEnd}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>

      <LineChart
        label={'Показания устройства'}
        points={metrics}
        fieldX={'createAt'}
        fieldY={'value'}
      />
    </ModalView>
  )
}

ChartIotModal.propTypes = {
  iotId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func
}
