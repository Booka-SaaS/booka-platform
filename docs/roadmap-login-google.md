# Roadmap: Login com Google

Origem da ideia:

- https://github.com/Giullianoads/booka-frontend

O frontend alternativo possui um prototipo de Login com Google usando Google Identity Services. Esse codigo nao foi copiado diretamente porque o backend atual ainda nao possui a rota `POST /auth/google`.

## Objetivo

Adicionar login social com Google mantendo o backend Express/Prisma como autoridade de autenticacao da plataforma.

## Arquitetura recomendada

```text
Google Identity Services -> Frontend Angular -> POST /auth/google -> Backend -> Prisma -> JWT BOOKA
```

O frontend deve receber o credential/token do Google e enviar para o backend. O backend deve validar o token com o Google, criar ou localizar o usuario no banco, e emitir o JWT interno do BOOKA.

## Backend

Criar rota:

```http
POST /auth/google
```

Payload sugerido:

```json
{
  "credential": "google-id-token",
  "role": "CLIENTE"
}
```

Responsabilidade do backend:

- Validar o token do Google.
- Conferir `aud` contra `GOOGLE_CLIENT_ID`.
- Normalizar email.
- Criar usuario caso nao exista.
- Reaproveitar usuario existente quando o email ja existir.
- Emitir o mesmo formato de resposta de `POST /auth/login`.

Variaveis sugeridas:

```env
GOOGLE_CLIENT_ID=
```

## Frontend

Somente depois do backend pronto:

- Adicionar `GOOGLE_CLIENT_ID`/config equivalente sem hardcode sensivel.
- Carregar Google Identity Services.
- Renderizar botao oficial do Google.
- Enviar `credential` para `POST /auth/google`.
- Manter login por email/senha funcionando.

## Testes

- Login comum continua funcionando.
- Login Google cria usuario cliente.
- Login Google reaproveita usuario existente.
- Token invalido retorna 401.
- `aud` incorreto retorna 401.
- Usuario profissional nao perde contexto de loja/onboarding.

## Decisao atual

Nao importar o prototipo diretamente. Usar este roteiro quando a feature entrar no backlog ativo.
