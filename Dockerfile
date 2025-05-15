FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

CMD [ "npm install && npm run build" ]