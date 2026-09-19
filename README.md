# Amruth — Digital Interactive Resume

Full-stack gamified resume built with:
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js + Express
- Persistence: JSON file (`data/data.json`)
- API: Projects, visitor counter, XP/progress and contact messages

## Run locally

```bash
npm install
npm run dev
```

Open:

http://localhost:3000

## Backend APIs

- `GET /api/projects`
- `GET /api/stats`
- `POST /api/progress`
- `POST /api/contact`
- `GET /api/admin/messages`

## Important before deployment

1. Replace the placeholder project data in `data/data.json`.
2. Replace the placeholder contact/project links in `public/index.html` / data.
3. Protect `/api/admin/messages` with authentication before exposing it publicly.
4. For production, move messages/progress from JSON into PostgreSQL/MongoDB.
5. Add environment variables for secrets and configure CORS/auth if frontend and backend are separated.

## Architecture

Browser
  ↓
Express server
  ├── serves `/public`
  └── REST API
       └── `data/data.json`

The architecture is intentionally simple so it is easy to extend into MongoDB + authentication + admin dashboard later.
