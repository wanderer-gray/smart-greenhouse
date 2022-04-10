
import React from 'react'
import Nofity from './Nofity'
import Http from './Http'
import Api from './Api'
import Auth from './Auth'

function App () {
  return (
    <Nofity>
      <Http>
        <Api>
          <Auth />
        </Api>
      </Http>
    </Nofity>
  )
}

export default App
