const { getAsync } = require('../redis');
const express = require('express');
const router = express.Router();

router.get('/', async (_req, res) => {
    let added_todos = await getAsync('added_todos');
    added_todos = added_todos ?? 0;
    res.json({ added_todos });
});

module.exports = router;