FROM node:10

WORKDIR /app
COPY . /app

RUN npm install

USER node

CMD npm run watch