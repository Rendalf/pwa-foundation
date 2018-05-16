const path = require('path')
const fs = require('fs')
const express = require('express')

const PORT = 3001

const staticPath = path.resolve(__dirname, '..', 'dist')
if (!fs.existsSync(staticPath)) {
  throw new Error(`Cannot launch static server when dir "./dist" doesn't exist`)
}

const staticMiddleware = express.static(staticPath, {
  index: 'index.html',
})

const app = express()
app.use(staticMiddleware)
app.listen(PORT, (...args) => {
  console.log(`Server is running at http://localhost:${ PORT }/`)
})
