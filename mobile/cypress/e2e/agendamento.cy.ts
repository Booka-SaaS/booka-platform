describe('Fluxo de Agendamento', () => {
  beforeEach(() => {
    // Mock login para bypass
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-cypress',
        user: { id: '1', role: 'CLIENTE', email: 'cliente@teste.com' }
      }
    }).as('loginRequest');

    // Mock das chamadas
    cy.intercept('GET', '**/profissionais/*', {
      statusCode: 200,
      body: {
        id: '1',
        nome: 'João Silva',
        profissao: 'Consultor de TI',
        servicos: [
          { id: 's1', nome: 'Consultoria Básica', preco: 100, duracaoMinutos: 60 }
        ]
      }
    }).as('getProfissional');

    cy.intercept('GET', '**/profissionais/*/disponibilidade*', {
      statusCode: 200,
      body: {
        slots: ['10:00', '11:00', '14:00']
      }
    }).as('getDisponibilidade');

    cy.intercept('POST', '**/agendamentos/publicos', {
      statusCode: 201,
      body: { message: 'Agendamento Confirmado', id: 'agen123' }
    }).as('criarAgendamento');
  });

  it('deve selecionar o profissional na página explorar e fazer o agendamento', () => {
    // Faz o login mockado
    cy.visit('/login');
    cy.get('input[name="email"]').type('cliente@teste.com');
    cy.get('input[name="password"]').type('SenhaForte123@!');
    cy.contains('button', 'Entrar').click();
    cy.wait('@loginRequest');

    // Acessa a página explorar
    cy.visit('/explorar');

    // Clica no primeiro card de profissional para redirecionar para /agendar/:id
    // Como é um loop, vamos clicar no que contem "Consultor de TI"
    cy.contains('Consultor de TI').click();

    // Aguarda carregar dados do profissional
    cy.wait('@getProfissional');

    // A URL deve mudar para /agendar/1
    cy.url().should('include', '/agendar/1');

    // Clica em um dia disponível no calendário (por exemplo dia 15)
    cy.contains('button.aspect-square', '15').click();
    
    // Aguarda carregar horários
    cy.wait('@getDisponibilidade');

    // Seleciona um horário (ex: 10:00)
    cy.contains('10:00').click();

    // Clica em Confirmar/Finalizar
    cy.contains('button', 'Confirmar Agendamento').click();

    // Aguarda a chamada POST
    cy.wait('@criarAgendamento');

    // Como o ModalService usa window.alert nativo, o Cypress auto-aceita o alerta e aciona o callback.
    // Basta verificar se o redirecionamento para /explorar ocorreu com sucesso.
    cy.url().should('include', '/explorar');
  });
});
