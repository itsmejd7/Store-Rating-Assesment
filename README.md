# Store Rating App

A full-stack web application where users can browse stores and submit ratings. Store owners can view ratings for their stores, while administrators can manage users and stores.

## Technologies Used

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT and HTTP-only cookies
- **Password Hashing:** bcrypt

## Project Structure

```text
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── controllers/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── vite.config.js
│   └── package.json
└── database/
    ├── schema.sql
    └── seed.sql
```

## Prerequisites

Install the following before running the application:

- Node.js 18 or later
- npm
- MySQL 8.0 or later

## Setup Instructions

### 1. Set up the database

Start your MySQL server and execute the SQL files in the following order:

1. `database/schema.sql`
2. `database/seed.sql`

You can run them using MySQL Workbench or the MySQL command-line client.

The schema creates the `store_rating_db` database and the required tables for users, stores, and ratings. The seed file inserts a default administrator account.

### 2. Configure the backend

Open a terminal in the project directory and run:

```bash
cd backend
```

Create a `.env` file using `.env.example` as a reference.

Configure the following environment variables:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Replace the example database credentials and JWT secret with your local values. Do not commit `.env` to GitHub.

Install the dependencies and start the server:

```bash
npm install
npm run dev
```

The backend runs at `http://localhost:5000`.

If your project provides an `init-db` script, you can use `npm run init-db` to initialize the database instead of manually executing the SQL files. Do not run both methods unnecessarily.

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

The frontend communicates with the Express backend. In development, the Vite proxy is configured to forward `/api` requests to the backend.

## Default Administrator Account

After successfully importing the seed data, use the following credentials:

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `Admin@123` |

Change the default password after your first login.

## User Roles

### System Administrator

- View dashboard statistics for users, stores, and ratings.
- Create users, administrators, store owners, and stores.
- View user and store details.
- Search, filter, and sort listings.

### Normal User

- Register and log in.
- Browse and search stores by name and address.
- View overall store ratings.
- Submit a rating from 1 to 5.
- Update a previously submitted rating.
- Change their password and log out.

### Store Owner

- View the average rating of their store.
- View users who submitted ratings.
- Change their password and log out.

## Main API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a normal user |
| POST | `/login` | Log in |
| POST | `/logout` | Log out |
| PATCH | `/change-password` | Change password |

### Administrator — `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | View dashboard statistics |
| GET | `/users` | List and filter users |
| POST | `/users` | Create a user |
| GET | `/users/:id` | View user details |
| GET | `/stores` | List stores |
| POST | `/stores` | Create a store |
| GET | `/stores/:id` | View store details and ratings |

### Stores — `/api/stores`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List and search stores |
| GET | `/:id` | View store details |

### Ratings — `/api/ratings`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Submit a rating |
| PUT | `/:id` | Update an existing rating |

### Store Owner — `/api/owner`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | View store rating statistics and raters |

Protected endpoints require authentication and the appropriate user role.

## Validation Rules

Implement the validation rules specified in the assignment:

| Field | Requirement |
|---|---|
| Name | 20–60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters, with at least one uppercase letter and one special character |
| Email | Valid email format |
| Rating | Integer from 1 to 5 |

Validate inputs on both the frontend and backend.

## Authentication and Security

- Passwords are hashed before being stored.
- JWT authentication uses HTTP-only cookies.
- Role-based access is enforced on protected backend routes.
- Database credentials and JWT secrets are stored in environment variables.
- Users should only be able to modify their own ratings.
- Store owners should only be able to access data belonging to their stores.

## Development Commands

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

## Notes

- Email verification is not currently included.
- Pagination and additional user/store editing features may be added in future versions.
- Automated tests are not included in this version.
- Verify the actual implementation and configuration before deployment.

