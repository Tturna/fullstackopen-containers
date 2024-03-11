const listHelper = require('../utils/list_helper.js')
const blogs = require('./dummyData.js')

describe('favorite blog', () => {
    test('favorite dummy', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })
})