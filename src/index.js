import './styles.css'
import printMe from './print'
import { cube } from './math'

function component () {
  const element = document.createElement('pre')
  element.innerHTML = [
    `Hello, webpack!`,
    `5 cubed is equal to ${ cube(5) }`,
  ].join('\n\n')
  element.classList.add('hello')

  const printButton = document.createElement('button')
  printButton.innerHTML = 'Print'
  printButton.onclick = printMe

  element.appendChild(printButton)

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
