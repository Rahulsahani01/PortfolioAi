# Portfolio AI - Database Setup Guide

This guide explains how to configure and set up the PostgreSQL database for the Portfolio AI backend using Prisma ORM.

## Prerequisites

1. **PostgreSQL**: Ensure PostgreSQL is installed and running on your machine.
2. **Database Created**: You need an empty database created in PostgreSQL. For this project, the database name is `makemywebsite`.

## 1. Environment Configuration

Your database connection is managed via the `.env` file located in the `backend/` directory.

Ensure your `backend/.env` file contains the correct `DATABASE_URL`. The format is:
```env
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>"
```

**Current Configuration:**
```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/makemywebsite"
```

## 2. Pushing the Schema (Development)

To create the tables in your database based on the blueprint in `prisma/schema.prisma`, run the following command in the `backend/` folder:

```bash
npx prisma db push
```

**What this command does:**
- Connects to the database specified in your `.env`.
- Automatically generates and executes the SQL needed to create all your tables (User, Resume, Site, Subscription, Payment).
- Generates the Prisma Client (`@prisma/client`) so your TypeScript code has full type safety.

*Note: Use `db push` for rapid prototyping. It does not keep a strict migration history.*

## 3. Creating Migrations (Production/Standard)

Once your schema is stable and you want to track database changes over time (similar to git commits for your database), use migrations instead of `db push`:

```bash
npx prisma migrate dev --name init
```

**What this command does:**
- Creates a new SQL migration file inside the `prisma/migrations/` folder.
- Applies that SQL to the database.
- Generates the Prisma Client.

## 4. Viewing your Database (Prisma Studio)

Prisma comes with a built-in GUI to view and edit the data inside your database easily. To open it, run:

```bash
npx prisma studio
```
This will open a visual database browser in your web browser (usually at `http://localhost:5555`).

## Troubleshooting

- **Error: "Authentication failed against database"**
  Double-check the username (`postgres`) and password (`123456`) in your `.env` file.
- **Error: "Database makemywebsite does not exist"**
  You need to create the empty database in PostgreSQL first before Prisma can populate it. You can do this using a tool like pgAdmin, DBeaver, or the `psql` CLI:
  ```bash
  psql -U postgres
  CREATE DATABASE makemywebsite;
  ```
