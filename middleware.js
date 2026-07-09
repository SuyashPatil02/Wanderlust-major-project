const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        //redirectUrlS
        req.session.redirectUrl = req.originalUrl; // Store the original URL the user was trying to access
        req.flash("error", "You must be logged in to create a new listing!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available in templates
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



// Middleware to validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errorMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};


// Middleware to validate review data using Joi schema
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
