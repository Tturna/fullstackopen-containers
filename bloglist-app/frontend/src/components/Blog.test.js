import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let testContainer
let mockUpdater
beforeEach(() => {
    const blog = {
        title: 'Test Blog',
        author: 'me',
        url: 'https://www.example.com',
        likes: 10,
        creator: 'dude'
    }

    const mockUser = 'funiuser'
    mockUpdater = jest.fn()
    const mockRemover = jest.fn()

    const { container } = render(
        <Blog
            blog={blog}
            updateBlog={mockUpdater}
            removeBlog={mockRemover}
            loggedUser={mockUser}
        />
    )

    testContainer = container
})

test('Renders title and author but no URL or likes', () => {
    // We assume url and likes are children of blogDetails :)
    screen.getByText('\'Test Blog\' by me')
    const blogDetails = testContainer.querySelector('.blogDetails')
    expect(blogDetails).toHaveStyle('display: none')
})

test('url and likes are shown once the "View" button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    const mockHandler = jest.fn()

    const ogCallback = button.onclick
    button.onclick = (event) => {
        mockHandler(event)
        ogCallback(event)
    }

    await user.click(button)

    // We assume that the url and like count are visible when their parent
    // (blogDetails) is visible :)
    expect(mockHandler.mock.calls).toHaveLength(1)
    const blogDetails = testContainer.querySelector('.blogDetails')
    expect(blogDetails).not.toHaveStyle('display: none')
})

test('Clicking "like" twice calls the updater callback twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Like')
    await user.click(button)
    await user.click(button)

    expect(mockUpdater.mock.calls).toHaveLength(2)
})