# Library Management App Description (Quick Draft)

This file contains basic draft information about the construction of this application and the technologies
used to give an idea of the implementation required.

## What it is?

It is a REST API application designed to manage two resources and their relationships effectively.

## Technologies

- Environment is `Node.js`.
  - Minimum version is `20.17.0` for development.
- Language is `TypeScript`.
- Package manager is `npm`.
- Framework is `Express.js`.
- Database is `SQLite3` using `Prisma ORM` for case portability reasons.
  - Adaptable to other relational databases supported by Prisma.
  - Tables are created using Prisma migrations.
- Validation is done using `Zod`.
- Caching is done using `cache-manager`.
  - Under the hood, it uses Keyv by default. Configurable to use Redis or other supported stores.
- Production build generated using `tsc` with target `ES2020`.
  - Compiler paths are resolved using `tsc-alias` within build script.

## Expected Inputs and Outputs

- It is provided with a Postman collection for designing database tables and testing the API endpoints.
  - Collection name is `Library Case API Collection`, schema version `2.1.1`.
- No delete method is provided for the resources.

## Resources

- `users`: Users of the library system.
- `books`: Books available in the library system.
- `ratings`: Scores given by users to books with retrurs.

## Relationships

- `users` and `books` have a one-to-many relationship.
- `ratings` defines a many-to-many relationship between `users` and `books`.

## Defined Endpoint Descriptions To Be Implemented

- Listing users  
- Accessing information about a user (name, books borrowed in the past with their user 
  scores, and currently borrowed books)  
- Creating a new user 
- Listing books 
- Accessing information about a book (name and average rating). Book viewing should be 
  considered as a process much more frequent than borrowing and returning. 
- Creating a new book 
- Borrowing a book 
- Returning a book and giving a rating 
