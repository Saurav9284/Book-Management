# Book-Management Backend

## Introduction

The backend for the Book Management System supports CRUD operations, user authentication, and filtering by author and publication year.

## Project Type

Backend 

## Deplolyed App

- 🌐 <a href='https://book-management-theta.vercel.app/'>Link</a>

## Directory Structure

```
- src/
  - Config/
    - db.js
  - Controllers/
    - user.controller.js
    - book.controller.js
  - Models/
    - book.model.js
    - user.model.js
  - index.js
```


## Video Walkthrough of the project


## Video Walkthrough of the codebase


## Features

- Authentication
- Protected Routes
- CURD Operations

## Installation & Getting started

```bash
clone the repo
npm install
nodemon index.js
```

## Credentials

```
- email - admin@gmail.com
- password - Admin@123
```

## API Endpoints

```
- Server check ==> app/

🟢 Authentication :-

- Signup - /user/register

- GET - /user/login

🟢 CURD Products :-

- GET - /book/

- GET/ID - /book/:id

- POST - /book/

- PATCH - /book/edit/:id

- DELETE - /book/delete/:id

🟢 Queries :-

- Filter by Author name - /book?author=name

- Filter by publication year - /book?year=year

```

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
