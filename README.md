# CampusFlow

CampusFlow is a full-stack college opportunities platform for discovering campus events, workshops, competitions, and other opportunities. Students can discover and register for published events, organizers can create and publish events, and administrators have a protected metrics dashboard.

This repository contains a React frontend and a Node.js/Express REST API backed by MongoDB Atlas.

## Current Status

### Implemented

- Public landing page and event discovery
- Event search, category filtering, mode filtering, pagination, and published-only public visibility
- Event detail view
- Student and organizer registration
- JWT login and current-user authentication
- bcryptjs password hashing
- Server-side role-based authorization
- Organizer event creation and publishing
- Student registration/cancellation business rules
- Student bookmarks and notifications API
- Student, organizer, and admin dashboards
- MongoDB/Mongoose models and indexes
- Helmet, CORS, rate limiting, centralized error handling
- Responsive Bauhaus-inspired frontend UI
- Route-level React lazy loading
- Non-destructive category seed script

### Planned / Not Yet Implemented

- User management CRUD screens and endpoints
- Category create/update/delete endpoints
- Announcement routes, controllers, and UI workflows
- Dedicated student registrations, bookmarks, and notifications screens
- Automated backend test cases
- Swagger/OpenAPI generation
- HttpOnly cookie authentication and token revocation
- Production audit logging

## Technology Stack

### Frontend

- React
- Vite
- JavaScript and JSX
- React Router
- Axios
- Lucide React
- CSS design layers with responsive media queries

Tailwind packages were removed because the current frontend uses the project CSS layers directly.

### Backend

- Node.js ES modules
- Express.js
- REST APIs
- Mongoose
- MongoDB Atlas
- JSON Web Tokens
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- Morgan request logging
- dotenv

## Architecture

```text
React + Vite client
        |
        | Axios / HTTP
        v
Node.js + Express API
        |
        | Helmet, CORS, JSON parsing, rate limiting
        v
Routes -> JWT/RBAC middleware -> Controllers
                                      |
                                      v
                                  Mongoose
                                      |
                                      v
                                MongoDB Atlas
```

The backend uses a route-controller-model structure. There is currently no separate services layer. The frontend uses reusable components, page modules, AuthContext, ProtectedRoute, and a centralized Axios client.

## Repository Structure

```text
CampusFlow/
├── client/
│   ├── src/
│   │   ├── components/       Shared navbar, cards, logo, layout, route guard
│   │   ├── context/          AuthContext authentication state
│   │   ├── pages/            Home, discovery, details, auth, dashboards, forms
│   │   ├── services/         Axios API client
│   │   ├── App.jsx           Lazy-loaded route tree
│   │   ├── main.jsx          React entry point
│   │   ├── styles.css        Base styles and responsive layout
│   │   ├── enhancements.css  Typography layer
│   │   └── bauhaus.css       Visual design system overrides
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/           Environment and MongoDB connection
│   │   ├── controllers/      Auth, event, dashboard, notification logic
│   │   ├── middleware/       JWT/RBAC and centralized errors
│   │   ├── models/           User, Event, Category, Registration, Bookmark, Notification, Announcement
│   │   ├── routes/           Auth, event, dashboard, notification routes
│   │   ├── seed/             Safe category upsert seed
│   │   ├── utils/            Response helpers
│   │   ├── app.js            Express configuration
│   │   └── server.js         Startup and database connection
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── docs/
│   ├── api.md
│   ├── Week-1-Project-Planning-and-System-Architecture.docx
│   ├── Week-2-Front-End-Application-Development.docx
│   └── Week-3-Back-End-API-Development.docx
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## Requirements

- Node.js 20 or newer
- A MongoDB Atlas account and cluster
- PowerShell, macOS/Linux shell, or an equivalent terminal

Local MongoDB is not required.

## Installation

From the repository root:

```powershell
npm run install:all
```

If the root dependencies are already installed, the equivalent explicit commands are:

```powershell
npm install
npm install --prefix client
npm install --prefix server
```

## MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. In **Database Access**, create a database user.
3. In **Network Access**, add your current IP address. Avoid `0.0.0.0/0` outside temporary development.
4. Choose **Connect → Drivers → Node.js** and copy the connection string.
5. Create the server environment file:

```powershell
Copy-Item server\.env.example server\.env
code server\.env
```

Set the Atlas URI and a strong random JWT secret:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=generate-a-long-random-secret-at-least-32-characters
CLIENT_URL=http://localhost:5173

```

Do not commit `server/.env`. It is ignored by Git. If the database password contains `@`, `#`, `/`, `:`, or other reserved URL characters, URL-encode it.

For PowerShell, a random secret can be generated without printing it into the repository:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 } | ForEach-Object { [byte]$_ }))
```

Production startup rejects the default placeholder and requires a JWT secret of at least 32 characters. Development allows a shorter non-default secret with a warning so an existing local setup can still start; use 32+ characters before deployment.

## Seed Data

The seed command is intentionally non-destructive:

```powershell
npm run seed
```

It only upserts the standard event categories. It does not create public mock accounts, does not publish hardcoded demo credentials, and does not delete users, events, or categories.

Create student and organizer accounts through the registration page. Administrator registration is not public and must be provisioned through a controlled operational process.

## Running the Application

Start both frontend and backend from the root:

```powershell
npm run dev
```

Or run them separately:

```powershell
npm run dev --prefix server
npm run dev --prefix client
```

URLs:

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Health check: http://localhost:4000/api/health

## Build and Test Commands

```powershell
npm run build
npm test
npm run build --prefix client
npm test --prefix server
```

The current backend test command uses Node's test runner but no test files are present yet, so it exits successfully with zero discovered tests. Automated API tests are planned.

## Frontend Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | CampusFlow landing page |
| `/events` | Public | Search and filter published events |
| `/events/:id` | Public | Event details and student registration action |
| `/login` | Public | Login |
| `/register` | Public | Student/organizer registration |
| `/dashboard` | Student | Student metrics, registrations, recommendations, notifications |
| `/organizer` | Organizer | Organizer metrics and event publication |
| `/organizer/events/new` | Organizer | Create and publish an event |
| `/admin` | Admin | Platform metrics |

## REST API Overview

Base URL: `http://localhost:4000/api`.
Protected requests use `Authorization: Bearer <jwt>`.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health check |
| POST | `/auth/register` | Public | Register student or organizer |
| POST | `/auth/login` | Public | Issue JWT |
| GET | `/auth/me` | Authenticated | Current user |
| GET | `/events` | Public | Published event discovery with filters/pagination |
| GET | `/events/categories` | Public | Read categories |
| GET | `/events/:id` | Public | Published event details |
| POST | `/events` | Organizer/Admin | Create event |
| PUT | `/events/:id` | Organizer owner | Update editable event fields |
| DELETE | `/events/:id` | Organizer owner | Delete event |
| PATCH | `/events/:id/status` | Organizer owner/Admin | Change event status |
| POST | `/events/:id/register` | Student | Register atomically with capacity/deadline checks |
| DELETE | `/events/:id/register` | Student | Cancel own registration |
| POST | `/events/:id/bookmark` | Student | Bookmark event |
| DELETE | `/events/:id/bookmark` | Student | Remove bookmark |
| GET | `/events/registrations/my` | Student | Paginated active registrations |
| GET | `/events/bookmarks/my` | Student | Paginated bookmarks |
| GET | `/dashboard/student` | Student | Student dashboard data |
| GET | `/dashboard/organizer` | Organizer | Organizer metrics and recent events |
| GET | `/dashboard/admin` | Admin | Platform metrics |
| GET | `/notifications` | Authenticated | List user notifications |
| PATCH | `/notifications/:id/read` | Authenticated | Mark one notification read |
| PATCH | `/notifications/read-all` | Authenticated | Mark all notifications read |

Full endpoint details are in [docs/api.md](docs/api.md).

## Database Models

- **User:** identity, role, college/course/year or organization, active status, timestamps.
- **Event:** title, description, category, organizer, schedule, mode, capacity, registration deadline, tags, eligibility, status, timestamps.
- **Category:** unique name and slug.
- **Registration:** user/event relationship with registered/cancelled status and a unique compound index.
- **Bookmark:** user/event relationship with a unique compound index.
- **Notification:** user, title, message, type, read state, timestamps.
- **Announcement:** event, author, title, message. Model exists, but announcement API routes are planned.

## Security Practices

Implemented security controls:

- bcryptjs password hashing with password excluded from normal queries
- JWT signature verification and active-account checks
- Server-side role-based authorization
- Organizer ownership checks on event mutations
- Allowlisted event mutation fields to prevent mass assignment
- Published-only public event visibility
- Organizer email excluded from public event responses
- Atomic registration capacity reservation through MongoDB transaction logic
- Unique registration and bookmark indexes
- Helmet security headers
- Restricted CORS using `CLIENT_URL`
- Dedicated login/registration rate limiting plus global rate limiting
- JSON request body size limit
- Mongoose schema validation and enum constraints
- Centralized safe error responses
- Environment-only secrets and ignored `.env` files
- Non-destructive seed process with no hardcoded accounts

Before deployment:

- Use a 32+ character random `JWT_SECRET`.
- Use HTTPS at the reverse proxy or hosting platform.
- Restrict Atlas Network Access to known application IPs where possible.
- Pin dependency versions and review lockfile updates.
- Consider HttpOnly SameSite cookies instead of localStorage JWT storage.
- Add audit logging, account recovery, token revocation, and automated security tests.

## Performance Practices

Implemented improvements:

- Event listing limit capped at 50
- Event projections and `.lean()` for read-heavy queries
- Event filter and date indexes
- Registration, bookmark, notification, and user-role indexes
- Organizer dashboard limited to recent events and uses MongoDB aggregation for totals
- Bounded personal registration/bookmark queries
- Atomic bookmark upsert
- Cancellable event discovery requests
- React route-level lazy loading and production code splitting
- Removed unused Tailwind Vite plugin and packages

Remaining performance considerations:

- Exact event totals still use `countDocuments()` per listing request.
- Offset pagination can become less efficient at very deep pages; cursor pagination is a future option.
- Query plans should be checked with representative production data using MongoDB `explain()`.
- Frontend request caching/invalidation can be added as the number of views grows.

## Git and Push Workflow

The repository is now initialized with Git. Review files before committing:

```powershell
git status
git diff -- README.md
```

Add and commit the project:

```powershell
git add .
git commit -m "Build CampusFlow full-stack platform"
```

Add your GitHub remote, replacing the placeholder URL:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

Never commit `.env`, Atlas credentials, JWT secrets, generated logs, `node_modules`, or build output.

## Documentation

- [API documentation](docs/api.md)
- [Week 1 report](docs/Week-1-Project-Planning-and-System-Architecture.docx)
- [Week 2 report](docs/Week-2-Front-End-Application-Development.docx)
- [Week 3 report](docs/Week-3-Back-End-API-Development.docx)

## Known Limitations

This is the current repository state, not a claim that every platform requirement is complete. User administration, category CRUD, announcements, dedicated saved/notification pages, automated tests, Swagger/OpenAPI, audit logs, and production token/session hardening remain future work.
