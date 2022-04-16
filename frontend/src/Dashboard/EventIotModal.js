import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { ModalView } from '../components'
import {
  Stack,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

export default function EventIotModal ({ iotId, open, onClose }) {
  const [events, setEvents] = useState([])
  const [begin, setBegin] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000))
  const [end, setEnd] = useState(new Date())

  const searchEventIot = useCallback(async () => {
    if (!open) {
      return
    }

    try {
      const events = await EventAPI.searchIot(
        iotId,
        begin.toISOString(),
        end.toISOString()
      )

      setEvents(events)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось получить события'
      })
    }
  })

  useEffect(searchEventIot, [begin, end])

  return (
    <ModalView
      title={'События умного устройства'}
      open={open}
      onClose={onClose}
    >
      <Stack direction={'row'} spacing={2}>
        <MobileDatePicker
          label={'Время события "от"'}
          inputFormat={'dd.MM.yyyy'}
          value={begin}
          onChange={setBegin}
          renderInput={(params) => <TextField {...params} />}
        />
        <MobileDatePicker
          label={'Время события "до"'}
          inputFormat={'dd.MM.yyyy'}
          value={end}
          onChange={setEnd}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Тема</TableCell>
            <TableCell>Сообщение</TableCell>
            <TableCell>Время</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(({ subject, text, createAt }) => (
            <TableRow key={createAt}>
              <TableCell>{subject}</TableCell>
              <TableCell>{text}</TableCell>
              <TableCell>{createAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalView>
  )
}

EventIotModal.propTypes = {
  iotId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func
}
