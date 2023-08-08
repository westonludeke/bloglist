describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Weston Admin',
      username: 'admin',
      password: '12345'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Blog')
    cy.contains('Cool Tech Blogs!')
  })

  it('login form can be opened', function() {
    cy.contains('sign in').click()
  })

  it('login fails with wrong password', function() {
    cy.contains('sign in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .contains('Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Weston Admin logged in')
  })

  it('user can log in', function() {
    cy.contains('sign in').click()
    cy.get('#username').type('admin')
    cy.get('#password').type('12345')
    cy.get('#login-button').click()

    cy.contains('Weston Admin logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: '12345' }) 
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress mccypress')
      cy.get('#url').type('cypress.io')
      cy.contains('Add Blog').click()
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'queen cypress',
          url: 'queencypress.com'
        })
      })
    })
  })
})

