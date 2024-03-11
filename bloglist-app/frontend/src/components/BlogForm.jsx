import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const addBlog = async (event) => {
        event.preventDefault()
        const newBlog = {
            title: newTitle,
            author: newAuthor,
            url: newUrl
        }

        createBlog(newBlog)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }

    return (
        <div>
            <h3>New Blog</h3>
            <form onSubmit={addBlog}>
                <div>
                    Title
                    <input
                        type='text'
                        value={newTitle}
                        placeholder='Title'
                        id='titleInput'
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                </div>
                <div>
                    Author
                    <input
                        type='text'
                        value={newAuthor}
                        placeholder='Author'
                        id='authorInput'
                        onChange={(e) => setNewAuthor(e.target.value)}
                    />
                </div>
                <div>
                    Url
                    <input
                        type='text'
                        value={newUrl}
                        placeholder='Link'
                        id='urlInput'
                        onChange={(e) => setNewUrl(e.target.value)}
                    />
                </div>
                <button type='submit'>Create</button>
            </form>
        </div>
    )
}

export default BlogForm