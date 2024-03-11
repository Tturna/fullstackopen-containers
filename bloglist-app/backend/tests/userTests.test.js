const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
});

describe('User creation', () => {
    test('A valid user creation returns 201 and the user as JSON', async () => {
        await api
            .post('/api/users')
            .send({
                username: 'BigDude420',
                name: 'Matti Virtanen',
                password: 'mate123'
            })
            .expect(201)
            .expect('Content-type', /application\/json/);
    });

    test('Missing username returns 400 and error message', async () => {
        const response = await api
            .post('/api/users')
            .send({
                name: 'Matti Virtanen',
                password: 'mate123'
            })
            .expect(400);
        
        expect(Object.prototype.hasOwnProperty.call(response.body, 'error')).toBe(true);
        expect(typeof response.body.error).toBe('string');
    });

    test('Missing password returns 400 and error message', async () => {
        const response = await api
            .post('/api/users')
            .send({
                username: 'BigGuy420',
                name: 'Matti Virtanen'
            })
            .expect(400);
        
        expect(Object.prototype.hasOwnProperty.call(response.body, 'error')).toBe(true);
        expect(typeof response.body.error).toBe('string');
    });

    test('Short usernames return 400 and error message', async () => {
        const response = await api
            .post('/api/users')
            .send({
                username: 'ab',
                password: 'longenough123'
            })
            .expect(400);
        
        expect(Object.prototype.hasOwnProperty.call(response.body, 'error')).toBe(true);
        expect(typeof response.body.error).toBe('string');
    });

    test('Short passwords return 400 and error message', async () => {
        const response = await api
            .post('/api/users')
            .send({
                username: 'BigDude420',
                password: 'lo'
            })
            .expect(400);
        
        expect(Object.prototype.hasOwnProperty.call(response.body, 'error')).toBe(true);
        expect(typeof response.body.error).toBe('string');
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});