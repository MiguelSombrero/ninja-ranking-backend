const { executeQuery } = require('../services/dbService')
const middleware = require('../utils/middleware')
const tournamentsRouter = require('express').Router()
const { SELECT_TOURNAMENTS, INSERT_TOURNAMENT, UPDATE_TOURNAMENT } = require('../db/queries')

tournamentsRouter.get('/', async (req, res, next) => {
  const rows = await executeQuery(SELECT_TOURNAMENTS, next)
  res.json(rows)
})

tournamentsRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const query = {
    text: INSERT_TOURNAMENT,
    values: [req.account_id, req.body.name, new Date(), true]
  }

  const rows = await executeQuery(
    query, next
  )

  res.json(rows[0])
})

tournamentsRouter.put('/:id', middleware.validateToken, async (req, res, next) => {
  const { active } = req.body
  const tournament_id = req.params.id

  const query = {
    text: UPDATE_TOURNAMENT,
    values: [active, tournament_id]
  }

  const rows = await executeQuery(
    query, next
  )

  res.json(rows[0])
})

module.exports = tournamentsRouter
