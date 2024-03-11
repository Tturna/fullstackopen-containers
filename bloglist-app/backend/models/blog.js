const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [String]
})

blogSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)