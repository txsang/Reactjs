import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
import { routes, Root } from 'src/routes'
import { store } from 'src/reducers'

ReactDOM.render((
  <CookiesProvider>
    <Root store={store} routes={routes} />
  </CookiesProvider>
), document.getElementById('root'))
