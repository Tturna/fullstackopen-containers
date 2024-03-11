const logger = require('./logger.js')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requestLogger = (request, _response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: error.message })
    }

    next(error)
}

const tokenExtractor = (req, _res, next) => {
    // This gets the value of the Authorization header in the HTTP request
    const authorization = req.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '');
    }

    next();
}

const userExtractor = async (req, res, next) => {
    const token = req.token;

    if (!token) {
        return res.status(401).json({ error: 'token missing' });
    }

    let decodedToken = undefined;
    let error = undefined;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    }
    catch (e) {
        error = e;
    }
    
    if (!decodedToken.id || error === 'SyntaxError') {
        return res.status(401).json({ error: 'token invalid' });
    }
    
    req.user = await User.findById(decodedToken.id);

    next();
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}