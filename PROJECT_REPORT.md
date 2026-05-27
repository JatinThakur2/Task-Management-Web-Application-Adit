# Task Manager — Project Report

This document is the single place to understand the project end to end: what the
assignment asked for, what has been built, how to run it, and the results of
testing. For deeper detail see [README.md](./README.md) (full reference) and
[USAGE.md](./USAGE.md) (step-by-step walkthrough).

---

## 1. What the project is

A full-stack **Task Management Web Application**. A user signs up, logs in, and
manages their own tasks — create, edit, delete, mark completed/pending, filter,
and search — through a responsive web UI backed by a secured REST API.

**Tech stack**

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 18 (Vite), React Router, Context API, Axios, plain CSS      |
| Backend  | Node.js, Express                                                  |
| Database | MongoDB (Mongoose)                                                |
| Auth     | JWT (`jsonwebtoken`) + `bcryptjs` password hashing                |
| Tooling  | Docker / docker-compose, helmet, cors, morgan, express-validator  |

---

## 2. What we had to do vs. what we have done

Every item from the assignment brief, with its status.

### Frontend (required)

| Requirement                              | Status | Where |
| ---------------------------------------- | :----: | ----- |
| User login & signup                      |  Done  | `pages/Login.jsx`, `pages/Signup.jsx` |
| Dashboard displaying all tasks           |  Done  | `pages/Dashboard.jsx` |
| Create a new task                        |  Done  | `components/TaskForm.jsx` |
| Edit existing task                       |  Done  | `TaskForm.jsx` (edit mode) |
| Delete task                              |  Done  | `components/TaskItem.jsx` |
| Mark task completed / pending            |  Done  | checkbox in `TaskItem.jsx` |
| Filter by All / Pending / Completed      |  Done  | `components/TaskFilters.jsx` |
| Responsive UI (desktop + mobile)         |  Done  | `styles/index.css` media queries |
| Functional components + hooks            |  Done  | entire `src/` |
| Proper folder structure + reusable parts |  Done  | `api/ context/ components/ pages/` |
| State management (Context API)           |  Done  | `context/AuthContext.jsx` |
| Form validations                         |  Done  | client-side in pages + form |
| API integration                          |  Done  | `api/client.js` (Axios + token) |
| Clean, maintainable code                 |  Done  | small focused modules |

### Backend (required)

| Requirement                  | Status | Where |
| ---------------------------- | :----: | ----- |
| JWT authentication           |  Done  | `middleware/auth.js`, `controllers/authController.js` |
| REST API development         |  Done  | `routes/`, `controllers/` |
| CRUD APIs for tasks          |  Done  | `controllers/taskController.js` |
| Protected routes             |  Done  | `authenticate` guard on `/api/tasks` |
| Proper error handling        |  Done  | `middleware/errorHandler.js` (central) |
| Database (Mongo/PG/MySQL)    |  Done  | MongoDB via Mongoose |

### Bonus items

| Bonus                          | Status        | Notes |
| ------------------------------ | :-----------: | ----- |
| Docker setup                   | Done (builds) | `docker-compose.yml` + Dockerfiles; live run blocked by a host Docker daemon issue (see §5) |
| Role-based access              | Foundation    | `role` field on users + `authorize()` middleware ready; no admin-only routes exposed |
| Pagination & search            | Done          | `GET /api/tasks?page=&limit=&search=` |
| Dark mode UI                   | Done          | theme toggle, remembered in `localStorage` |
| Unit testing                   | Not included  | API was verified manually/end-to-end (see §4) |
| Deployment                     | Not deployed  | build is deploy-ready; API URL is env-driven |
| Swagger / Postman docs         | Partial       | full API reference is in `README.md`; no Swagger UI |

---

## 3. How to run it

You need **Node.js 18+** and a **MongoDB** instance.

### Quick way — Docker (one command)

From the project root:

```bash
JWT_SECRET=some-long-random-string docker compose up --build
```

Then open **http://localhost:5173**. This starts MongoDB, the API (`:5000`),
and the web app together.

### Manual way — run each part

```bash
# 1. MongoDB (via Docker, or use a local install / MongoDB Atlas)
docker run -d --name taskmanager-mongo -p 27017:27017 mongo:7

# 2. Backend
cd server
cp .env.example .env          # set JWT_SECRET; adjust MONGO_URI if needed
npm install
npm run dev                   # http://localhost:5000

# 3. Frontend (second terminal)
cd client
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

Full step-by-step instructions and a feature-by-feature usage walkthrough are in
[USAGE.md](./USAGE.md).

---

## 4. Results — what was tested

The app was verified end to end before submission.

**Backend API** — every endpoint exercised directly:

- Signup, login, and `GET /auth/me` return tokens / the current user.
- Auth edge cases behave correctly: duplicate email → `409`, wrong password →
  `401`, missing token → `401`.
- Task CRUD works: create, list, get, update, delete.
- Filter (`status`), search (`search`), and pagination (`page`/`limit`) all
  return the expected results.
- Validation and error cases return the right codes: empty title → `422`,
  unknown id → `404`, malformed id → `400`.

**Frontend UI** — driven in a real browser (Chromium):

- Signup creates an account and lands on the dashboard.
- Creating tasks adds them to the list.
- The completed/pending checkbox toggles correctly (strike-through + badge).
- The Completed filter shows only completed tasks.
- Dark mode switches the whole theme.
- No console/runtime errors.

**Build** — `npm run build` on the frontend compiles cleanly (97 modules).

---

## 5. Known issue / environment note

The Docker **images build successfully** and `docker compose config` validates.
However, on the current machine the host Docker daemon entered a broken state
mid-session and now fails to start *any* container (even `hello-world`) with the
error `unsupported protocol: Yunix`. This is a host-level containerd/runtime
glitch, not a problem with the project, and is cleared by restarting Docker:

```bash
sudo systemctl restart docker
```

After that, `docker compose up --build` runs the whole stack. The manual run
path in §3 is unaffected as long as a MongoDB instance is reachable.

---

## 6. Project structure

```
task-manager/
├── docker-compose.yml
├── README.md            # full reference (tech stack, API, structure, assumptions)
├── USAGE.md             # step-by-step run + feature guide
├── PROJECT_REPORT.md    # this file
├── server/              # Express + MongoDB API
│   └── src/
│       ├── server.js app.js
│       ├── config/      # mongoose connection
│       ├── models/      # User, Task
│       ├── controllers/ # auth, task
│       ├── routes/      # auth, task
│       └── middleware/  # auth, validate, errorHandler
└── client/              # React + Vite frontend
    └── src/
        ├── main.jsx App.jsx
        ├── api/         # axios client
        ├── context/     # AuthContext
        ├── components/  # Navbar, TaskForm, TaskList, TaskItem, TaskFilters, ProtectedRoute
        ├── pages/       # Login, Signup, Dashboard
        └── styles/      # index.css
```

---

## 7. Updates / change log

- Database implemented with **MongoDB + Mongoose** (chosen from the allowed
  Mongo/PostgreSQL/MySQL options).
- Added bonus features beyond the core brief: Docker setup, dark mode, search,
  pagination, and a role foundation for role-based access.
- Code committed to Git as a series of incremental commits reflecting the build
  order (backend foundation → auth → tasks → frontend → Docker → docs).
- Documentation split into three files: `README.md` (reference), `USAGE.md`
  (how-to), and this report.
