import './style.css'
import printMe from './print'

function component () {
  const element = document.createElement('div')
  element.innerHTML = `Hello, webpack!`
  element.classList.add('hello')

  const button = document.createElement('button')
  button.innerHTML = 'Click me and check the console'
  button.onclick = printMe

  element.appendChild(button)

  return element
}

document.body.appendChild(component())
