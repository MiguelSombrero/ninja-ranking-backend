const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const accountsRouter = require('./controllers/accounts.js')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info('connecting to', config.MONGODB_URI)

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/accounts', accountsRouter)

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`)
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app