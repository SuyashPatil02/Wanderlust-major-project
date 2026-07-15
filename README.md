# Wanderlust Major Project 
A modernized MERN-style travel listing platform inspired by Airbnb, upgraded with production security, improved architecture, advanced filtering, featured listings, and wishlist capabilities.

## Highlights
- Listing CRUD with image upload (Cloudinary)
- Authentication and authorization (Passport + sessions)
- Reviews with ownership checks
- Advanced listing filters (search, country, min/max price, sorting)
- Featured listings section
- Wishlist/favorites system
- Production hardening: Helmet, rate limiting, compression, Mongo sanitization
- Centralized environment config and `/health` endpoint

## Tech Stack
- Node.js, Express, MongoDB, Mongoose
- EJS + Bootstrap 5
- Passport Local, express-session, connect-mongo
- Multer + Cloudinary

## Project Structure
```bash
controllers/
models/
routes/
views/
public/
config/
utils/
init/
docs/
app.js
middleware.js
schema.js
```

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment file:
   ```bash
   cp .env.example .env
   ```
3. Seed sample data (optional):
   ```bash
   npm run init:db
   ```
4. Run app:
   ```bash
   npm start
   ```

## Environment Variables
See `.env.example` for all required values.

## Security Measures Added
- Secure HTTP headers via Helmet + CSP
- Rate limiter for abusive traffic control
- Mongo query operator sanitization
- Secure cookie options and persistent session storage
- Joi validation for request payloads

## Documentation
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/DATABASE.md`
- `docs/DEPLOYMENT.md`

## Interview Prep Notes
- Demonstrates MVC separation, middleware chaining, auth/session lifecycle, and schema/index optimization.
- Includes practical production concerns: env validation, security middleware, and deployment checklist.

## Roadmap
- Email verification + password reset
- OAuth login (Google/GitHub)
- Admin analytics dashboard
- Real geocoding and nearby recommendations
- Automated tests (unit/integration/e2e)
