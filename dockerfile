FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN yarn --cwd client/ install --production=true

COPY server/package*.json server/
RUN yarn --cwd server/ install --production=true

COPY client/ client/
RUN yarn build:unix

COPY server/ server/

USER node

CMD [ "yarn", "--cwd", "server/", "start:prod-unix" ]

EXPOSE 8383