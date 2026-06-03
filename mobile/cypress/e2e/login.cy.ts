describe('Fluxo de Login', () => {
  beforeEach(() => {
    // Interceptando a chamada de login
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-cypress',
        user: {
          id: '1',
          nome: 'Cliente Cypress',
          email: 'cypress@teste.com',
          role: 'CLIENTE'
        }
      }
    }).as('loginRequest');
  });

  it('deve realizar login como CLIENTE e redirecionar para /explorar', () => {
    cy.visit('/login');

    // Preencher formulário
    cy.get('input[name="email"]').type('cypress@teste.com');
    cy.get('input[name="password"]').type('Senha123@');

    // Submeter
    cy.contains('button', 'Entrar').click();

    // Aguardar requisição
    cy.wait('@loginRequest');

    // Verificar redirecionamento
    cy.url().should('include', '/explorar');
  });

  it('deve realizar login como PROFISSIONAL e redirecionar para /painel/dashboard', () => {
    // Muda o mock para Profissional neste teste
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-cypress-prof',
        user: {
          id: '2',
          nome: 'Profissional Cypress',
          email: 'prof@teste.com',
          role: 'PROFISSIONAL'
        }
      }
    }).as('loginRequestProf');

    cy.visit('/login');

    cy.get('input[name="email"]').type('prof@teste.com');
    cy.get('input[name="password"]').type('Senha123@');
    cy.contains('button', 'Entrar').click();

    cy.wait('@loginRequestProf');
    cy.url().should('include', '/painel/dashboard');
  });
});
