const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  helper.initializeDatabase()
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