const db = require('../db')
const bcrypt = require('bcrypt')

const createAccount = (id, name, username, password) => {
  return {
    text: 'INSERT INTO Account (id, name, username, passwordHash) VALUES ($1, $2, $3, $4)',
    values: [id, name, username, password]
  }
}

const createTournament = (id, account_id, name, created, active) => {
  return {
    text: 'INSERT INTO Tournament(id, account_id, name, created, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values: [id, account_id, name, created, active]
  }
}

const emptyDatabase = async () => {
  await db.query('DELETE FROM Account')
  await db.query('DELETE FROM Tournament')
}

const initializeAccounts = async () => {
  await db.query(createAccount(1, 'Miika Somero', 'somero', await bcrypt.hash('miika', 10)))
  await db.query(createAccount(2, 'Jukka Jukkanen', 'jukka', await bcrypt.hash('jukka', 10)))
}

const initializeTournaments = async () => {
  await db.query(createTournament(3, 1, 'Myllypuro Open', new Date(), true))
  await db.query(createTournament(4, 1, 'Turnajaiset', new Date(), false))
  await db.query(createTournament(5, 2, 'Kilpailut', new Date(), true))
}

const accountsInDb = async () => {
  const { rows } = await db.query('SELECT * FROM Account')
  return rows
}

const tournamentsInDb = async () => {
  const { rows } = await db.query('SELECT * FROM Tournament')
  return rows
}

module.exports = {
  initializeAccounts,
  initializeTournaments,
  emptyDatabase,
  accountsInDb,
  tournamentsInDb
}