# backend-mini-project

API REST permettant à des utilisateurs authentifiés de gérer leurs projets et les tâches associées.

## Auteurs

- Salim Mgaidi, 1ère année, ISIDS

## Project Architecture

```
backend-mini-project/
├── .env                    (local only, not committed)
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── server.js
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   └── Task.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── project.controller.js
    │   └── task.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── project.routes.js
    │   └── task.routes.js
    ├── middlewares/
    │   ├── auth.js
    │   └── ValidateObjectId.js
    └── utils/
        ├── ApiError.js
        ├── handleError.js
        └── buildListQuery.js

```

## API Routes

Base URL: `http://localhost:3000`

### Auth

- `POST /auth/register`: create account
- `POST /auth/login`: get token
- `GET /auth/me`: current user

### Projects

- `POST /projects`: create project
- `GET /projects`: list projects
- `GET /projects/:id`: get project
- `PUT /projects/:id`: update project
- `DELETE /projects/:id`: delete project

### Tasks

- `POST /projects/:projectId/tasks`: create task
- `GET /projects/:projectId/tasks`: project tasks
- `GET /tasks`: list tasks
- `GET /tasks/:id`: get task
- `PUT /tasks/:id`: update task
- `DELETE /tasks/:id`: delete task

### Search and sort

- `?search=api`: search
- `?status=done`: filter by status
- `?sort=name` or `?sort=-createdAt`: sort

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Bruno (API Testing)

## Notes

- The `login` field of the User schema is replaced by `email`.

## Functional Testing:

All endpoints were tested manually with Bruno and passed.

- Auth: register, login, current user, invalid credentials, missing or invalid token
- Projects: create, list, get, update, delete, validation errors, access control
- Tasks: create, list, get, update, delete, status validation, manager-only assignment
- Search, filter and sort on projects and tasks
- Deleting a project deletes its tasks

## Installation

```
npm install
cp .env.example .env
npm run dev

```