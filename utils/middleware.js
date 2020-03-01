const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  req.token = (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null

  next()
}

const validateToken = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({
      error: 'token is missing'
    })
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token is invalid'
    })
  }

  req.account_id = decodedToken.id

  next()
}

const unknownEndpoint =  (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    })
  } else if (error.name === 'jsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  validateToken,
  errorHandler
}