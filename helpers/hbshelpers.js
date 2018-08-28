const moment = require("moment");

module.exports = {
    formatDate: function(date, format){
        return moment(date).format(format);
    },
    select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"')
        .replace(new RegExp(">" + selected + "</option>"), 'selected="selected"$&');
    },
    editDelete: function(ideaUser, loggedUser, ideaId){
        if (ideaUser==loggedUser){
            return `<a class="btn btn-secondary btn-block mb-2" href="/ideas/edit/${ideaId}">Edit</a><form method="post" action="/ideas/${ideaId}?_method=DELETE"><input type="submit" class="btn btn-danger btn-block" value="Delete"></form>`;
        } else {
            return "";
        }
    }
};