# GetBuged Backend

This is the Express/MongoDB backend for the GetBuged application. It provides authentication (Google OAuth) and stores test history for users.

## Folder structure
```
backend/
  controllers/      # request handlers for business logic
  routes/           # Express route definitions
  middlewares/      # custom middleware (e.g. auth)
  db/               # database connection utilities
  models/           # Mongoose schemas
  utils/            # helper functions (e.g. JWT)
  server.js         # entry point
  package.json
  .env.example
```

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   # then populate .env with your Mongo URI, JWT secret, Google credentials, etc.
   ```

3. **Run the server**
   ```bash
   npm run dev    # requires nodemon
   npm start      # production
   ```

4. **Endpoints**
   - `POST /api/auth/signup` — create a local account (`email`, `password`, optional `name`)
   - `POST /api/auth/login` — authenticate local account, returns `{user, accessToken}`
   - `GET /api/auth/google` — start Google OAuth flow
   - `GET /api/auth/google/callback` — Google callback, redirects to frontend with token + user info
   - `POST /api/auth/logout` — invalidates session (JWT clients can simply discard token)
   - `POST /api/playground/submit` — submit a test result (`{level,score}`) (protected)
   - `GET /api/playground/me` — get current user profile + history (protected)

5. **Behavior**
   - Protected routes require an `Authorization: Bearer <token>` header.
   - When tests are submitted, they are appended to the user’s `history` array in MongoDB.
   - Frontend can fetch `/api/playground/me` to display a user’s history or profile.


## Notes

- Protected routes require an `Authorization: Bearer <token>` header.
- The frontend should redirect unauthenticated users to the login/Google flow.
- When a test is submitted, it is appended to the user’s `history` array in MongoDB.

