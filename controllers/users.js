const User = require("../models/user.js");

function getSafeRedirectUrl(redirectUrl) {
    if (typeof redirectUrl !== "string") return "/listings";
    if (!redirectUrl.startsWith("/") || redirectUrl.startsWith("//")) return "/listings";
    return redirectUrl;
}

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "There was an error logging you in after signup. Please log in manually.");
                return res.redirect("/login");
            }
            req.flash("success", "Welcome to Wanderlust! Account created successfully.");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back! You have successfully logged in.");
    const redirectUrl = getSafeRedirectUrl(res.locals.redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out successfully.");
        res.redirect("/listings");
    });
};
