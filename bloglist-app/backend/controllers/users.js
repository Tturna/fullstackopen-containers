const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const userdata = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    response.status(200).json(userdata);
});

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    if (!username) {
        return response.status(400).json({ error: 'Username is required.' });
    }

    if (!password) {
        return response.status(400).json({ error: 'Password is required.' });
    }

    if (username.length < 3) {
        return response.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (password.length < 3) {
        return response.status(400).json({ error: 'Password must be at least 3 characters long.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

module.exports = usersRouter;