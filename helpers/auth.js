/*
Only registered users should be able to access urls
from the 'ideas' route (i.e. index, add, edit, delete)
*/

module.exports = {
    ensureAuthenticated: function(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "You must be logged in to access this page");
        res.redirect("/user/login");
    }
};