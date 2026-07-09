const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "There was an error logging you in after signup. Please log in manually.");
                return res.redirect("/login");
            }
            req.flash("success", "Welcome to Wanderlust! You have successfully signed up. Please log in to continue.");
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
    res.redirect(res.locals.redirectUrl || "/listings"); // Redirect to the saved URL or default to /listings
};


module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out successfully.");
        res.redirect("/listings");
    });
};