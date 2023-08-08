describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3003')
  })

  it('front page can be opened', function() {
    cy.contains('Blog')
    cy.contains('Cool Tech Blogs!')
  })

  it('login form can be opened', function() {
    cy.contains('sign in').click()
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
      cy.contains('sign in').click()
      cy.get('input:first').type('admin')
      cy.get('input:last').type('12345')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#Title').type('a blog created by cypress')
      cy.contains('Add Blog').click()
      cy.contains('a note blog by cypress')
    })
  })
})

