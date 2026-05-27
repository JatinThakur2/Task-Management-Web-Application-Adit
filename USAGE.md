# Usage Guide

A step-by-step walkthrough for running the Task Manager and using each feature.
There are two ways to run it — pick whichever suits you.

---

## Option A — Run with Docker (one command)

Best if you have Docker installed and don't want to set up MongoDB yourself.

1. Make sure Docker is running.
2. From the `task-manager` folder, start everything:

   ```bash
   JWT_SECRET=some-long-random-string docker compose up --build
   ```

3. Wait until the logs show the API listening and Mongo ready.
4. Open the app at **http://localhost:5173**.
5. To stop it, press `Ctrl+C`, then optionally `docker compose down`.

That's it — MongoDB, the API, and the web app all run together.

---

## Option B — Run each part manually

Best for development. You need **Node.js 18+** and a **MongoDB** instance.

### 1. Start MongoDB

If you have Docker, the easiest option is:

```bash
docker run -d --name taskmanager-mongo -p 27017:27017 mongo:7
```

Otherwise use a local MongoDB install, or a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster and copy its connection
string for the next step.

### 2. Start the backend

```bash
cd server
cp .env.example .env
# If you're using Atlas or a custom Mongo, set MONGO_URI in .env.
# Also set JWT_SECRET to any long random string.
npm install
npm run dev
```

The API runs on **http://localhost:5000**. Check it with:

```bash
curl http://localhost:5000/api/health
```

### 3. Start the frontend

In a second terminal:

```bash
cd client
cp .env.example .env        # VITE_API_URL already points at the local API
npm install
npm run dev
```

Open **http://localhost:5173**.

---

## Using the app

### 1. Create an account
- On first visit you land on the login screen. Click **Sign up**.
- Enter your name, email, and a password (at least 6 characters).
- On success you're logged in and taken straight to your dashboard.

### 2. Add a task
- In the **Add a task** box, type a title (required) and an optional description.
- Click **Add task**. It appears at the top of the list.

### 3. Mark complete / pending
- Click the checkbox on the left of a task to toggle it.
- Completed tasks are struck through and show a green **Completed** badge.

### 4. Edit a task
- Click **Edit** on a task. Its details load into the form at the top.
- Change the title/description and click **Update task** (or **Cancel**).

### 5. Delete a task
- Click **Delete** and confirm the prompt.

### 6. Filter and search
- Use the **All / Pending / Completed** tabs to filter by status.
- Type in the **Search tasks…** box to filter by title as you type.
- If there are many tasks, use **Previous / Next** at the bottom to page through.

### 7. Dark mode
- Click the **Dark / Light** button in the top bar to switch themes.
- Your choice is remembered the next time you open the app.

### 8. Log out
- Click **Logout** in the top bar. You'll be returned to the login screen.

---

## Trying the API directly (optional)

```bash
# Sign up and grab the token
curl -X POST http://localhost:5000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123"}'

# Use the token from the response
TOKEN=<paste-token-here>

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"My first task"}'

# List tasks
curl http://localhost:5000/api/tasks -H "Authorization: Bearer $TOKEN"
```

---

## Troubleshooting

- **Frontend can't reach the API** — confirm the backend is on port 5000 and that
  `client/.env` has `VITE_API_URL=http://localhost:5000/api`. Restart `npm run dev`
  after changing env files.
- **Backend won't start / Mongo errors** — confirm MongoDB is running and
  `MONGO_URI` in `server/.env` is correct.
- **401 errors after a while** — the token expired (default 7 days). Just log in again.
- **Port already in use** — change `PORT` (backend) or the Vite port, or stop the
  process using it.
