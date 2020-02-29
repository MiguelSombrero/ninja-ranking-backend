const db = require('../db')
const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()

accountsRouter.get('/', async (req, res, next) => {
  const query = {
    text: 'SELECT * FROM Accounts',
    params: []
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
    text: 'SELECT * FROM Accounts WHERE id = $1',
    params: [req.params.username]
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
    text: 'INSERT INTO Accounts (name, username, passwordHash) VALUES($1, $2, $3) RETURNING *',
    params: [name, username, passwordHash]
  }

  try {
    const { rows } = await db.query(query)
    const user = rows[0]
    res.json(user)

  } catch (exception) {
    next(exception)
  }
})

module.exports = accountsRouter
