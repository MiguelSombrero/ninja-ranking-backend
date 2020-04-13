const jwt = require('jsonwebtoken')
const { executeQuery } = require('../services/dbService')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res, next) => {
  const body = req.body

  const query = {
    text: 'SELECT * FROM Account WHERE username = $1',
    values: [body.username]
  }

  const rows = await executeQuery(
    query, next
  )

  const user = rows[0]

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordhash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.status(200).send({
    token,
    id: user.id,
    username: user.username,
    name: user.name
  })
})

module.exports = loginRouter