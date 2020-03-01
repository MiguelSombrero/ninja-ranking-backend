const app = require('./app')
const http = require('http')
const db = require('./db')
const config = require('./utils/config')
const logger = require('./utils/logger')
const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
}).on('error', (error) => {
  logger.error('message:', error.message)
  logger.error('stack:', error.stack)
  logger.error('name:', error.name)
}).on('close', () => {
  logger.info('closing server')
  db.closeDb()
})