
import React from 'react'
import Nofity from './Nofity'
import Http from './Http'
import Api from './Api'
import Auth from './Auth'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Dashboard from './Dashboard'

function App () {
  return (
    <Nofity>
      <Http>
        <Api>
          <Auth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Dashboard />
            </LocalizationProvider>
          </Auth>
        </Api>
      </Http>
    </Nofity>
  )
}

export default App
