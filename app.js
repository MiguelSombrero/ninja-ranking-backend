const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const accountsRouter = require('./controllers/accounts.js')
const loginRouter = require('./controllers/login')
const tournamentRouter = require('./controllers/tournaments')
const playersRouter = require('./controllers/players')
const resultsRouter = require('./controllers/results')
const obstaclesRouter = require('./controllers/obstacles')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info('connecting to', config.DATABASE_URL)

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/login', loginRouter)
app.use('/accounts', accountsRouter)
app.use('/tournaments', tournamentRouter)
app.use('/players', playersRouter)
app.use('/results', resultsRouter)
app.use('/obstacles', obstaclesRouter)

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`)
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app