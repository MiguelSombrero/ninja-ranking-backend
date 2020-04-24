const { executeQuery } = require('../services/dbService')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const tournamentsRouter = require('express').Router()
const {
  SELECT_TOURNAMENTS,
  INSERT_TOURNAMENT,
  UPDATE_TOURNAMENT,
  selectTournamentById
} = require('../db/queries')


tournamentsRouter.get('/', async (req, res, next) => {
  try {
    const rows = await executeQuery(SELECT_TOURNAMENTS, next)
    res.json(rows)

  } catch(exception) {
    next(exception)
  }
})

tournamentsRouter.post('/', middleware.validateToken, async (req, res, next) => {
  const query = {
    text: INSERT_TOURNAMENT,
    values: [req.account_id, req.body.name, new Date(), true]
  }

  try {
    const savedTournamentRows = await executeQuery(query, next)
    const rows = await executeQuery(selectTournamentById(savedTournamentRows[0].id), next)
    res.json(rows[0])

  } catch(exception) {
    next(exception)
  }
})

tournamentsRouter.put('/:id', middleware.validateToken, async (req, res, next) => {
  const { active } = req.body
  const tournament_id = req.params.id

  const query = {
    text: UPDATE_TOURNAMENT,
    values: [active, tournament_id]
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const rows = await executeQuery(selectTournamentById(tournament_id), next)
    const tournament = rows[0]

    if (!tournament) {
      return res.status(404).send({
        error: 'tournament not found'
      })
    }

    if (decodedToken.id !== tournament.account.id) {
      return res.status(401).send({
        error: 'no authorization to update tournament'
      })
    }

    await executeQuery(query, next)
    const updatedRows = await executeQuery(selectTournamentById(tournament_id), next)
    res.json(updatedRows[0])

  } catch(exception) {
    next(exception)
  }
})

module.exports = tournamentsRouter
