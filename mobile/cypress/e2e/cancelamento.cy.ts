describe('Fluxo de Cancelamento', () => {
  beforeEach(() => {
    // Intercepta o login para simular sucesso como PROFISSIONAL
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-cypress',
        user: { id: '2', role: 'PROFISSIONAL', email: 'prof@teste.com' }
      }
    }).as('loginRequest');

    // Mock dos agendamentos (Agenda)
    cy.intercept('GET', '**/agendamentos', {
      statusCode: 200,
      body: [
        {
          id: 'agen1',
          inicio: '2025-10-15T10:00:00Z',
          status: 'PENDENTE',
          servico: { nome: 'Consultoria Básica', preco: 100 },
          cliente: { nome: 'Cliente Teste' }
        }
      ]
    }).as('getAgendamentos');

    // Mock da action de exclusão
    cy.intercept('DELETE', '**/agendamentos/agen1', {
      statusCode: 200,
      body: { message: 'Cancelado com sucesso' }
    }).as('cancelarAgendamento');
  });

  it('deve listar agendamentos na agenda e permitir cancelar (Faltou)', () => {
    // O mock do alert
    cy.on('window:alert', cy.stub().as('alertStub'));

    // Realiza o login mockado via UI
    cy.visit('/login');
    cy.get('input[name="email"]').type('prof@teste.com');
    cy.get('input[name="password"]').type('SenhaForte123@!'); // Evita alerta de vazamento do Google
    cy.contains('button', 'Entrar').click();
    cy.wait('@loginRequest');

    // Aguarda o app redirecionar para o dashboard (Ionic animation finish)
    cy.url().should('include', '/painel/dashboard');

    // Navega para a Agenda clicando na tab bar do Ionic (evita encavalar <ion-router-outlet>)
    cy.get('ion-tab-button[tab="agenda"]').click();
    cy.wait('@getAgendamentos');

    // Aguarda a animação de transição de telas do Ionic (ion-router-outlet) terminar
    cy.wait(800);

    // Verifica se renderizou o agendamento (exist, para ignorar sobreposição de animação caso demore)
    cy.contains('Consultoria Básica').should('exist');
    cy.contains('Cliente Teste').should('exist');

    // Clica no botão de Faltou forçando o clique, caso a tab anterior ainda esteja sumindo
    cy.contains('button', 'Faltou').click({ force: true });

    // Aguarda chamada DELETE
    cy.wait('@cancelarAgendamento');

    // Verifica se alert foi chamado
    cy.get('@alertStub').should('have.been.calledWith', 'Cancelado com sucesso!');

    // Verifica se a UI reagiu removendo da lista
    cy.contains('Cliente Teste').should('not.exist');
  });
});
