FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npm run prisma:generate

COPY tsconfig.json ./
COPY src ./src
COPY services ./services
COPY tests ./tests

RUN npm run build

CMD ["npm", "run", "start"]
