# Cortex — MERN AI platform with scroll-velocity 3D hero

> Full-stack AI-platform marketing site with a scroll-velocity-driven 3D planes hero on cyan / violet midnight.

**[Live demo →](https://cortex-qf7u.onrender.com/)**

![preview](/client/docs/preview.gif)

## What it does

A landing + dashboard demo for a fictional AI platform. Marketing site features a 3D-planes hero whose distortion responds to scroll velocity. Authenticated users land in a dashboard that talks to the Express API.

## Stack

- **Client:** React 18, Vite, Tailwind CSS v3, React Three Fiber, Axios
- **Server:** Node, Express, MongoDB (Mongoose), JWT, bcrypt

## Highlights

- Scroll-velocity-tied 3D plane displacement (R3F + custom shader material)
- Cyan / violet on midnight palette with subtle scanline-lit accents
- Full auth flow with JWT-protected dashboard routes
- Clean separation of `/client` and `/server`

## Run locally

```bash
# 1. Backend
cd server
npm install
npm run dev          # http://localhost:5001

# 2. Frontend (new terminal)
cd client
npm install
npm run dev          # http://localhost:5194
```

Set `MONGO_URI` and `JWT_SECRET` in `server/.env` first.
