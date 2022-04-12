import React from 'react'
import {
  Paper,
  Tabs,
  Tab
} from '@mui/material'

export default function Dashboard () {
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
      <Tabs
        variant={'scrollable'}
        value={'iots'}
      >
        <Tab
          value={'iots'}
          label={'Устройства'}
        />
        <Tab
          value={'groups'}
          label={'Группы'}
        />
      </Tabs>
    </Paper>
  )
}
