# Validação CI/CD e Code Review

## Esteira Simulada

A branch `hotfix/broken-checkout` só poderá ser integrada se passar pelas seguintes validações:

## Backend

```bash
cd backend
npm install
npm run build
npx prisma generate
```

## Frontend

```bash
cd frontend
npm install
npm run build
```

## Testes Manuais

* Login.
* Cadastro.
* Consulta de disponibilidade.
* Criação de agendamento.
* Cancelamento de agendamento.
* Validação de mensagens de erro.

## Code Review

O Pull Request deve ser revisado por outro integrante da equipe.

O revisor deve verificar:

* clareza do código;
* boas práticas;
* Clean Code;
* princípios SOLID;
* segurança;
* ausência de credenciais;
* aderência ao escopo da correção;
* testes realizados.

## Aceite do Product Owner

O Product Owner só deve aprovar o merge se:

* os critérios de aceite foram cumpridos;
* o fluxo de agendamento voltou a funcionar;
* a consulta de disponibilidade foi validada;
* nenhuma credencial foi exposta;
* o Pull Request foi revisado.
