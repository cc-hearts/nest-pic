FROM node:latest as base-node

LABEL maintainer="heart<7362469@qq.com>"

WORKDIR /usr/node-stencil

COPY . .

RUN rm -rf node_modules

RUN npm config set registry https://registry.npm.taobao.org

RUN npm i

RUN npm run build

EXPOSE 3000

CMD npm run start:prod

