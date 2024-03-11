const listHelper = require('../utils/list_helper.js')
const blogs = require('./dummyData.js')

describe('most likes', () => {
    test('most dummy likes', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
            "author": "Edsger W. Dijkstra",
            "likes": 17
        })
    })
})