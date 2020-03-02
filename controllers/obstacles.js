const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const obstaclesRouter = require('express').Router()

obstaclesRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(
    'SELECT * FROM Obstacle',
    next
  )

  res.json(rows)
})

obstaclesRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const { tournament_id, name } = req.body

  const query = {
    text: 'INSERT INTO Obstacle(tournament_id, name) VALUES ($1, $2) RETURNING *',
    values: [tournament_id, name]
  }

  const rows = await executeQuery(
    query, next
  )

  res.json(rows[0])
})

module.exports = obstaclesRouter
