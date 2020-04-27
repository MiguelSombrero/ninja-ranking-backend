const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const obstaclesRouter = require('express').Router()
const { SELECT_OBSTACLES, INSERT_OBSTACLE } = require('../db/queries')

obstaclesRouter.get('/', async (req, res, next) => {
  try {
    const rows = await executeQuery(SELECT_OBSTACLES, next)
    res.json(rows)

  } catch (exception) {
    next(exception)
  }
})

obstaclesRouter.post('/', middleware.validateToken, middleware.authorize, async (req, res, next) => {
  const { tournament_id, name } = req.body

  const query = {
    text: INSERT_OBSTACLE,
    values: [tournament_id, name]
  }

  try {
    const rows = await executeQuery(query, next)
    res.json(rows[0])

  } catch (exception) {
    next(exception)
  }
})

module.exports = obstaclesRouter
