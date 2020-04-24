const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const db = require('../db')

beforeEach(async () => {
  await helper.emptyDatabase()
  await helper.initializeAccounts()
})

describe('login when there is user in database', () => {
  test('login with valid credentials succeeds', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'somero', password: 'miika' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('somero')
    expect(res.body.name).toBe('Miika Somero')
    expect(res.body.token).toBeDefined()
    expect(res.body.password).not.toBeDefined()
    expect(res.body.passwordhash).not.toBeDefined()
  })

  test('login with wrong username fails', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'eiloydy', password: 'vaarin' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toBe('invalid username or password')
  })

  test('login with wrong password fails', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'somero', password: 'vaarin' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toBe('invalid username or password')
  })

  test('login is case sensitive concerning password', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'somero', password: 'Miika' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toBe('invalid username or password')
  })

  test('login without credentials fails', async () => {
    const res = await api
      .post('/api/login')
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toBe('invalid username or password')
  })
})

afterAll(() => {
  db.closeDb()
})