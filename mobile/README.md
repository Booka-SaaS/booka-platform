# Booka Mobile

App mobile do Booka, mantido dentro do monorepo em `mobile/`.

## Stack

- Angular 19
- Ionic Angular
- Capacitor
- TypeScript
- Cypress para testes e2e

## Pre-requisitos

- Node.js 18 ou superior
- npm
- Android Studio para builds Android
- Xcode e CocoaPods para builds iOS em macOS

## Instalacao

```bash
cd mobile
npm install
```

## Execucao local

```bash
npm start
```

Por padrao, a aplicacao usa `http://localhost:3001` como URL da API nos arquivos:

```text
src/environments/environment.ts
src/environments/environment.development.ts
```

## Variaveis de ambiente

Use `mobile/.env.example` como referencia quando a URL da API precisar ser documentada para o ambiente local ou de deploy.

```env
API_URL=http://localhost:3001
```

## Comandos uteis

```bash
npm run build
npm run e2e
npm run e2e:open
npx cap sync
```

## Android

```bash
npm run build
npx cap sync android
npx cap open android
```

O build final deve ser gerado pelo Android Studio, ajustando assinatura, versionamento e variaveis de producao antes de publicar na Google Play.

## iOS

```bash
npm run build
npx cap sync ios
npx cap open ios
```

O build iOS exige macOS com Xcode. Antes da publicacao na App Store, revisar bundle id, certificados, perfis de assinatura e URLs de producao.
