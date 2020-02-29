const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('getting accounts from database', () => {
  test('accounts are returned as json', async () => {
    await api
      .get('/api/accounts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})
