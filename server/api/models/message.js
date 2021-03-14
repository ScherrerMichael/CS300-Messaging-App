const mongoose = require('mongoose');

const User = require('./user');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uid: String,
    message_body: String,
    message_status: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Message', messageSchema);