import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Form calls given event handler with correct details', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()

    const { container } = render(<BlogForm createBlog={mockHandler} />)
    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('Link')
    const submitButton = screen.getByText('Create')

    await user.type(titleInput, 'Test Blog')
    await user.type(authorInput, 'me')
    await user.type(urlInput, 'https://www.example.com')
    await user.click(submitButton)

    expect(mockHandler.mock.calls).toHaveLength(1)

    const receivedData = mockHandler.mock.calls[0][0]
    expect(receivedData.title).toBe('Test Blog')
    expect(receivedData.author).toBe('me')
    expect(receivedData.url).toBe('https://www.example.com')
})