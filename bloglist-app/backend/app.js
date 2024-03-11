const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')
const midware = require('./utils/middleware.js')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')
const app = express()

mongoose.set('strictQuery', false)

logger.info('Connecting to db...')
mongoose.connect(config.CONN_STRING)
    .then(() => {
        logger.info('Connected to db!')
    })
    .catch(e => {
        logger.error(e)
    })

app.use(cors())
app.use(express.json())
app.use(midware.requestLogger)
app.use(midware.tokenExtractor)
app.use('/api/blogs/', blogsRouter)
app.use('/api/users/', usersRouter)
app.use('/api/login/', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing.js')
    app.use('/api/testing/', testingRouter)
}

app.use(midware.unknownEndpoint)
app.use(midware.errorHandler)

module.exports = app