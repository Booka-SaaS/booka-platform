# Gitflow — Dia do Caos no Booka

## Branch da entrega EC2

```bash
git checkout main
git pull origin main
git checkout -b ec2/dia-do-caos-squad
```

## Branch de hotfix simulada

```bash
git checkout main
git pull origin main
git checkout -b hotfix/broken-checkout
git push -u origin hotfix/broken-checkout
```

## Commits sugeridos

```bash
git add .
git commit -m "docs: adiciona estrutura da atividade ec2 dia do caos"
git commit -m "docs: adiciona kanban e cards do github projects"
git commit -m "docs: adiciona documentacao latex da atividade"
git commit -m "docs: adiciona postmortem e retrospectiva"
git commit -m "docs: registra fluxo gitflow e validacao ci cd"
```

## Regras

* Não commitar direto na `main`.
* Toda correção deve passar por Pull Request.
* Toda alteração deve ser revisada por outro integrante.
* Nenhuma credencial real deve ser versionada.
