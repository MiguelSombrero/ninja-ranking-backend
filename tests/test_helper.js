const db = require('../db')

const createAccount = (name, username, password) => {
  return {
    text: 'INSERT INTO Account (name, username, passwordHash) VALUES ($1, $2, $3)',
    values: [name, username, password]
  }
}

const initializeDatabase = async () => {
  try {
    await db.query({ text: 'DELETE FROM Account', values: [] })
    await db.query(createAccount('Miika Somero', 'somero', 'miika'))
    await db.query(createAccount('Jukka Jukkanen', 'jukka', 'jukka'))

  } catch (exception) {
    console.log('initializing of test database failed', exception)
  }
}

const accountsInDb = async () => {
  try {
    const { rows } = await db.query({ text: 'SELECT * FROM Account', values: [] })
    return rows

  } catch (exception) {
    console.log('finding accounts failed')
  }
}

module.exports = {
  initializeDatabase,
  accountsInDb
}