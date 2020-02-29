CREATE TABLE Account(
    id serial PRIMARY KEY,
    name VARCHAR (50)   NOT NULL,
    username VARCHAR (50) UNIQUE NOT NULL,
    passwordHash VARCHAR (64) NOT NULL
 );