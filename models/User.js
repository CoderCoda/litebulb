const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    googleID: String,
    email:{
        type: String,
        required: true
    },
    password: String
    /*
    image: String
    */
});

mongoose.model('user', UserSchema);