const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uid: String,
    user_name: String,
    avatar: String,
    email: String,
    password: String,
    friends: [{
        user: {   
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        status: Number,
        enums: [
            0, //sent request to
            1, //recieved request
            2, //pending
            3, //friends
        ]
    }],
    is_active: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);