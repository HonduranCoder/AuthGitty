-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
-- users table 
-- twitters table (posts table) 
DROP TABLE IF EXISTS users CASCADE; 
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE users(
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL, 
  email TEXT 
);

CREATE TABLE posts(
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- connect the user to their posts
  user_id BIGINT REFERENCES users(id) NOT NULL, 
  post TEXT NOT NULL
);