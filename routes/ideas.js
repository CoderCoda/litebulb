const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {ensureAuthenticated} = require("../helpers/auth");
module.exports = router;


// load IdeaModel
require("../models/Idea");
const Idea = mongoose.model("ideas");


// ideas route
router.get("/", ensureAuthenticated, (req, res) =>{
	Idea.find({user:req.user.id}).sort({date:"desc"}).then(ideas => {
		res.render("ideas/index", {
			ideas:ideas
		});
	});
});


// add idea form route
router.get("/add", ensureAuthenticated, (req, res) => {
	res.render("ideas/add");
});
router.post("/", ensureAuthenticated, (req, res) => {
	const ideaDetail = {
		title: req.body.title,
		description: req.body.description,
		consumers: req.body.consumers,
		competitors: req.body.competitors,
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
		if (idea.user!==req.user.id){
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
		idea.title = req.body.title;
		idea.description = req.body.description;
		idea.consumers = req.body.consumers;
		idea.competitors = req.body.competitors;
		idea.save().then(() => {
			req.flash("success_msg", "Idea updated")
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