# backend-mini-project

API REST permettant à des utilisateurs authentifiés de gérer leurs projets et les tâches associées.

## Auteurs

- Salim Mgaidi, 1ère année, ISIDS

## Project Architecture

```
project-api/
├── .env                  (local only, not committed)
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── server.js             entry point: loads .env, connects the DB, starts the server
└── src/
    ├── app.js            Express setup (middlewares, routes, error handling)
    ├── config/
    │   └── db.js         MongoDB connection
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
    │   ├── auth.js               protect (JWT check) and authorize (roles)
    │   ├── validateObjectId.js
    │   └── errorHandler.js       notFound and errorHandler
    └── utils/
        ├── ApiError.js
        ├── asyncHandler.js
        └── buildListQuery.js     search, filter, sort, pagination
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