const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
module.exports = router;


// load UserModel
require("../models/User");
const User = mongoose.model("user");


// user login route
router.get("/login", (req, res) => {
	res.render("user/login");
});
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/ideas",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next);
});

// user logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "Logged out");
    res.redirect("/user/login");
})


// user register route
router.get("/register", (req, res) => {
	res.render("user/register");
});
router.post("/register", (req, res) => {
    let errors = [];

    const pass = req.body.password;
    const conf = req.body.confirm;
    
    if (pass.length<8) errors.push({text: "Password must be at least 8 characters"});
    if (pass!==conf) errors.push({text: "Passwords do not match"});
    
    if (errors.length>0){
        res.render("user/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email
        });
    } else {
        User.findOne({
            email:req.body.email
        }).then(user => {
            if (user){
                req.flash("error_msg", "Email already registered");
                res.redirect("/user/register")
            } else {
                const firstName = req.body.name.split(" ")[0];
                const newUser = {
                    name: req.body.name,
                    firstName: firstName,
                    email: req.body.email,
                    password: req.body.password
                };
        
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        new User(newUser).save().then(idea => {
                            req.flash("success_msg", "Successfully registered");
                            res.redirect("/user/login");
                        }).catch(err => {
                            console.log(err);
                            throw err;
                        });
                    });
                });
            }
        });
        
    }
});