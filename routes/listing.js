const express = require("express");
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js") // Import the storage configuration from cloudConfig.js
const upload = multer({ storage });



const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

//New route for listing form (renders a form to create a new listing)
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// (index route) Endpoint to retrieve all listings and render them using EJS template (index route for listings)


//Show Route (shows details of a specific listing based on its ID)


//Create Route (handles form submission for creating a new listing)


//Edit Route (renders form to edit an existing listing)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route (handles form submission for updating an existing listing)


//Delete Route (handles deletion of a listing)


module.exports = router;    