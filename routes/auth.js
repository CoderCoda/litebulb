const express = require("express");
const router = express.Router();
const passport = require("passport");

module.exports = router;

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/user/login",
    failureFlash: true
}), (req, res) => {
    // Successful authentication
    res.redirect("/ideas");
});