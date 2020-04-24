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
    .post('/api/login')
    .send({ username: 'somero', password: 'miika' })
})

describe('getting results from database', () => {
  test('results are returned as json', async () => {
    await api
      .get('/api/results')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all results', async () => {
    const initialResults = await helper.resultsInDb()
    const res = await api.get('/api/results')
    expect(res.body.length).toBe(initialResults.length)
  })

  test('returns results with all the fields', async () => {
    const res = await api.get('/api/results')

    expect(res.body[0].id).toBeDefined()
    expect(res.body[0].player_id).toBeDefined()
    expect(res.body[0].time).toBeDefined()
    expect(res.body[0].passed_obstacles).toBeDefined()
  })
})

describe('saving results to database', () => {
  test('result cannot be added without logging in', async () => {
    const initialResults = await helper.resultsInDb()

    const result = {
      player_id: 9,
      time: 18,
      passed_obstacles: [5, 8]
    }

    const res = await api
      .post('/api/results')
      .send(result)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const resultsAtEnd = await helper.resultsInDb()
    expect(res.body.error).toContain('token is missing')
    expect(initialResults.length).toBe(resultsAtEnd.length)
  })

  test('valid result can be added to db', async () => {
    const initialResults = await helper.resultsInDb()

    const result = {
      player_id: 9,
      time: 18,
      passed_obstacles: [5, 8]
    }

    const res = await api
      .post('/api/results')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(result)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.id).toBeDefined()
    expect(res.body.time).toBe(18)
    expect(res.body.player_id).toBe(9)
    expect(res.body.passed_obstacles).toContain(5)
    expect(res.body.passed_obstacles).toContain(8)

    const resultsAtEnd = await helper.resultsInDb()
    expect(initialResults.length + 1).toBe(resultsAtEnd.length)
  })

  test('result without player_id cannot be added', async () => {
    const initialResults = await helper.resultsInDb()

    const result = {
      time: 22,
      passed_obstacles: [5, 8]
    }

    const res = await api
      .post('/api/results')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(result)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const resultsAtEnd = await helper.resultsInDb()
    expect(res.body.error).toContain('null value in column "player_id" violates not-null constraint')
    expect(initialResults.length).toBe(resultsAtEnd.length)
  })

  test('result without time cannot be added', async () => {
    const initialResults = await helper.resultsInDb()

    const result = {
      player_id: 11,
      passed_obstacles: [5, 8]
    }

    const res = await api
      .post('/api/results')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(result)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const resultsAtEnd = await helper.resultsInDb()
    expect(res.body.error).toContain('null value in column "time" violates not-null constraint')
    expect(initialResults.length).toBe(resultsAtEnd.length)
  })
})

afterAll(() => {
  db.closeDb()
})