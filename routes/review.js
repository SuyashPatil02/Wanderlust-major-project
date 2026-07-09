const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");


// Review Routes (handles creation and deletion of reviews for a specific listing)
// Post Route to add a new review to a specific listing  //(wrapAsync is used to handle async errors)
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Route to remove a review from a specific listing
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;