import * as React from 'react'
import { hot } from 'react-hot-loader'
import About from 'components/About'

const AppComponent: React.StatelessComponent = () => {
  return (
    <>
      <h1>Hello PWA</h1>
      <About />
    </>
  )
}

const App = hot(module)(AppComponent)
export default App
