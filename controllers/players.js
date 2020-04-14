const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const playersRouter = require('express').Router()

playersRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(
    'SELECT Player.id, Player.tournament_id, Player.nickname, json_agg(Result) AS results FROM Player LEFT JOIN Result ON Player.id = Result.player_id GROUP BY Player.id',
    next
  )

  res.json(rows)
})

playersRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const { tournament_id, nickname } = req.body

  const query = {
    text: 'INSERT INTO Player(tournament_id, nickname) VALUES ($1, $2) RETURNING *',
    values: [tournament_id, nickname]
  }

  const rows = await executeQuery(
    query, next
  )

  res.json(rows[0])
})

module.exports = playersRouter
