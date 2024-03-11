require('dotenv').config()

const CONN_STRING = process.env.NODE_ENV === 'test'
    ? process.env.TEST_CONN_STRING
    : process.env.CONN_STRING

const PORT = process.env.PORT || 3003

module.exports = {
    CONN_STRING,
    PORT
}