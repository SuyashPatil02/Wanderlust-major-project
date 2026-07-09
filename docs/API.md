# API and Route Documentation

## Listing Routes
- `GET /listings` -> list listings (supports `q`, `country`, `minPrice`, `maxPrice`, `sort` query params)
- `GET /listings/new` -> render create listing form (auth required)
- `POST /listings` -> create listing (auth required)
- `GET /listings/:id` -> show listing details
- `GET /listings/:id/edit` -> render edit form (owner required)
- `PUT /listings/:id` -> update listing (owner required)
- `DELETE /listings/:id` -> delete listing (owner required)
- `POST /listings/:id/favorite` -> add listing to wishlist (auth required)
- `DELETE /listings/:id/favorite` -> remove listing from wishlist (auth required)

## Review Routes
- `POST /listings/:id/reviews` -> create review (auth required)
- `DELETE /listings/:id/reviews/:reviewId` -> delete review (review author required)

## Auth Routes
- `GET /signup`, `POST /signup`
- `GET /login`, `POST /login`
- `GET /logout`

## Utility Route
- `GET /health` -> health status
