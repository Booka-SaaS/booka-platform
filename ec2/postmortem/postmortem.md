# Postmortem — Dia do Caos no Booka

## Resumo do Incidente

Após o deploy da nova versão do Booka, parte dos usuários passou a enfrentar falhas ao tentar criar agendamentos. Além disso, a consulta de disponibilidade apresentou lentidão significativa.

## Impacto

O problema afetou clientes que tentavam confirmar horários com prestadores de serviço. Como consequência, alguns agendamentos não foram concluídos e houve risco de perda de oportunidades para os prestadores cadastrados.

## Causa Raiz

A falha foi causada por uma alteração recente na validação de disponibilidade, que gerava consultas mais pesadas no banco de dados e impedia a criação correta de alguns agendamentos.

## Correção Aplicada

A equipe criou a branch `hotfix/broken-checkout`, revisou a lógica da rota de agendamento, otimizou a consulta ao banco de dados, simulou e resolveu um Merge Conflict e validou a correção por meio de Pull Request e revisão cruzada.

## Ações Preventivas

- Criar testes automatizados para o fluxo de agendamento.
- Revisar consultas críticas antes de novos deploys.
- Manter variáveis sensíveis fora do repositório.
- Reforçar o uso de Pull Requests.
- Melhorar o monitoramento das rotas principais.
- Criar checklist de deploy.
- Validar migrations antes de publicar em produção.

## Responsáveis

- Product Owner: Matheus Victor Moreira Yamanari.
- Scrum Master: Matheus Victor Moreira Yamanari.
- Desenvolvedores: Equipe Booka.
