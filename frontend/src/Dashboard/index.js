import React, { useState } from 'react'
import { useAuth } from '../Auth'
import {
  Paper,
  Tabs,
  Tab,
  Button
} from '@mui/material'
import { styled } from '@mui/system'

const DivSpaceBetween = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default function Dashboard () {
  const auth = useAuth()

  const [page, setPage] = useState('iots')

  return (
    <Paper
      sx={{
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        mx: 'auto',
        maxWidth: 960
      }}
    >
      <DivSpaceBetween>
        <Tabs
          variant={'scrollable'}
          value={page}
        >
          <Tab
            value={'iots'}
            label={'Устройства'}
            onClick={() => setPage('iots')}
          />
          <Tab
            value={'groups'}
            label={'Группы'}
            onClick={() => setPage('groups')}
          />
        </Tabs>

        <Button onClick={auth.logout}>
          Выйти
        </Button>
      </DivSpaceBetween>

    </Paper>
  )
}
