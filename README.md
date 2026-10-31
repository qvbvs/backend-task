# Todo list

Express API in `server/`, Next.js frontend in `client/`. Todos are saved to `server/data/todos.json`.

## Running

Start the API (port 4000):

```
cd server
npm install
npm run dev
```

Start the frontend (port 3000) in a second terminal:

```
cd client
npm install
npm run dev
```

Then open http://localhost:3000.

## API

| Method | Path             | Body                | Response  |
|--------|------------------|---------------------|-----------|
| GET    | /api/todos       |                     | 200, list |
| POST   | /api/todos       | `{ title }`         | 201, todo |
| PATCH  | /api/todos/:id   | `{ title?, done? }` | 200, todo |
| DELETE | /api/todos/:id   |                     | 204       |

Invalid input returns 400 and an unknown id returns 404, both with `{ error }`.
