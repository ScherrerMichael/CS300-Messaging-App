const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        uid: 
        {
            type: String,
            ref: 'User'
        },

        user_name: 
        {
            type: String,
            ref: 'User'
        }
    },
    message_body: String,
    message_status: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Message', messageSchema);