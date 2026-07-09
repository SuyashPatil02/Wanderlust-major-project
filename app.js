if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

require("./config/env.js");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const { dbUrl, sessionSecret, port, nodeEnv } = require("./config/env.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();

if (nodeEnv === "production") {
    app.set("trust proxy", 1);
}

mongoose
    .connect(dbUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection failed:", err.message));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(morgan(nodeEnv === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many requests from this IP. Please try again later.",
});
app.use(limiter);

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", "https://api.mapbox.com"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.jsdelivr.net",
                    "https://cdnjs.cloudflare.com",
                    "https://api.mapbox.com",
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.jsdelivr.net",
                    "https://fonts.googleapis.com",
                    "https://cdnjs.cloudflare.com",
                    "https://api.mapbox.com",
                ],
                imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            },
        },
    })
);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: sessionSecret },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.error("Session store error", err);
});

app.use(
    session({
        store,
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: nodeEnv === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong. Please try again later." } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
