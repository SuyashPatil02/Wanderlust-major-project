# Deployment Guide

## Platforms
- **Render / Railway**: Best for full Express app hosting.
- **Vercel / Netlify**: Best for frontend/serverless; this project is a monolithic Express app, so Render/Railway is recommended.

## Required Environment Variables
Use values from `.env.example`:
- `NODE_ENV=production`
- `PORT`
- `ATLASDB_URI`
- `SECRET`
- `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`, `CLOUDINARY_FOLDER`
- `MAP_TOKEN`

## MongoDB Atlas Setup
1. Create Atlas cluster.
2. Add DB user and password.
3. Allow network access from your hosting provider.
4. Copy connection string to `ATLASDB_URI`.

## Render Deployment
1. Create a new **Web Service** from this repo.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add all env vars from `.env.example`.
5. Deploy and verify `/health` endpoint.

## Railway Deployment
1. Create new project from GitHub repo.
2. Set start command as `npm start`.
3. Configure all env vars.
4. Deploy and validate create/listing upload/login flows.

## Post-Deploy Checklist
- Verify session login/logout.
- Verify Cloudinary image upload.
- Verify listing CRUD and reviews.
- Verify `/health` returns 200.
- Verify rate limiting and security headers in response.
