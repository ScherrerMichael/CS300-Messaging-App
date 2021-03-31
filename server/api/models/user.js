const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uid: String,
    user_name: String,
    avatar: String,
    email: String,
    password: String,
    friends: [{
        // status: Number,
        // user_name: String,
        // uid: String
        uid:{
            type: String,
            ref: 'User'
        },
        
        user_name:{
            type: String,
            ref: 'User'
        },
        
        status: Number

    }],
    is_active: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);