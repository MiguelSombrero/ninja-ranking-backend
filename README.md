# Ninja Ranking (backend)

*This app is on (very slow) development*

Ninja Ranking is my personal project made for my friend. It's a web application for keeping track of [Ninja Warrior](https://en.wikipedia.org/wiki/American_Ninja_Warrior) tournaments. You can create Ninja Warrior tournament, add players and obstacles, and compete with each other. This app keeps track of players performances and shows some data etc. 

## Ninja Ranking live

This app is running live on Heroku:
(may not stay up forever)

[Ninja Ranking](https://ninja-ranking.herokuapp.com/)

### Development stack

Database
- PostgreSQL ([schema](https://github.com/MiguelSombrero/ninja-ranking-backend/tree/master/docs/database.md))

Backend
- NodeJS + Express

Frontend
- ReactJS

Proxy
- Nginx

Deployment
- Docker
- Docker compose

## Clone the project

    git clone https://github.com/MiguelSombrero/ninja-ranking-backend
    cd ninja-ranking-backend

## Requirements

Application is running on Docker and Docker Compose. If you don't want to run this app dockerized, you need to provide environment variables and database, corresponding to what is defined in `docker-compose*.yml`files.

`docker-compose*.yml` files expects to find frontend from relative path `../ninja-ranking-frontend`, so clone [Ninja Ranking frontend](https://github.com/MiguelSombrero/ninja-ranking-frontend) to your machine before building images.

## Run the application

Application root folder contains `docker-compose.yml`and `docker-compose.dev.yml` files, where you can configure you deployment. File with `.dev`prefix is for development environment, and the other one is for production.

Application uses postgreSQL image as database. **Note that postgreSQL is mounted on `./data` folder in both, development and production environments**. Nginx is used for proxy between backend and frontend. 

### Run in production mode

    docker-compose build
    docker-compose up

### Run in development mode

    docker-compose -f docker-compose.dev.yml build
    docker-compose -f docker-compose.dev.yml up

When in development mode, you can run tests by entering to backend container and running tests there

    docker exec -it ninja-back bash
    npm test

## Application is running on

    http://localhost

## Icons

Icons for this project is loaned from

[Font Awesome](https://fontawesome.com/)

[Github Octicons](https://octicons.github.com/)