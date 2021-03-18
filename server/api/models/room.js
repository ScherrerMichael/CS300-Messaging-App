const mongoose = require('mongoose');

const User= require('./user');
const Message = require('./message');

const roomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    topic: String,
    users: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },

            user_name: {
                type: String,
                ref: 'User'
            },

            uid: {
                type: String,
                ref: 'User'
            }
        }
    ],
    messages: [Message.schema],
    owner: {type: User.schema, default: {}},
    updated_at: {type: Date, default: Date.now},

});

module.exports = mongoose.model('Room', roomSchema);