-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS books_users CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users_recipes CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  image_id TEXT NOT NULL
);

CREATE TABLE books_users (
  book_id BIGINT REFERENCES books(id),
  user_id BIGINT REFERENCES users(id)
);

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  book_id BIGINT REFERENCES books(id),
  page_number BIGINT,
  ingredients TEXT [],
  rating SMALLINT,
  image_id TEXT
);

CREATE TABLE notes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content TEXT NOT NULL,
  private BOOLEAN,
  user_id BIGINT REFERENCES users(id),
  recipe_id BIGINT REFERENCES books(id)
);

CREATE TABLE users_recipes (
  user_id BIGINT REFERENCES users(id),
  recipe_id BIGINT REFERENCES recipes(id),
  cooked BOOLEAN

);





