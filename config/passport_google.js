const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("./keys");

// load UserModel
require("../models/User");
const User = mongoose.model("user");

module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;

            User.findOne({email: email}).then(user => {
                if (user){
                    if (user.googleID){ // registered with Google
                        return done(null, user);
                    }
                    console.log("ya damn skippy")
                    return done(null, false, {message: "The email linked to your Google account has already been registered. Please login using the input fields below"});
                } else {
                    const newUser = {
                        name: profile.displayName,
                        googleID: profile.id,
                        email: profile.emails[0].value
                    };
                    
                    new User(newUser).save().then(user => {
                        done(null, user);
                    })
                }
            })
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}