const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const db = require('../db')

beforeEach(async () => {
  await helper.emptyDatabase()
  await helper.initializeAccounts()
})

describe('getting accounts from database', () => {
  test('accounts are returned as json', async () => {
    await api
      .get('/api/accounts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all accounts', async () => {
    const initialAccounts = await helper.accountsInDb()
    const res = await api.get('/api/accounts')
    expect(res.body.length).toBe(initialAccounts.length)
  })

  test('returns account with all the fields', async () => {
    const res = await api.get('/api/accounts')

    expect(res.body[0].id).toBeDefined()
    expect(res.body[0].name).toBeDefined()
    expect(res.body[0].username).toBeDefined()
    expect(res.body[0].password).not.toBeDefined()
    expect(res.body[0].passwordhash).not.toBeDefined()
  })
})

describe('saving accounts to database', () => {
  test('valid account can be added to db', async () => {
    const initialAccounts = await helper.accountsInDb()

    const account = {
      name: 'Miika Juhani',
      username: 'Juhani',
      password: 'salainen'
    }

    const res = await api
      .post('/api/accounts')
      .send(account)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.id).toBeDefined()
    expect(res.body.name).toBe('Miika Juhani')
    expect(res.body.username).toBe('Juhani')
    expect(res.body.password).not.toBeDefined()
    expect(res.body.passwordhash).not.toBeDefined()

    const accountsAtEnd = await helper.accountsInDb()
    expect(initialAccounts.length + 1).toBe(accountsAtEnd.length)
  })
})

afterAll(() => {
  db.closeDb()
})