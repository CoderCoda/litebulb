const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {ensureAuthenticated} = require("../helpers/auth");
module.exports = router;


// load IdeaModel
require("../models/Idea");
const Idea = mongoose.model("ideas");
// load UserModel
require("../models/User");
const User = mongoose.model("user");


// ideas route
router.get("/", ensureAuthenticated, (req, res) => {
	Idea.find({user:req.user.id}).sort({date:"desc"}).then(ideas => {
		res.render("ideas/index", {
			ideas:ideas
		});
	});
});


// show idea route
router.get("/show/:id", (req, res) => {
	Idea.findOne({_id:req.params.id}).populate("user").populate("comments.commentUser")
	.then(idea => {
		if (idea.status=="public"){
			res.render("ideas/show", {
				idea: idea
			});
		} else {
			if (req.user && req.user.id==idea.user._id){
				res.render("ideas/show", {
					idea: idea
				});
			} else {
				req.flash("error_msg", "You are not authorized to access this page");
				res.redirect("/");
			}
		}
	});
});


// public ideas route
router.get("/public", (req, res) => {
	Idea.find({status:"public"}).sort({date:"desc"}).populate("user")
	.then(ideas => {
		res.render("ideas/public", {
			ideas: ideas
		});
	});
});


// user ideas route
router.get("/user/:userId", (req, res) => {
	Idea.find({user:req.params.userId, status:"public"}).sort({date:"desc"})
	.populate("user").then(ideas => {
		User.findOne({_id:req.params.userId}).then(user => {
			res.render("ideas/public", {
				ideas: ideas,
				specific: user.firstName
			});
		});
	});
});


// add idea form route
router.get("/add", ensureAuthenticated, (req, res) => {
	res.render("ideas/add");
});
router.post("/", ensureAuthenticated, (req, res) => {
	const allowComments = (req.body.allowComments)? true:false;
	const ideaDetail = {
		title: req.body.title,
		description: req.body.description,
		consumers: req.body.consumers,
		competitors: req.body.competitors,
		status: req.body.status,
		allowComments: allowComments,
		user: req.user.id
	};
	new Idea(ideaDetail).save().then(idea => {
        req.flash("success_msg", "Idea added");
		res.redirect("/ideas");
	});
});


// edit idea form route
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		if (idea.user!=req.user.id){
			req.flash("error_msg", "You are not authorized to access this page")
			res.redirect("/ideas");
		} else {
			res.render("ideas/edit", {
				idea:idea
			});
		}
	});
});
router.put("/:id", ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		const allowComments = (req.body.allowComments)? true:false;

		idea.title = req.body.title;
		idea.description = req.body.description;
		idea.consumers = req.body.consumers;
		idea.competitors = req.body.competitors;
		idea.status = req.body.status;
		idea.allowComments = allowComments;
		idea.save().then(() => {
			req.flash("success_msg", "Idea updated");
			res.redirect("/ideas");
		})
	})
});


// delete idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
	Idea.deleteOne({_id: req.params.id}).then(() => {
		req.flash("success_msg", "Idea removed...you'll think of something else!");
		res.redirect("/ideas");
	});
});


// add comment
router.post("/comment/:id", ensureAuthenticated, (req, res) => {
	Idea.findOne({_id: req.params.id}).then(idea => {
		const newComment = {
			commentBody: req.body.comment,
			commentUser: req.user.id
		};

		idea.comments.unshift(newComment);
		idea.save().then(idea => {
			res.redirect(`/ideas/show/${idea.id}`);
		})
	})
});