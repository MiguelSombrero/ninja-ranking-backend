const db = require('../db')
const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()

accountsRouter.get('/', async (req, res, next) => {
  const query = {
    text: 'SELECT id, name, username FROM Account',
    values: []
  }

  try {
    const { rows } = await db.query(query)
    res.json(rows)

  } catch (exception) {
    next(exception)
  }
})

accountsRouter.get('/:username', async (req, res, next) => {
  const query = {
    text: 'SELECT id, name, username FROM Account WHERE username = $1',
    values: [req.params.username]
  }

  try {
    const { rows } = await db.query(query)
    const user = rows[0]

    user === null
      ? res.status(204).end()
      : res.json(user)

  } catch (exception) {
    next(exception)
  }
})

accountsRouter.post('/', async (req, res, next) => {
  const { password, username, name } = req.body

  if (password.length < 5 || password.length > 20) {
    return res.status(401).json({
      error: 'password must be between 5-20 characters'
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const query = {
    text: 'INSERT INTO Account (name, username, passwordHash) VALUES($1, $2, $3) RETURNING id, name, username',
    values: [name, username, passwordHash]
  }

  try {
    const { rows } = await db.query(query)
    res.json(rows[0])

  } catch (exception) {
    next(exception)
  }
})

module.exports = accountsRouter
