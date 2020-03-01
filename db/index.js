const { Pool } = require('pg')
const config = require('../utils/config')
const logger = require('../utils/logger')

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  connectionTimeoutMillis: 2000
})

pool.on('error', err => {
  logger.error('error on connection pool', err.message)
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  closeDb: () => pool.end()
}