const { Pool } = require('pg')
const config = require('../utils/config')

const pool = new Pool({
  connectionString: config.DATABASE_URL
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}