FROM node:20.16

WORKDIR /ops_web/
COPY . .

RUN pnpm install && pnpm run build