FROM node:20-alpine AS builder

ENV NODE_ENV build

RUN apk add --no-cache \
    autoconf \
    automake \
    build-base \
    libtool \
    bash \
    git \
    zlib-dev \
    && rm -rf /var/cache/apk/*
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production

ENV NODE_ENV production
ENV TZ America/Sao_Paulo
WORKDIR /usr/src/app

COPY --from=builder /app/package.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]