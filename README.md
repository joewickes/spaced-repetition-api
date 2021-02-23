# Spaced Repetition API

## Live Link: https://spaced-repetition-bice.vercel.app/

## Front End Repo: https://github.com/joewickes/spaced-repetition/tree/main

## Table of Contents
- [Summary](##-summary)
- [How To Use It](##-how-to-use-it)
- [Technologies Used](##-technologies-used)

## Summary
Spaced repetition is an app that helps users learn new words in a foreign language with the spaced repetition technique.

As a user I can
- While Logged Out
  - Get automatically redirected to the Sign Up page
  - Click on either Sign Up or Log In and get redirected to either page
- While Logged In
  - I can see a list of my words
  - I can start learning
  - I can guess the answer for each word
  - I can see a response for my guess
  - I can try the next word
  - I can log out

## How To Use It
Here are the different API endpoints, what kind of data they take, and what kind of end result to expect

Endpoint: /api/auth/token
- Request Type: POST
- Expected Data Type: Object with username and password
- Happy Path Response: A 200 with an auth token

-----

Endpoint: /api/auth/token
- Request Type: PATCH
- Expected Data Type: Object with user id, user name, and jwt secret
- Happy Path Response: A 200 with a refreshed token

-----

Endpoint: /api/language
- Request Type: GET
- Expected Data Type: N/A
- Happy Path Response: A 200 with a object with a user's language and words

-----

Endpoint: /api/language/head
- Request Type: GET
- Expected Data Type: Object with user id
- Happy Path Response: A 200 with a object with a users languages

-----

Endpoint: /api/language/guess
- Request Type: POST
- Expected Data Type: Object with guess
- Happy Path Response: A 200 with an object with a next word, total score, correct and incorrect count, an answer, and whether the guess was correct or not

-----

Endpoint: /api/user
- Request Type: POST
- Expected Data Type: Object with username, password, and name
- Happy Path Response: A 201 with a object with a serialized user (and populates language words)

## Technologies Used
- Node
- Express
- Knex
- PostgreSQL
- Helmet
- Postgrator
- Morgan
- JWT
- CORS
- BcryptJS
- Body-Parser
- Chai (development)
- Mocha (development)
- Nodemon (development)
- Supertest (development)