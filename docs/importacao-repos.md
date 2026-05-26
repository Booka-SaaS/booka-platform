# Importação dos repositórios

Este documento registra como os repositórios principais do BOOKA foram importados para o novo monorepo `Booka-SaaS/booka-platform`.

## Regras

- Os repositórios originais foram usados somente como origem de leitura.
- Nenhum push foi feito para os repositórios de origem.
- Nenhuma branch dos repositórios de origem foi apagada.
- Nenhum histórico dos repositórios de origem foi reescrito.
- O frontend e o backend foram mantidos em pastas separadas.

## Repositórios importados

| Projeto | Origem | Branch | Destino | Commit importado |
| --- | --- | --- | --- | --- |
| Frontend principal | https://github.com/TrueTrailBlazer/booka-frontend | `main` | `frontend/` | `885cc9dd8f1f5e42a11a63c55738d1df0e69ae72` |
| Backend principal | https://github.com/RubensGJ/BookaBackendV2 | `master` | `backend/` | `d8514d387195381be04afb633625376aa09c27e9` |

## Comandos usados

```bash
git remote add frontend-origin https://github.com/TrueTrailBlazer/booka-frontend.git
git fetch frontend-origin
git subtree add --prefix=frontend frontend-origin main

git remote add backend-origin https://github.com/RubensGJ/BookaBackendV2.git
git fetch backend-origin
git subtree add --prefix=backend backend-origin master
```

## Como repetir localmente

Caso seja necessario recriar a importacao em outro clone vazio:

```bash
git init
git add README.md .gitignore .env.example docs/importacao-repos.md
git commit -m "chore: initialize booka platform monorepo"

git remote add frontend-origin https://github.com/TrueTrailBlazer/booka-frontend.git
git fetch frontend-origin
git subtree add --prefix=frontend frontend-origin main

git remote add backend-origin https://github.com/RubensGJ/BookaBackendV2.git
git fetch backend-origin
git subtree add --prefix=backend backend-origin master
```

## Repositorios apenas referenciados

Os repositórios abaixo não foram copiados para dentro do monorepo neste momento:

- https://github.com/Giullianoads/booka-frontend
- https://github.com/Giullianoads/booka-app

Eles devem ser analisados separadamente antes de qualquer migração manual de melhorias.
