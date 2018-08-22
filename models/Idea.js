const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const IdeaSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    description: String,
    consumers: String,
    competitors: String,
    user:{
        type: String,
        required: true
    }
});

mongoose.model('ideas', IdeaSchema);