## Task Manager App - About

An app for managing tasks to be completed.

### Use Cases

All users must register an account with their email address and a password.

Registered users can:

- Log in, log out.

- Edit their account profile information (name, email, password, age, profile picture).

- Add, read, edit, delete their tasks.

- Delete their account.

### Design

The server is a REST API built with Node and Express. User data is stored in MongoDB database. User authentication is done with JSON Webtokens.

The production API is hosted on Heroku.
The production DB is hosted on MongoDB Atlas.

The app currently has no front end. All interaction with the API must be done thru HTTP requests (such as via Postman).