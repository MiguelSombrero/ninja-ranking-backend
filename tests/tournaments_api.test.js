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

  login = await api
    .post('/api/login')
    .send({ username: 'somero', password: 'miika' })
})

describe('getting tournaments from database', () => {
  test('accounts are returned as json', async () => {
    await api
      .get('/api/tournaments')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all tournaments', async () => {
    const initialTournaments = await helper.tournamentsInDb()
    const res = await api.get('/api/tournaments')
    expect(res.body.length).toBe(initialTournaments.length)
  })

  test('returns tournament with all the fields', async () => {
    const res = await api.get('/api/tournaments')

    expect(res.body[0].id).toBeDefined()
    expect(res.body[0].name).toBeDefined()
    expect(res.body[0].account_id).toBeDefined()
    expect(res.body[0].created).toBeDefined()
    expect(res.body[0].active).toBeDefined()
  })
})

describe('saving tournaments to database', () => {
  test('valid tournament can be added to db', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {
      name: 'Salainen turnaus'
    }

    const res = await api
      .post('/api/tournaments')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(tournament)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.id).toBeDefined()
    expect(res.body.name).toBe('Salainen turnaus')
    expect(res.body.account_id).toBe(1)
    expect(res.body.created).toBeDefined()
    expect(res.body.active).toBe(true)

    const tournamentsAtEnd = await helper.tournamentsInDb()
    expect(initialTournaments.length + 1).toBe(tournamentsAtEnd.length)
  })
})

afterAll(() => {
  db.closeDb()
})