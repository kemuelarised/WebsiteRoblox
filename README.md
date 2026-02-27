# Roblox Build Gigs Website

A full-stack website for selling/advertising your Roblox build gigs/projects.

- **Frontend**: React + Vite + Tailwind
- **Backend**: Node.js + Express
- **Database**: MySQL (via Docker Compose)

## Quick start (local dev)

## Prerequisites

- **Node.js** (includes `npm`): install the current LTS from [Node.js downloads](https://nodejs.org/en/download)
- **Docker Desktop** (for MySQL): install from [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1) Start MySQL

From the project root:

```powershell
docker compose up -d
```

Adminer (DB UI): `http://localhost:8081`

### 2) Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

API runs at `http://localhost:5050`

### 3) Frontend

```powershell
cd ..\frontend
copy .env.example .env
npm install
npm run dev
```

Website runs at `http://localhost:5173`

## Admin (create/edit gigs)

This project uses a simple admin token (for now).

- Set `ADMIN_TOKEN` in `backend/.env`
- In the UI, open the Admin page and paste the token

You can later replace this with real login/accounts.

## Deployment notes

- Point the frontend to your hosted API URL via `VITE_API_BASE_URL`
- Use a managed MySQL database (or host MySQL yourself)
- Run `npm run migrate` on deploy to ensure tables exist

