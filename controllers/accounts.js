const { executeQuery } = require('../services/dbService')
const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()

accountsRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(
    'SELECT id, name, username FROM Account',
    next
  )

  res.json(rows)
})

accountsRouter.get('/:username', async (req, res, next) => {
  const query = {
    text: 'SELECT id, name, username FROM Account WHERE username = $1',
    values: [req.params.username]
  }

  const rows = await executeQuery(
    query, next
  )

  rows.length === 0
    ? res.status(204).end()
    : res.json(rows[0])
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

  const rows = await executeQuery(
    query, next
  )

  res.json(rows[0])
})

module.exports = accountsRouter
