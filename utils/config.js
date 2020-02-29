require('dotenv').config()

let PORT=process.env.PORT
let CONNECTION_STRING=process.env.CONNECTION_STRING

if (process.env.NODE_ENV === 'test') {
  CONNECTION_STRING = process.env.TEST_CONNECTION_STRING
}

module.exports = {
  PORT,
  CONNECTION_STRING
}