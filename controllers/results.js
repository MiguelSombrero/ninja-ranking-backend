const { executeQuery, executeMultipleQueries } = require('../services/dbService')
const middleware = require('../utils/middleware')
const resultsRouter = require('express').Router()

const generateJoinTableQuery = (result_id, obstacle_id) => {
  return {
    text: 'INSERT INTO ObstacleResult(result_id, obstacle_id) VALUES ($1, $2)',
    values: [result_id, obstacle_id]
  }
}

resultsRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(
    'SELECT * FROM Result',
    next
  )

  res.json(rows)
})

resultsRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const { player_id, time, passed_obstacles } = req.body

  const query = {
    text: 'INSERT INTO Result(player_id, time) VALUES ($1, $2) RETURNING *',
    values: [player_id, time]
  }

  const rows = await executeQuery(
    query, next
  )

  const queries = passed_obstacles.map(
    obstacle_id => generateJoinTableQuery(rows[0].id, obstacle_id)
  )

  await executeMultipleQueries(
    queries, next
  )

  res.json(rows[0])
})

module.exports = resultsRouter
