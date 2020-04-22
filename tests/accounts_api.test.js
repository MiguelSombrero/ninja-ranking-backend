const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const db = require('../db')

beforeEach(async () => {
  await helper.emptyDatabase()
  await helper.initializeAccounts()
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
      .post('/accounts')
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

  test('cannot add account with same username', async () => {
    const initialAccounts = await helper.accountsInDb()

    const account = {
      name: 'Miika Juhani',
      username: 'somero',
      password: 'salainen'
    }

    const res = await api
      .post('/accounts')
      .send(account)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const accountsAtEnd = await helper.accountsInDb()
    expect(res.body.error).toContain('duplicate key value violates unique constraint')
    expect(initialAccounts.length).toBe(accountsAtEnd.length)
  })

  test('cannot add account with too short password', async () => {
    const initialAccounts = await helper.accountsInDb()

    const account = {
      name: 'Miika Juhani',
      username: 'juhani',
      password: 'sala'
    }

    const res = await api
      .post('/accounts')
      .send(account)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const accountsAtEnd = await helper.accountsInDb()
    expect(res.body.error).toContain('password must be between 5-20 characters')
    expect(initialAccounts.length).toBe(accountsAtEnd.length)
  })

  test('cannot add account with too long password', async () => {
    const initialAccounts = await helper.accountsInDb()
    const password = helper.stringCreator(21)

    const account = {
      name: 'Miika Juhani',
      username: 'juhani',
      password
    }

    const res = await api
      .post('/accounts')
      .send(account)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const accountsAtEnd = await helper.accountsInDb()
    expect(res.body.error).toContain('password must be between 5-20 characters')
    expect(initialAccounts.length).toBe(accountsAtEnd.length)
  })

  test('cannot add account without name', async () => {
    const initialAccounts = await helper.accountsInDb()

    const account = {
      username: 'juhani',
      password: 'salainen'
    }

    const res = await api
      .post('/accounts')
      .send(account)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const accountsAtEnd = await helper.accountsInDb()
    expect(res.body.error).toContain('null value in column "name" violates not-null constraint')
    expect(initialAccounts.length).toBe(accountsAtEnd.length)
  })

  test('cannot add account without username', async () => {
    const initialAccounts = await helper.accountsInDb()

    const account = {
      name: 'juhani',
      password: 'salainen'
    }

    const res = await api
      .post('/accounts')
      .send(account)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const accountsAtEnd = await helper.accountsInDb()
    expect(res.body.error).toContain('null value in column "username" violates not-null constraint')
    expect(initialAccounts.length).toBe(accountsAtEnd.length)
  })
})

afterAll(() => {
  db.closeDb()
})