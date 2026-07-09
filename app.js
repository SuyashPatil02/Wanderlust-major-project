if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejs = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");


const userRouter = require("./routes/user.js");

//const MONGODB_URI = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.NODE_ENV === "production"
    ? process.env.ATLASDB_URI
    : "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(dbUrl);
    console.log("MongoDB Connected");
};

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejs);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", (err) => {
    console.log("Session Store Error", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,// 1 week
        httpOnly: true,
    },
};

// app.get("/", (req, res) => {
//     res.send("I am the backend for Wanderlust, a travel listing application. Please use the /testlistings endpoint to add a sample listing to the database. ");
// });



app.use(session(sessionOptions));
app.use(flash());


// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Use the LocalStrategy for authentication
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user instances to and from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // Make the current user available in all templates
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong. Please try again later." } = err;

    res.render("error.ejs", { statusCode, message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server Running on Port 8080");
});