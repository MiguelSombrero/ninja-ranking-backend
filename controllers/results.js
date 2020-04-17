const { executeQuery, executeMultipleQueries } = require('../services/dbService')
const middleware = require('../utils/middleware')
const resultsRouter = require('express').Router()
const { SELECT_RESULTS, INSERT_RESULT, INSERT_OBSTACLERESULT } = require('../db/queries')

const generateJoinTableQuery = (result_id, obstacle_id) => {
  return {
    text: INSERT_OBSTACLERESULT,
    values: [result_id, obstacle_id]
  }
}

resultsRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(SELECT_RESULTS, next)
  res.json(rows)
})

resultsRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const { player_id, time, passed_obstacles } = req.body

  const query = {
    text: INSERT_RESULT,
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

  const savedResult = rows[0]
  savedResult.passed_obstacles = passed_obstacles

  res.json(savedResult)
})

module.exports = resultsRouter
