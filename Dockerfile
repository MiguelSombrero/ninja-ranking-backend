FROM node

WORKDIR /app
COPY . /app

RUN rm -rf node_modules/ && \
    npm install && \
    npm build

USER node

EXPOSE 3001

CMD npm run start