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

const createObstacle = (id, tournament_id, name) => {
  return {
    text: 'INSERT INTO Obstacle(id, tournament_id, name) VALUES ($1, $2, $3) RETURNING *',
    values: [id, tournament_id, name]
  }
}

const createPlayer = (id, tournament_id, nickname) => {
  return {
    text: 'INSERT INTO Player(id, tournament_id, nickname) VALUES ($1, $2, $3) RETURNING *',
    values: [id, tournament_id, nickname]
  }
}

const stringCreator = length => 'a'.repeat(length)

const emptyDatabase = async () => {
  await db.query('DELETE FROM Account')
  await db.query('DELETE FROM Tournament')
  await db.query('DELETE FROM Obstacle')
  await db.query('DELETE FROM Player')
  await db.query('DELETE FROM Result')
  await db.query('DELETE FROM ObstacleResult')
}

const initializeAccounts = async () => {
  await db.query(createAccount(1, 'Miika Somero', 'somero', await bcrypt.hash('miika', 10)))
  await db.query(createAccount(2, 'Jukka Jukkanen', 'jukka', await bcrypt.hash('jukka', 10)))
}

const initializeTournaments = async () => {
  await db.query(createTournament(3, 1, 'Myllypuro Open', new Date(), true))
  await db.query(createTournament(4, 1, 'Turnajaiset', new Date(), false))
}

const initializeObstacles = async () => {
  await db.query(createObstacle(5, 3, 'Hiihto'))
  await db.query(createObstacle(6, 3, 'Juoksu'))
  await db.query(createObstacle(7, 4, 'Hiihto'))
  await db.query(createObstacle(8, 4, 'Uinti'))
}

const initializePlayers = async () => {
  await db.query(createPlayer(9, 3, 'Jari J'))
  await db.query(createPlayer(10, 3, 'Jukka H'))
  await db.query(createPlayer(11, 4, 'Miika Milliskukko mipsis'))
  await db.query(createPlayer(12, 4, 'Siiri'))
}

const accountsInDb = async () => {
  const { rows } = await db.query('SELECT * FROM Account')
  return rows
}

const tournamentsInDb = async () => {
  const { rows } = await db.query('SELECT * FROM Tournament')
  return rows
}

const obstaclesInDb = async () => {
  const { rows } = await db.query('SELECT * FROM Obstacle')
  return rows
}

const playersInDb = async () => {
  const { rows } = await db.query('SELECT * FROM Player')
  return rows
}

module.exports = {
  initializeAccounts,
  initializeTournaments,
  initializeObstacles,
  initializePlayers,
  stringCreator,
  emptyDatabase,
  accountsInDb,
  tournamentsInDb,
  obstaclesInDb,
  playersInDb
}