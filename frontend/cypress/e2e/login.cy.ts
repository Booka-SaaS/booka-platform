describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('displays the login form', () => {
    cy.get('h1').contains('Entrar na conta')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('Entrar no Painel').should('be.visible')
  })

  it('shows error when submitting empty form', () => {
    cy.get('button').contains('Entrar no Painel').click()
    cy.contains('Por favor, preencha todos os campos!').should('be.visible')
  })

  it('attempts login with wrong credentials', () => {
    // Intercept backend request to return 401
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('loginRequest')

    cy.get('input[type="email"]').type('wrong@booka.com')
    cy.get('input[type="password"]').type('wrong123')
    cy.get('button').contains('Entrar no Painel').click()

    cy.wait('@loginRequest')
    cy.contains('Email ou senha incorretos. Tente novamente.').should('be.visible')
  })
})
