const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const tournamentsRouter = require('express').Router()

tournamentsRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(
    'SELECT Tournament.id, Tournament.account_id, Tournament.name, Tournament.created, Tournament.active, json_agg(Obstacle) AS obstacles FROM Tournament LEFT JOIN Obstacle ON Tournament.id = Obstacle.tournament_id GROUP BY Tournament.id',
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
