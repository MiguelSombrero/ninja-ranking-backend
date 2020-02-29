const { Pool } = require('pg')
const config = require('../utils/config')

const pool = new Pool({
  connectionString: config.CONNECTION_STRING
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}