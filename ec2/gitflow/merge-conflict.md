# Simulação de Merge Conflict

## Objetivo

Simular um conflito de merge em um arquivo de configuração, conforme solicitado na atividade.

## Arquivo sugerido

`README.md` ou `backend/.env.example`

## Fluxo sugerido

### Desenvolvedor 1

```bash
git checkout -b conflict/dev-1
```

Alterar o arquivo escolhido.

```bash
git add .
git commit -m "chore: altera configuracao pelo dev 1"
git push -u origin conflict/dev-1
```

### Desenvolvedor 2

```bash
git checkout main
git pull origin main
git checkout -b conflict/dev-2
```

Alterar o mesmo trecho do mesmo arquivo.

```bash
git add .
git commit -m "chore: altera configuracao pelo dev 2"
git push -u origin conflict/dev-2
```

## Resolução

Durante a resolução do conflito:

* remover marcações `<<<<<<<`, `=======` e `>>>>>>>`;
* manter apenas as alterações corretas;
* não expor credenciais;
* validar o arquivo final;
* registrar a resolução no Postmortem.

## Cuidados de Segurança

Não expor:

* `DATABASE_URL` real;
* `DIRECT_URL` real;
* `JWT_SECRET` real;
* `SUPABASE_SERVICE_ROLE_KEY` real;
* tokens;
* senhas;
* chaves privadas.
