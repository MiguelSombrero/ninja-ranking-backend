CREATE TABLE Account(
    id serial PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    username VARCHAR (50) UNIQUE NOT NULL,
    passwordhash VARCHAR (64) NOT NULL
 );

 CREATE TABLE Tournament(
    id serial PRIMARY KEY,
    account_id INTEGER,
    name VARCHAR (50) NOT NULL,
    created DATE NOT NULL,
    active BOOLEAN,
    FOREIGN KEY (account_id) REFERENCES Account (id) ON DELETE CASCADE
 );

 CREATE TABLE Player(
    id serial PRIMARY KEY,
    tournament_id INTEGER,
    nickname VARCHAR (50) NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES Tournament (id) ON DELETE CASCADE
 );

CREATE TABLE Result(
    id serial PRIMARY KEY,
    player_id INTEGER NOT NULL,
    time INTEGER NOT NULL,
    FOREIGN KEY (player_id) REFERENCES Player (id) ON DELETE CASCADE
 );

 CREATE TABLE Obstacle(
    id serial PRIMARY KEY,
    tournament_id INTEGER NOT NULL,
    name VARCHAR (50) NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES Tournament (id) ON DELETE CASCADE
 );

 CREATE TABLE ObstacleResult(
    result_id INTEGER,
    obstacle_id INTEGER,
    FOREIGN KEY (result_id) REFERENCES Result (id),
    FOREIGN KEY (obstacle_id) REFERENCES Obstacle (id)
 );