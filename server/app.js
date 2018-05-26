const path = require('path')
const fs = require('fs')
const express = require('express')
const parseArgs = require('minimist')

const pushApp = require('./push')

const cliArgs = parseArgs(process.argv.slice(2))

const PORT = cliArgs.port || 3001
const PUSH_API_PREFIX = '/api/v1/push'

const server = express()


// static
const staticPath = path.resolve(__dirname, '..', 'dist')
const staticMiddleware = express.static(staticPath, {
  index: 'index.html',
})
server.use(staticMiddleware)


// push api
const router = express.Router()
pushApp(router)
server.use(PUSH_API_PREFIX, router)


// launch server
server.listen(PORT, (...args) => {
  const serverUrl = `http://localhost:${ PORT }`

  console.log(`Static server is running at ${ serverUrl }/`)
  console.log(`Push server is running at ${ serverUrl }${ PUSH_API_PREFIX }`)
})
