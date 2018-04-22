import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

const MAIN_APP_NODE_ID = 'main-app'

export default function launchMainApp () {
  const appNode = window.document.getElementById(MAIN_APP_NODE_ID)

  if (!appNode) {
    throw new Error(`Can't launch main app: node #${ MAIN_APP_NODE_ID } is not found`)
  }

  render(
    (<App />),
    appNode,
  )
}
