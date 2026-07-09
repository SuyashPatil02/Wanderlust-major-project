# Database Documentation

## User
Fields:
- `username` (from passport-local-mongoose)
- `email` (required, unique, lowercase)
- `role` (`user` | `admin`)
- `favorites[]` -> ObjectId refs to `Listing`

## Listing
Fields:
- `title`, `description`, `location`, `country`, `price`
- `image.url`, `image.filename`
- `owner` -> ObjectId ref `User`
- `reviews[]` -> ObjectId refs `Review`
- `isFeatured` -> boolean
- `createdAt`, `updatedAt`

Indexes:
- `{ country: 1, location: 1 }`
- `{ price: 1 }`
- text index on title/description/location/country

## Review
Fields:
- `comment`
- `rating` (1..5)
- `author` -> ObjectId ref `User`
- `createdAt`, `updatedAt`

## Relationship Rules
- One listing has many reviews.
- One user owns many listings.
- One user can favorite many listings.
- Deleting listing cascades to delete associated reviews.
