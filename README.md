# Task Manager

A full-stack task management app. Users sign up, log in, and manage their own
tasks — create, edit, delete, mark complete/pending, filter, and search. Built
with React on the front end and a Node/Express + MongoDB REST API on the back end.

> New here? Follow [USAGE.md](./USAGE.md) for a step-by-step walkthrough of
> running and using the app.

## Tech stack

**Frontend**
- React 18 (functional components + hooks)
- React Router for routing
- Context API for auth state
- Axios for API calls
- Plain CSS with variables (light/dark theme, responsive)
- Vite as the build tool / dev server

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication (`jsonwebtoken`) + `bcryptjs` for password hashing
- `express-validator` for request validation
- `helmet`, `cors`, `morgan` for security/logging

## Features

- Email/password signup and login with JWT
- Protected task routes — each user only sees their own tasks
- Full task CRUD
- Toggle a task between completed and pending
- Filter by All / Pending / Completed
- Search tasks by title (debounced)
- Pagination
- Responsive layout for desktop and mobile
- Light/dark theme (remembered across visits)
- Centralised error handling and form validation on both ends
- Docker / docker-compose setup and role field for role-based access

## Project structure

```
task-manager/
├── docker-compose.yml        # Mongo + API + web, one command to run it all
├── README.md
├── USAGE.md                  # step-by-step usage guide
│
├── server/                   # Express + MongoDB API
│   ├── Dockerfile
│   ├── .env.example
│   └── src/
│       ├── server.js         # entry point, DB connect + listen
│       ├── app.js            # express app, middleware, routes
│       ├── config/db.js      # mongoose connection
│       ├── models/           # User, Task (mongoose schemas)
│       ├── controllers/      # auth + task request handlers
│       ├── routes/           # auth + task routers with validation
│       └── middleware/       # auth (JWT), validate, errorHandler
│
└── client/                   # React + Vite frontend
    ├── Dockerfile
    ├── nginx.conf
    ├── .env.example
    └── src/
        ├── main.jsx          # app bootstrap, theme init
        ├── App.jsx           # routes
        ├── api/client.js     # axios instance + token interceptor
        ├── context/          # AuthContext
        ├── components/        # Navbar, TaskForm, TaskList, TaskItem, ...
        └── pages/            # Login, Signup, Dashboard
```

## Setup

You need Node.js 18+ and a MongoDB instance. The quickest way to get Mongo is
Docker; alternatively use a local install or a free MongoDB Atlas cluster.

### 1. Backend

```bash
cd server
cp .env.example .env        # adjust values if needed
npm install
npm run dev                 # starts on http://localhost:5000
```

Environment variables (`server/.env`):

| Variable         | Description                              | Default                                  |
| ---------------- | ---------------------------------------- | ---------------------------------------- |
| `PORT`           | API port                                 | `5000`                                   |
| `MONGO_URI`      | MongoDB connection string                | `mongodb://localhost:27017/taskmanager`  |
| `JWT_SECRET`     | Secret used to sign tokens               | —                                        |
| `JWT_EXPIRES_IN` | Token lifetime                           | `7d`                                     |
| `CLIENT_ORIGIN`  | Allowed CORS origin                      | `*`                                      |

### 2. Frontend

```bash
cd client
cp .env.example .env        # VITE_API_URL points at the API
npm install
npm run dev                 # starts on http://localhost:5173
```

### Run everything with Docker

From the project root:

```bash
JWT_SECRET=your-secret docker compose up --build
```

This starts MongoDB, the API (`:5000`), and the web app (`:5173`).

## API reference

Base URL: `http://localhost:5000/api`

All task endpoints require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint        | Body                          | Description                  |
| ------ | --------------- | ----------------------------- | ---------------------------- |
| POST   | `/auth/signup`  | `{ name, email, password }`   | Register and receive a token |
| POST   | `/auth/login`   | `{ email, password }`         | Log in and receive a token   |
| GET    | `/auth/me`      | —                             | Current user (auth required) |

### Tasks

| Method | Endpoint      | Description                                   |
| ------ | ------------- | --------------------------------------------- |
| GET    | `/tasks`      | List tasks (supports query params below)      |
| POST   | `/tasks`      | Create a task `{ title, description?, status? }` |
| GET    | `/tasks/:id`  | Get a single task                             |
| PUT    | `/tasks/:id`  | Update `{ title?, description?, status? }`    |
| DELETE | `/tasks/:id`  | Delete a task                                 |

Query parameters for `GET /tasks`:

- `status` — `all` (default), `pending`, or `completed`
- `search` — case-insensitive match on the title
- `page` — page number (default `1`)
- `limit` — page size (default `10`, max `100`)

Example list response:

```json
{
  "tasks": [
    {
      "_id": "6a16...",
      "user": "6a16...",
      "title": "Buy groceries",
      "description": "milk, eggs",
      "status": "pending",
      "createdAt": "2026-05-27T05:04:19.221Z",
      "updatedAt": "2026-05-27T05:04:19.221Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1, "pages": 1 }
}
```

Errors come back as `{ "message": "..." }`, and validation errors add an
`errors` array of `{ field, message }`. Status codes used: `400`, `401`, `403`,
`404`, `409`, `422`, `500`.

## Assumptions

- A task belongs to exactly one user; there is no sharing between users.
- "Completed/Pending" is modelled as a single `status` field rather than a
  boolean, leaving room for more states later.
- The `User` model carries a `role` field (`user`/`admin`) and the API ships an
  `authorize(...roles)` middleware, so role-based access can be switched on
  without a schema change. No admin-only routes are exposed by default.
- Tokens are stored in the browser's `localStorage`. That keeps the setup simple
  for this assignment; a production build would likely prefer httpOnly cookies.
- The frontend reads the API base URL from `VITE_API_URL`, so pointing it at a
  deployed backend only requires changing that one variable.
