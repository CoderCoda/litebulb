const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");

const app = express();
const keys = require("./config/keys"); // load keys for db and google auth

require("./config/passport_local")(passport); // passport_local config
require("./config/passport_google")(passport); // passport_google config


// sets public folder as express static folder
app.use(express.static(path.join(__dirname, 'public')));

// map global promises
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose.connect(keys.mongoURI, {useNewUrlParser:true})
	.then(() => console.log("MongoDB connected..."))
	.catch(err => console.log(err));
// handlebars middleware
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// method-override middleware
app.use(methodOverride("_method"));
// express-session middleware
app.use(session({
	secret: "kitty",
	resave: true,
	saveUninitialized: true
}));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
// connect-flash middleware
app.use(flash());


// global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.user = req.user || null;
	next();
});


// index route
app.get("/", (req, res) => {
	res.render("index");
});


// about route
app.get("/about", (req, res) => {
	res.render("about");
});


const ideas = require("./routes/ideas"); // load ideas routes
const user = require("./routes/user"); // load user routes
const auth = require("./routes/auth"); // load auth routes
app.use("/ideas", ideas);
app.use("/user", user);
app.use("/auth", auth);


const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});