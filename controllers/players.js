const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const playersRouter = require('express').Router()
const { SELECT_PLAYERS, INSERT_PLAYER } = require('../db/queries')

playersRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(SELECT_PLAYERS, next)
  res.json(rows)
})

playersRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const { tournament_id, nickname } = req.body

  const query = {
    text: INSERT_PLAYER,
    values: [tournament_id, nickname]
  }

  const rows = await executeQuery(
    query, next
  )

  res.json({ ...rows[0], results: [] })
})

module.exports = playersRouter
