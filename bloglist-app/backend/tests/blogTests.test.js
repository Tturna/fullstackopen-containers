const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
    {
        title: 'Bleak House',
        author: 'Charles Dickens',
        url: 'https://www.goodreads.com/book/show/5297.Bleak_House',
        likes: 10
    },
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        url: 'https://www.goodreads.com/book/show/4671.The_Great_Gatsby',
        likes: 20
    }
];

const api = supertest(app);

const loginTestUser = async () => {
    await User.deleteMany({});

    const testUser = {
        username: 'Dude1',
        password: 'badpassword123'
    }

    await api
        .post('/api/users')
        .send(testUser);
    
    const response = await api
        .post('/api/login')
        .send(testUser);
    
    return response.body.token;
}

describe('Blog data formatting', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(initialBlogs);
    }, 20000);

    test('uid is named id and not _id', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body[0].id).toBeDefined(); 
    });
});

describe('Getting blog data', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(initialBlogs);
    });

    test('correct amount of blogs is returned as JSON', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body).toHaveLength(initialBlogs.length);
    });
});

let token;
describe('Adding new blog data', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(initialBlogs);
        token = await loginTestUser();
    });

    afterAll(async () => {
        await Blog.deleteMany({});
    });

    test('Valid blog is added correctly', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'The Catcher in the Rye',
                author: 'J.D. Salinger',
                url: 'https://www.goodreads.com/book/show/5107.The_Catcher_in_the_Rye',
                likes: 30,
                creator: token.id
            })
            .expect(201);
        
        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(initialBlogs.length + 1);
        
        const newBlog = response.body[initialBlogs.length];
        expect(newBlog.title).toBe('The Catcher in the Rye');
    });

    test('If likes are missing from a POST request, default to 0', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Tristram Shandy',
                author: 'Laurence Sterne',
                url: 'https://www.goodreads.com/book/show/1076.The_Life_and_Opinions_of_Tristram_Shandy_Gentleman'
            })
            .expect(201);
        
        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(initialBlogs.length + 1);

        const newBlog = response.body[initialBlogs.length];
        expect(newBlog.likes).toBe(0);
    });

    test('Missing title in POST returns 400', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                author: "The Man Himself",
                url: "https://www.example.com",
                likes: 1
            })
            .expect(400);
    });

    test('Missing url in POST returns 400', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Test Blog",
                author: "The Man Himself",
                likes: 1
            })
            .expect(400);
    });
});

describe('Deleting blog data', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        token = await loginTestUser();

        for (let i = 0; i < initialBlogs.length; i++) {
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(initialBlogs[i]);
        }
    });

    test('Deleting with a valid id returns 204', async () => {
        const res = await api.get('/api/blogs');
        const firstId = res.body[0].id.toString();

        await api
            .delete(`/api/blogs/${firstId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
        
        const newRes = await api.get('/api/blogs');
        expect(newRes.body[0].id.toString() === firstId).toBe(false);
    });

    test('Deleting with an invalid id returns 400', async () => {
        await api
            .delete('/api/blogs/659ea27a7e620fbc9c17c1b4')
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        
        await api
            .delete('/api/blogs/321')
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
    });
});

describe('Updating blog data', () => {
    test('Likes update with valid data', async () => {
        const og = await api.get('/api/blogs');
        const first = og.body[0];

        await api
            .put(`/api/blogs/${first.id}`)
            .send({
                likes: 99
            })
            .expect(200);
        
        const updated = await api.get('/api/blogs');
        expect(updated.body[0].title).toBe(first.title);
        expect(updated.body[0].likes).toBe(99);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});