FROM node:20.16.0-alpine
  
WORKDIR /ops_web
COPY . .

RUN npm install -g pnpm
RUN pnpm install && pnpm run build

FROM nginx:alpine

COPY docker-compose/nginx/my.conf /etc/nginx/conf.d/ops_web.conf
COPY --from=0 /ops_web/dist /usr/share/nginx/html
RUN cat /etc/nginx/nginx.conf
RUN cat /etc/nginx/conf.d/ops_web.conf
RUN ls -al /usr/share/nginx/html