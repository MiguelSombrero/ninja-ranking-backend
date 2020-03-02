const db = require('../db')

const executeQuery = async (query, next) => {
  const client = await db.getClient()

  try {
    const { rows } = await client.query(query)
    return rows

  } catch (exception) {
    next(exception)

  } finally {
    client.release()
  }
}

const executeMultipleQueries = async (queries, next) => {
  const client = await db.getClient()

  try {
    client.query('BEGIN')
    await queries.map(query => client.query(query))
    client.query('COMMIT')
    return true

  } catch (exception) {
    client.query('ROLLBACK')
    next(exception)

  } finally {
    client.release()
  }
}

module.exports = {
  executeQuery,
  executeMultipleQueries
}