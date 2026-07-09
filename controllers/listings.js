const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

function escapeRegex(text = "") {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports.index = async (req, res) => {
    const { q = "", country = "", minPrice, maxPrice, sort = "recent" } = req.query;

    const filter = {};
    if (q.trim()) {
        const safeQuery = new RegExp(escapeRegex(q.trim()), "i");
        filter.$or = [
            { title: safeQuery },
            { description: safeQuery },
            { location: safeQuery },
            { country: safeQuery },
        ];
    }
    if (country.trim()) {
        filter.country = new RegExp(`^${escapeRegex(country.trim())}$`, "i");
    }
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
        recent: { createdAt: -1 },
        priceAsc: { price: 1 },
        priceDesc: { price: -1 },
    };

    const allListings = await Listing.find(filter).sort(sortMap[sort] || sortMap.recent);
    const featuredListings = await Listing.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(6);

    res.render("listings/index.ejs", {
        allListings,
        featuredListings,
        filters: { q, country, minPrice, maxPrice, sort },
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing || !listing.owner) {
        req.flash("error", "Listing you requested does not exist.");
        return res.redirect("/listings");
    }

    const reviewCount = listing.reviews.length;
    const averageRating =
        reviewCount === 0
            ? 0
            : listing.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

    const isFavorite = req.user
        ? Boolean(await User.exists({ _id: req.user._id, favorites: listing._id }))
        : false;

    res.render("listings/show.ejs", {
        listing,
        averageRating,
        reviewCount,
        isFavorite,
    });
};

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist.");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }

    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};

module.exports.addFavorite = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        req.flash("error", "Invalid listing id.");
        return res.redirect("/listings");
    }

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: new mongoose.Types.ObjectId(id) } });
    req.flash("success", "Added to your wishlist.");
    res.redirect(`/listings/${id}`);
};

module.exports.removeFavorite = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        req.flash("error", "Invalid listing id.");
        return res.redirect("/listings");
    }

    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: new mongoose.Types.ObjectId(id) } });
    req.flash("success", "Removed from your wishlist.");
    res.redirect(`/listings/${id}`);
};
