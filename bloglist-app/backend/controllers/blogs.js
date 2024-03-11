const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');
const midware = require('../utils/middleware.js');

// blogsRouter.get('/', (_request, response, next) => {
//     Blog
//         .find({})
//         .then(blogs => {
//             response.json(blogs)
//         })
//         .catch(e => {
//             next(e)
//         })
// })

// We don't need to handle errors here because we use express-async-errors
blogsRouter.get('/', async (_request, response) => {
    const blogs = await Blog.find({}).populate('creator');
    response.json(blogs);
});

blogsRouter.post('/', midware.userExtractor, async (request, response) => {
    const body = request.body;
    const creator = request.user;

    // We're not calling hasOwnProperty directly on the body object because
    // it can be shadowed by a property with the same name.
    if (!Object.prototype.hasOwnProperty.call(body, 'likes')) {
        body.likes = 0;
    }

    if (!Object.prototype.hasOwnProperty.call(body, 'title') ||
        !Object.prototype.hasOwnProperty.call(body, 'url')) {
            response.sendStatus(400);
        }
    
    let blogData = {...body};
    blogData.creator = creator.id;

    const blog = new Blog(blogData);
    await blog.save();

    creator.blogs = creator.blogs.concat(blog._id);
    await creator.save();

    // do this just to populate the creator field
    const populated = await Blog.findById(blog._id).populate('creator')

    response.status(201).json(populated);
});

blogsRouter.delete('/:id', midware.userExtractor, async (request, response) => {
    const id = request.params.id;
    const user = request.user;
    const targetBlog = await Blog.findById(id);
    
    if (!targetBlog) {
        return response.status(400).json({ error: 'Invalid id' });
    }

    if (targetBlog.creator.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'You can only delete your own blogs' });
    }

    console.log(`Deleting ${targetBlog.title}`)
    await Blog.findByIdAndDelete(id);
    
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id;
    const body = request.body;

    const blog = {
        ...body,
        creator: body.creator ? body.creator.id : null
    };

    const updated = await Blog.findByIdAndUpdate(id, blog, { new: true }).populate('creator');
    response.json(updated);
});

blogsRouter.post('/:id/comments', async (request, response) => {
    const id = request.params.id;
    const body = request.body;

    const targetBlog = await Blog.findById(id);
    if (!targetBlog.comments)
    {
        targetBlog.comments = [];
    }

    targetBlog.comments.push(body.comment);
    const updated = await Blog.findByIdAndUpdate(id, targetBlog, { new: true }).populate('creator');
    response.json(updated);
})

module.exports = blogsRouter