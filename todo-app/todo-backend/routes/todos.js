const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findById(id);
  res.send(todo);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const existing_todos_string = await redis.getAsync('added_todos');
  const existing_todos = existing_todos_string ? Number(existing_todos_string) : 0;
  redis.setAsync('added_todos', 1 + existing_todos);

  res.send(todo);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  console.log('Updating with body:');
  console.log(body);
  const updated = await Todo.findByIdAndUpdate(id, body, { new: true });
  console.log('Updated:');
  console.log(updated);
  res.send(updated);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
