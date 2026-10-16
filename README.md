# Store Rating App

A full-stack web application where **normal users** browse and rate stores, **store owners** monitor their ratings, and **administrators** manage all users, stores, and ratings.

**Stack:** React 18 + Vite · Express.js · MySQL · JWT (httpOnly cookies) · bcrypt

---

## Project Structure

```
store-rating-app/
├── backend/              Express.js API
│   ├── src/
│   │   ├── app.js        Entry point
│   │   ├── config/db.js  MySQL pool
│   │   ├── middleware/   JWT auth + role guard
│   │   ├── routes/       auth, admin, stores, ratings, owner
│   │   └── controllers/  One file per route group
│   ├── .env.example
│   └── package.json
├── frontend/             React + Vite SPA
│   ├── src/
│   │   ├── api/          Axios instance + per-resource helpers
│   │   ├── components/   Navbar, ProtectedRoute, FormInput, StarRating
│   │   ├── context/      AuthContext (user identity)
│   │   └── pages/        auth/, admin/, user/, owner/, shared/
│   ├── vite.config.js
│   └── package.json
└── database/
    ├── schema.sql        Table definitions
    └── seed.sql          Default admin account
```

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 18 LTS |
| npm | 9 |
| MySQL | 8.0 |

---

## 1 — Database Setup

Open MySQL and run the two SQL files in order:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Or paste them into MySQL Workbench / any client.

This creates the `store_rating_db` database with three tables (`users`, `stores`, `ratings`) and inserts the default admin account.

---

## 2 — Backend Setup

```bash
cd backend
copy .env.example .env
```

Edit `.env` and set your values:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=a_long_random_string_at_least_32_chars
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> [!IMPORTANT]
> `JWT_SECRET` must be a long, random string. Never commit the real `.env` to source control.

Install dependencies and start:

```bash
npm install
npm run dev       # development (auto-restarts on file change)
# or
npm start         # production
```

The API listens on **http://localhost:5000**.

---

## 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**. The Vite dev server proxies all `/api/*` requests to the backend so no CORS configuration is needed during development.

---

## 4 — Default Admin Account

After running `seed.sql`:

| Field    | Value              |
|----------|--------------------|
| Email    | admin@example.com  |
| Password | Admin@123          |
| Role     | Admin              |

> [!CAUTION]
> Change this password immediately after your first login using the **Password** menu item.

---

## 5 — Typical Setup Workflow

1. Create a **Store Owner** user: Admin → Users → Add User → role: Store Owner
2. Create a **Store**: Admin → Stores → Add Store → pick the owner from the dropdown
3. Register a **normal user** via the public `/register` page
4. Log in as the normal user → browse stores → submit a rating
5. Log in as the store owner → view the Dashboard to see ratings

---

## 6 — User Roles and Permissions

| Feature | Admin | User | Store Owner |
|---------|:-----:|:----:|:-----------:|
| Register (public) | — | ✓ | — |
| Login / Logout | ✓ | ✓ | ✓ |
| Change own password | ✓ | ✓ | ✓ |
| View admin dashboard | ✓ | — | — |
| Create users / admins / store owners | ✓ | — | — |
| Create stores | ✓ | — | — |
| List & filter all users | ✓ | — | — |
| List & filter all stores | ✓ | — | — |
| View store details + ratings (admin) | ✓ | — | — |
| Browse stores with search | — | ✓ | — |
| Submit rating (1–5) | — | ✓ | — |
| Update own rating | — | ✓ | — |
| View own store dashboard | — | — | ✓ |
| View list of raters | — | — | ✓ |

Roles are enforced **server-side** on every request via JWT middleware and a role guard. Frontend UI hides irrelevant links but backend always re-checks.

---

## 7 — API Reference

### Authentication (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Create user account |
| POST | `/login` | Public | Get JWT cookie |
| POST | `/logout` | Any | Clear JWT cookie |
| PATCH | `/change-password` | Any | Update password |

### Admin (`/api/admin`) — role: admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Counts of users, stores, ratings |
| GET | `/users` | List users (`?name&email&role&sort&order`) |
| POST | `/users` | Create any-role user |
| GET | `/users/:id` | User details |
| GET | `/stores` | List stores with avg rating |
| POST | `/stores` | Create store |
| GET | `/stores/:id` | Store details + all ratings |

### Stores (`/api/stores`) — role: user
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List stores with avg rating + caller's rating (`?name&address`) |
| GET | `/:id` | Store detail + caller's rating |

### Ratings (`/api/ratings`) — role: user
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Submit rating `{ store_id, value }` |
| PUT | `/:id` | Update own rating `{ value }` |

### Owner (`/api/owner`) — role: store_owner
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Store info, avg rating, rater list |

---

## 8 — Validation Rules

| Field | Rule |
|-------|------|
| Name | 2–60 characters |
| Email | Valid format, unique per table |
| Password | 8–72 chars, ≥1 uppercase, ≥1 special character (`!@#$%^&*`) |
| Address | Optional, max 400 chars |
| Rating value | Integer 1–5 |

---

## 9 — Authentication Design

- JWT is signed with `JWT_SECRET` and expires in **24 hours**.
- Stored in an `httpOnly; SameSite=Strict` cookie — not accessible to JavaScript, preventing XSS theft.
- Non-sensitive user info (`id`, `name`, `email`, `role`) is stored in `localStorage` purely to drive the React UI; the cookie is what the backend actually validates.
- Logout clears the cookie server-side and removes localStorage data.

---

## 10 — Known Limitations

- No email verification on registration.
- No admin interface to delete or edit existing users/stores.
- No pagination on listing endpoints (all records are returned).
- No automated tests included in this version.
- JWT tokens cannot be revoked before they expire (no token blacklist/refresh mechanism).

---

## 11 — Development Scripts

```bash
# Backend
cd backend
npm run dev      # node --watch (Node 18+)

# Frontend
cd frontend
npm run dev      # Vite HMR dev server
npm run build    # Production build → frontend/dist/
npm run preview  # Preview production build locally
```
