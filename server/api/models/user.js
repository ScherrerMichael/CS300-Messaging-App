const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: String,
    avatar: String,
    email: String,
    password: String,
    friends: [String],
    is_active: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);