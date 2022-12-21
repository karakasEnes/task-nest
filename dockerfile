FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN yarn --cwd client/ install

COPY server/package*.json server/
RUN yarn --cwd server/ install

COPY client/ client/

COPY server/ server/
COPY client/build/ server/public/
RUN yarn --cwd server/ build


USER node

CMD [ "yarn", "--cwd", "server/", "start:prod-unix" ]

EXPOSE 8383