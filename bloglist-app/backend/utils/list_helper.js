const lodash = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const copy = Array.from(blogs)
    const sorted = copy.sort((a, b) => b.likes - a.likes)
    return sorted[0]
}

const mostBlogs = (blogs) => {
    const mostBlogs = lodash.countBy(blogs, b => b.author)
    const pairs = lodash.toPairs(mostBlogs)
    const sorted = pairs.sort((a,b) => b[1] - a[1])
    
    return {
        "author": sorted[0][0],
        "blogs": sorted[0][1]
    }
}

const mostLikes = (blogs) => {
    const individualLikes = blogs.map(b => {
        return [b.author, b.likes]
    })

    const totalLikes = lodash.reduce(individualLikes, (res, val) => {
        let likes = res[val[0]] || 0;
        res[val[0]] = likes + val[1]
        return res
    }, {})

    const pairs = lodash.toPairs(totalLikes)
    const mostLiked = pairs.sort((a,b) => b[1] - a[1])[0]

    return {
        "author": mostLiked[0],
        "likes": mostLiked[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}