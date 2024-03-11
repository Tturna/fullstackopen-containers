const baseUrl = 'http://localhost:3003'

describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', `${baseUrl}/api/testing/reset`)
        cy.request('POST', `${baseUrl}/api/users`, {
            username: 'testdude', password: 'password'
        }).then(response => {
            localStorage.setItem('loggeduser', JSON.stringify(response.body))
            cy.visit('http://localhost:5173')
        })
    })

    it('Login form is shown', function() {
        cy.contains('Log in to application')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#usernameInput').type('testdude')
            cy.get('#passwordInput').type('password')
            cy.contains('login').click()
            cy.contains('Logged in as testdude')
        })

        it('fails with wrong credentials', function() {
            cy.get('#usernameInput').type('wrong username')
            cy.get('#passwordInput').type('wrong password')
            cy.contains('login').click()
            cy.contains('Wrong username or password')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            // Felt cute, might refactor this later
            cy.get('#usernameInput').type('testdude')
            cy.get('#passwordInput').type('password')
            cy.contains('login').click()
            cy.contains('Logged in as testdude')
        })

        it('A blog can be created', function() {
            cy.contains('New Blog').click()
            cy.get('#titleInput').type('Test Blog')
            cy.get('#authorInput').type('Test Author')
            cy.get('#urlInput').type('https://www.example.com')
            cy.contains('Create').click()
            cy.contains('\'Test Blog\' by Test Author')
        })

        it.only('Blogs are ordered by likes', function() {
            cy.intercept('POST', '/api/blogs').as('createBlog')
            cy.intercept('PUT', '/api/blogs/*').as('updateBlog')

            for (let i = 0; i < 3; i++) {
                cy.contains('New Blog').click()
                cy.get('#titleInput').type('Blog' + i)
                cy.get('#authorInput').type('Author' + i)
                cy.get('#urlInput').type('https://www.example.com')
                cy.contains('Create').click()

                cy.wait('@createBlog')

                cy.get('.blog:last').contains('View').click()
                cy.get('.likeBtn:last').then($btn => {
                    const clickAndWait = index => {
                        if (index < i) {
                            $btn.click()
                            cy.wait('@updateBlog').then(() => {
                                clickAndWait(index + 1)
                            })
                        }
                    }

                    clickAndWait(0)
                })
            }

            cy.get('.blog:first').contains('Blog2')
        })

        describe('With existing blog data', function() {
            beforeEach(() => {
                cy.contains('New Blog').click()
                cy.get('#titleInput').type('Test Blog')
                cy.get('#authorInput').type('Test Author')
                cy.get('#urlInput').type('https://www.example.com')
                cy.contains('Create').click()
                cy.get('.blog')
            })

            it('Users can like a blog', function() {
                cy.contains('View').click()
                cy.get('.likes').contains('0')
                cy.contains('Like').click()
                cy.get('.likes').contains('1')
            })

            it('Users can delete their blogs', function() {
                cy.contains('View').click()
                cy.contains('Delete').click()
                cy.get('.blog').should('not.exist')
            })

            it('Users can only see a Delete button for their own blogs', function() {
                // new user
                cy.contains('Logout').click()

                // this should probably be refactored
                cy.request('POST', `${baseUrl}/api/users`, {
                    username: 'testdude2', password: 'password'
                }).then(response => {
                    localStorage.setItem('loggeduser', JSON.stringify(response.body))
                    cy.visit('http://localhost:5173')
                })

                // should definitely be refactored at this point
                cy.get('#usernameInput').type('testdude2')
                cy.get('#passwordInput').type('password')
                cy.contains('login').click()
                cy.contains('Logged in as testdude2')

                cy.contains('View').click()
                cy.contains('Delete').should('not.exist')
            })
        })
    })
})