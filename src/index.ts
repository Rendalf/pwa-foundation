import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import { cube } from './math'
import printMe from './print'

console.log(React, ReactDOM)
console.log('Hello World!')

function component () {
  const element = document.createElement('pre')
  element.innerHTML = _.join([
    `Hello, webpack!`,
    `5 cubed is equal to ${ cube(5) }`,
  ], '\n\n')
  element.classList.add('hello')

  const printButton = document.createElement('button')
  printButton.innerHTML = 'Print'
  printButton.onclick = printMe

  element.appendChild(printButton)

  return element
}

let element = component()
document.body.appendChild(element)

// TODO @rendalf remove that any
declare var module: any
if (module.hot) {
  module.hot.accept('./print', () => {
    console.log('Accepting the updating printMe module')

    document.body.removeChild(element)
    element = component()
    document.body.appendChild(element)
  })
}
