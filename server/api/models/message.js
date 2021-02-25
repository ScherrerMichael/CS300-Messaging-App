const mongoose = require('mongoose');

const User = require('./user');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: User.schema, default: {}},
    message_body: String,
    message_status: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Message', messageSchema);