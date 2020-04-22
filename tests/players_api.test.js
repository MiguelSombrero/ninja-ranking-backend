const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const db = require('../db')

let login = null

beforeEach(async () => {
  await helper.emptyDatabase()
  await helper.initializeAccounts()
  await helper.initializeTournaments()
  await helper.initializeObstacles()
  await helper.initializePlayers()
  await helper.initializeResults()

  login = await api
    .post('/login')
    .send({ username: 'somero', password: 'miika' })
})

describe('getting players from database', () => {
  test('players are returned as json', async () => {
    await api
      .get('/players')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all players', async () => {
    const initialPlayers = await helper.playersInDb()
    const res = await api.get('/players')
    expect(res.body.length).toBe(initialPlayers.length)
  })

  test('returns players with all the fields', async () => {
    const res = await api.get('/players')

    expect(res.body[0].id).toBeDefined()
    expect(res.body[0].nickname).toBeDefined()
    expect(res.body[0].tournament_id).toBeDefined()
    expect(res.body[0].results).toBeDefined()
  })
})

describe('saving players to database', () => {
  test('player cannot be added without logging in', async () => {
    const initialPlayers = await helper.playersInDb()

    const player = {
      tournament_id: 3,
      nickname: 'Riku'
    }

    const res = await api
      .post('/players')
      .send(player)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const playersAtEnd = await helper.playersInDb()
    expect(res.body.error).toContain('token is missing')
    expect(initialPlayers.length).toBe(playersAtEnd.length)
  })

  test('valid player can be added to db', async () => {
    const initialPlayers = await helper.playersInDb()

    const player = {
      tournament_id: 3,
      nickname: 'Riku'
    }

    const res = await api
      .post('/players')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(player)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.id).toBeDefined()
    expect(res.body.nickname).toBe('Riku')
    expect(res.body.tournament_id).toBe(3)

    const playerAtEnd = await helper.playersInDb()
    expect(initialPlayers.length + 1).toBe(playerAtEnd.length)
  })

  test('player without nickname cannot be added', async () => {
    const initialPlayers = await helper.playersInDb()

    const player = {
      tournament_id: 3
    }

    const res = await api
      .post('/players')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(player)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const playersAtEnd = await helper.playersInDb()
    expect(res.body.error).toContain('null value in column "nickname" violates not-null constraint')
    expect(initialPlayers.length).toBe(playersAtEnd.length)
  })
})

afterAll(() => {
  db.closeDb()
})