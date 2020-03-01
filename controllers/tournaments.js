const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const tournamentsRouter = require('express').Router()

tournamentsRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(
    'SELECT * FROM Tournament',
    next
  )

  res.json(rows)
})

tournamentsRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const query = {
    text: 'INSERT INTO Tournament(account_id, name, created, active) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [req.account_id, req.body.name, new Date(), true]
  }

  const rows = await executeQuery(
    query, next
  )

  res.json(rows[0])
})

module.exports = tournamentsRouter
