DROP DATABASE IF EXISTS crude_cards;
CREATE DATABASE crude_cards;

\c crude_cards

CREATE TABLE users (
	id serial PRIMARY KEY,
	username varchar(32) NOT NULL,
	discord_id varchar(32) UNIQUE,
	google_id varchar(32) UNIQUE
);

CREATE TABLE decks (
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	owner_id int REFERENCES users (id),
	cardcast_id varchar(8) UNIQUE,
	white_cards varchar(500)[],
	black_cards varchar(500)[]
);

INSERT INTO users (username) VALUES ('Server');
