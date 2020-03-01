const db = require('../db')
const middleware = require('../utils/middleware')
const tournamentsRouter = require('express').Router()

tournamentsRouter.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM Tournament')
    res.json(rows)

  } catch (exception) {
    next(exception)
  }
})

tournamentsRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const query = {
    text: 'INSERT INTO Tournament(account_id, name, created, active) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [req.account_id, req.body.name, new Date(), true]
  }

  try {
    const { rows } = await db.query(query)
    return res.json(rows[0])

  } catch (exception) {
    next(exception)
  }
})

module.exports = tournamentsRouter
