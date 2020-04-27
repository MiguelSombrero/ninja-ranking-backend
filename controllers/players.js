const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const playersRouter = require('express').Router()
const { SELECT_PLAYERS, INSERT_PLAYER } = require('../db/queries')

playersRouter.get('/', async (req, res, next) => {
  try {
    const rows = await executeQuery(SELECT_PLAYERS, next)
    res.json(rows)

  } catch (exception) {
    next(exception)
  }
})

playersRouter.post('/', middleware.validateToken, middleware.authorize, async (req, res, next) => {
  const { tournament_id, nickname } = req.body

  const query = {
    text: INSERT_PLAYER,
    values: [tournament_id, nickname]
  }

  try {
    const rows = await executeQuery(query, next)
    res.json({ ...rows[0], results: [] })

  } catch (exception) {
    next(exception)
  }
})

module.exports = playersRouter
