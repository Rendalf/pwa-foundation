import './styles.css'
import printMe from './print'

function component () {
  const element = document.createElement('div')
  element.innerHTML = `Hello, webpack!`
  element.classList.add('hello')

  const button = document.createElement('button')
  button.innerHTML = 'Click me and check the console! Please'
  button.onclick = printMe

  element.appendChild(button)

  return element
}

let element = component()
document.body.appendChild(element)

if (module.hot) {
  module.hot.accept('./print.js', () => {
    console.log('Accepting the updating printMe module')

    document.body.removeChild(element)
    element = component()
    document.body.appendChild(element)
  })
}
