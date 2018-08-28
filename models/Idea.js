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
    status:{
        type: String,
        required: true,
        default: "private"
    },
    allowComments:{
        type: Boolean,
        required: true,
        default: true
    },
    comments: [{
        commentBody: String,
        commentDate:{
            type: Date,
            default: Date.now
        },
        commentUser:{
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

mongoose.model('ideas', IdeaSchema);