const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uid: String,
    user_name: String,
    avatar: String,
    email: String,
    friends: [{
        // status
        // 0 - sent request to
        // 1 - recieved a request
        // 2 - friends
        status: Number,
        user_name: String,
        uid: String,
    }],
    is_active: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);