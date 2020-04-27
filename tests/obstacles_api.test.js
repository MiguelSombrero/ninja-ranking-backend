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

describe('getting obstacles from database', () => {
  test('obstacles are returned as json', async () => {
    await api
      .get('/api/obstacles')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all obstacles', async () => {
    const initialObstacles = await helper.obstaclesInDb()
    const res = await api.get('/api/obstacles')
    expect(res.body.length).toBe(initialObstacles.length)
  })

  test('returns obstacles with all the fields', async () => {
    const res = await api.get('/api/obstacles')

    expect(res.body[0].id).toBeDefined()
    expect(res.body[0].name).toBeDefined()
    expect(res.body[0].tournament_id).toBeDefined()
  })
})

describe('saving obstacles to database', () => {
  test('obstacle cannot be added without logging in', async () => {
    const initialObstacles = await helper.obstaclesInDb()

    const obstacle = {
      tournament_id: 3,
      name: 'Paini'
    }

    const res = await api
      .post('/api/obstacles')
      .send(obstacle)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const obstaclesAtEnd = await helper.obstaclesInDb()
    expect(res.body.error).toContain('token is missing')
    expect(initialObstacles.length).toBe(obstaclesAtEnd.length)
  })

  test('obstacle cannot be added to someone elses tournament', async () => {
    const jukkaLogin = await api
      .post('/api/login')
      .send({ username: 'jukka', password: 'jukka' })

    const initialObstacles = await helper.obstaclesInDb()

    const obstacle = {
      tournament_id: 3,
      name: 'Paini'
    }

    const res = await api
      .post('/api/obstacles')
      .set('Authorization', 'Bearer ' + jukkaLogin.body.token)
      .send(obstacle)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const obstaclesAtEnd = await helper.obstaclesInDb()
    expect(res.body.error).toContain('no authorization to modify tournament')
    expect(initialObstacles.length).toBe(obstaclesAtEnd.length)
  })

  test('valid obstacle can be added to db', async () => {
    const initialObstacles = await helper.obstaclesInDb()

    const obstacle = {
      tournament_id: 3,
      name: 'Paini'
    }

    const res = await api
      .post('/api/obstacles')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(obstacle)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.id).toBeDefined()
    expect(res.body.name).toBe('Paini')
    expect(res.body.tournament_id).toBe(3)

    const obstaclesAtEnd = await helper.obstaclesInDb()
    expect(initialObstacles.length + 1).toBe(obstaclesAtEnd.length)
  })

  test('obstacle without name cannot be added', async () => {
    const initialObstacles = await helper.obstaclesInDb()

    const obstacle = {
      tournament_id: 3
    }

    const res = await api
      .post('/api/obstacles')
      .set('Authorization', 'Bearer ' + login.body.token)
      .send(obstacle)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const obstaclesAtEnd = await helper.obstaclesInDb()
    expect(res.body.error).toContain('null value in column "name" violates not-null constraint')
    expect(initialObstacles.length).toBe(obstaclesAtEnd.length)
  })

})

afterAll(() => {
  db.closeDb()
})