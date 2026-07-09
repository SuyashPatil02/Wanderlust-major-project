const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    //Check if the listing exists, if not, redirect to the listings page with an error message
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {

    let url = req.file.path; // Get the URL of the uploaded image from req.file.path
    let filename = req.file.filename; // Get the filename of the uploaded image from req.file.filename
    req.body.listing.image = { url, filename }; // Assign the image object to req.body.listing.image


    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user 

    newListing.image = { url, filename }; // Assign the image object to the new listing
    await newListing.save(); // Save the new listing with the image information

    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    //Check if the listing exists, if not, redirect to the listings page with an error message
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    };
    res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;         // Get the URL of the uploaded image from req.file.path
        let filename = req.file.filename;  // Get the URL and filename of the uploaded image from req.file
        listing.image = { url, filename }; // Update the image object of the listing
        await listing.save(); // Save the updated listing
    }
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};