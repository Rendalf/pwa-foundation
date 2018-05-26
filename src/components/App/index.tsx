import React from 'react'
import { hot } from 'react-hot-loader'
import swRuntime from 'serviceworker-webpack-plugin/lib/runtime'
import About from 'components/About'
import PushRegistrator from 'components/Push'

const IS_SW_SUPPORTED = 'serviceWorker' in window.navigator && window.isSecureContext
const IS_PUSH_SUPPORTED = IS_SW_SUPPORTED && 'PushManager' in window

type SwRegistrationStatus =
  | 'not_initialized'
  | 'not_supported'
  | 'installed'
  | 'failed'
type AppState = {
  swRegistrationStatus: SwRegistrationStatus
  swRegistration: ServiceWorkerRegistration | null
}

class AppComponent extends React.Component<{}, AppState> {
  state: AppState = {
    swRegistrationStatus: IS_SW_SUPPORTED ? 'not_initialized' : 'not_supported',
    swRegistration: null,
  }

  componentDidMount () {
    if (this.state.swRegistrationStatus === 'not_initialized') {
      this.registerServiceWorker()
    }
  }

  private registerServiceWorker () {
    swRuntime.register()
      .then((swRegistration) => {
        this.setState({
          swRegistration,
          swRegistrationStatus: 'installed',
        })
      })
      .catch((err) => {
        console.error('Service worker registration failed:', err)
        this.setState({
          swRegistrationStatus: 'failed',
        })
      })
  }

  render () {
    const { swRegistrationStatus, swRegistration } = this.state

    return (
      <>
        <h1>Hello PWA</h1>
        <About />
        { IS_PUSH_SUPPORTED && swRegistrationStatus === 'installed' && swRegistration && (
          <PushRegistrator swRegistration={ swRegistration } />
        )}
      </>
    )
  }
}

const App = hot(module)(AppComponent)
export default App
