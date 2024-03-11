const listHelper = require('../utils/list_helper.js')
const blogs = require('./dummyData.js')

describe('most blogs', () => {
    test('most dummies', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({
            "author": "Robert C. Martin",
            "blogs": 3
        })
    })
})