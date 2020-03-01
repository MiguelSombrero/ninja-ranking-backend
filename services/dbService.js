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

module.exports = { executeQuery }