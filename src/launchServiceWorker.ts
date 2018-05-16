import runtime from 'serviceworker-webpack-plugin/lib/runtime'

function launchServiceWorker () {
  if ('serviceWorker' in window.navigator) {
    runtime.register().catch((err) => {
      console.error('Service worker registration failed:', err)
    })
  }
}

export default launchServiceWorker
