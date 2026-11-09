# backend-mini-project
une API REST permettant à des utilisateurs authentifiés de gérer leurs projets et les tâches associées.

Salim Mgaidi 1er  ISIDS

Project Architecture

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