const mongoose = require('mongoose');

const User= require('./user');
const Message = require('./message');

const roomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    topic: String,
    users: [User.schema],
    messages: [Message.schema],
    owner: {type: User.schema, default: {}},
    updated_at: {type: Date, default: Date.now},

});

module.exports = mongoose.model('Room', roomSchema);