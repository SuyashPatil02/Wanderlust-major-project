# Architecture Overview

## Stack
- Node.js + Express (server)
- MongoDB + Mongoose (database)
- Passport Local + Session auth
- EJS + Bootstrap (UI)
- Cloudinary + Multer (image upload)

## Folders
- `controllers/`: Route handlers and business logic
- `routes/`: HTTP endpoint definitions and middleware chaining
- `models/`: Mongoose schemas, indexes, relationships
- `views/`: EJS templates (layouts, includes, pages)
- `public/`: Static CSS/JS assets
- `middleware.js`: AuthZ/AuthN and Joi validation middleware
- `config/`: Environment and runtime configuration
- `utils/`: Reusable utility wrappers and custom errors

## Request Flow
Browser -> Route -> Middleware -> Controller -> Model/DB -> EJS View/JSON -> Browser

## Security Layers
- Helmet CSP and secure headers
- Rate limiting
- Mongo key sanitization
- Secure session cookies
- Input validation (Joi)

## Data Model Summary
- `User`: account + favorites + role
- `Listing`: owner, details, image, featured flag, indexed fields
- `Review`: author, rating, comment

## Scalability Notes
- Added indexes for common filters/search fields.
- Modularized routes/controllers for maintainability.
- Cloudinary offloads media storage from app server.
