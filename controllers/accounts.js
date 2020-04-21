const { executeQuery } = require('../services/dbService')
const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()
const { INSERT_ACCOUNT } = require('../db/queries')

accountsRouter.post('/', async (req, res, next) => {
  const { password, username, name } = req.body

  if (password.length < 5 || password.length > 20) {
    return res.status(401).json({
      error: 'password must be between 5-20 characters'
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const query = {
    text: INSERT_ACCOUNT,
    values: [name, username, passwordHash]
  }

  const rows = await executeQuery(
    query, next
  )

  res.json(rows[0])
})

module.exports = accountsRouter
