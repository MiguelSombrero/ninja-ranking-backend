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

  login = await api
    .post('/login')
    .send({ username: 'somero', password: 'miika' })
})

describe('getting tournaments from database', () => {
  test('tournaments are returned as json', async () => {
    await api
      .get('/tournaments')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all tournaments', async () => {
    const initialTournaments = await helper.tournamentsInDb()
    const res = await api.get('/tournaments')
    expect(res.body.length).toBe(initialTournaments.length)
  })

  test('returns tournament with all the fields', async () => {
    const res = await api.get('/tournaments')

    expect(res.body[0].id).toBeDefined()
    expect(res.body[0].name).toBeDefined()
    expect(res.body[0].account_id).toBeDefined()
    expect(res.body[0].created).toBeDefined()
    expect(res.body[0].active).toBeDefined()
    expect(res.body[0].obstacles[0].id).toBeDefined()
    expect(res.body[0].obstacles[0].name).toBeDefined()
  })
})

describe('saving tournaments to database', () => {
  test('tournament cannot be added without logging in', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {
      name: 'Salainen turnaus'
    }

    const res = await api
      .post('/tournaments')
      .send(tournament)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const tournamentsAtEnd = await helper.tournamentsInDb()
    expect(res.body.error).toContain('token is missing')
    expect(initialTournaments.length).toBe(tournamentsAtEnd.length)
  })

  test('valid tournament can be added to db', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {
      name: 'Salainen turnaus'
    }

    const res = await api
      .post('/tournaments')
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

  test('tournament without name cannot be added', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {}

    const res = await api
      .post('/tournaments')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(tournament)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const tournamentsAtEnd = await helper.tournamentsInDb()
    expect(res.body.error).toContain('null value in column "name" violates not-null constraint')
    expect(initialTournaments.length).toBe(tournamentsAtEnd.length)
  })
})

describe('updating tournament', () => {
  test('tournament cannot be updated without logging in', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {
      active: false
    }

    const res = await api
      .put('/tournaments/3')
      .send(tournament)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const tournamentsAtEnd = await helper.tournamentsInDb()
    expect(res.body.error).toContain('token is missing')
    expect(initialTournaments.length).toBe(tournamentsAtEnd.length)
  })

  test('valid tournament can be updated', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {
      active: false
    }

    const res = await api
      .put('/tournaments/3')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(tournament)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const tournamentsAtEnd = await helper.tournamentsInDb()
    expect(res.body.active).toBe(false)
    expect(initialTournaments.length).toBe(tournamentsAtEnd.length)
  })
})

afterAll(() => {
  db.closeDb()
})