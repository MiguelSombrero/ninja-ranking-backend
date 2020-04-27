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
    .post('/api/login')
    .send({ username: 'somero', password: 'miika' })
})

describe('getting tournaments from database', () => {
  test('tournaments are returned as json', async () => {
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
    expect(res.body[0].account.id).toBeDefined()
    expect(res.body[0].account.name).toBeDefined()
    expect(res.body[0].account.passwordhash).not.toBeDefined()
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
      .post('/api/tournaments')
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
      .post('/api/tournaments')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(tournament)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.id).toBeDefined()
    expect(res.body.name).toBe('Salainen turnaus')
    expect(res.body.account.id).toBe(1)
    expect(res.body.account.name).toBe('Miika Somero')
    expect(res.body.passwordhash).not.toBeDefined()
    expect(res.body.created).toBeDefined()
    expect(res.body.active).toBe(true)

    const tournamentsAtEnd = await helper.tournamentsInDb()
    expect(initialTournaments.length + 1).toBe(tournamentsAtEnd.length)
  })

  test('tournament without name cannot be added', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {}

    const res = await api
      .post('/api/tournaments')
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
      .put('/api/tournaments/3')
      .send(tournament)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const tournamentsAtEnd = await helper.tournamentsInDb()
    expect(res.body.error).toContain('token is missing')
    expect(initialTournaments.length).toBe(tournamentsAtEnd.length)
  })

  test('someone elses tournament cannot be updated', async () => {
    const jukkaLogin = await api
      .post('/api/login')
      .send({ username: 'jukka', password: 'jukka' })

    const tournament = {
      active: false
    }

    const res = await api
      .put('/api/tournaments/3')
      .set('Authorization', 'Bearer ' + jukkaLogin.body.token)
      .send(tournament)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const updatedTournament = await helper.tournamentsInDb()

    expect(updatedTournament[0].active).toBe(true)
    expect(res.body.error).toBe('no authorization to update tournament')
  })

  test('gives error if updating tournament that doesnt exist', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {
      active: false
    }

    const res = await api
      .put('/api/tournaments/323')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(tournament)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    const tournamentsAtEnd = await helper.tournamentsInDb()

    expect(res.body.error).toBe('tournament not found')
    expect(initialTournaments.length).toBe(tournamentsAtEnd.length)
  })

  test('valid tournament can be updated', async () => {
    const initialTournaments = await helper.tournamentsInDb()

    const tournament = {
      active: false
    }

    const res = await api
      .put('/api/tournaments/3')
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