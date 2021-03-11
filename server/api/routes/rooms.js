const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');

const Room = require('../models/room');
const Message = require('../models/message');
const User = require('../models/user');

//fetch all rooms
router.get('/', (req, res, next) => {
    Room.find()
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs.length){
            res.status(200).json(docs);
        } else {
            res.status(404).json({
                message: 'No entries found'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});


//POST a new room
router.post('/', (req, res, next) => {
    const room = new Room({
        _id: new mongoose.Types.ObjectId(),
        topic: req.body.topic,
        users: req.body.users,
        messages: req.body.messages,
        owner: req.body.owner,
        updated_at: req.body.updated_at
    });
    
    room.save()
        .then( result => {
            console.log(result);
        res.status(201).json({
            messsage: 'created new room',
            createdRoom: result
    })
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            })
        });

});

//POST a new room, given the owners user id.
router.post('/:userId', (req, res, next) => {
    var userId = req.params.userId;
    var room;
    const user = new User();

    User.findOne({uid: userId})
    .exec()
    .then(doc => { 
        if(doc){
        room = new Room({
            _id: new mongoose.Types.ObjectId(),
            owner: doc,
        });
        room.save()
            .then( result => {
                console.log(result);
            res.status(201).json({
                messsage: 'created new room with owner id' + userId,
                createdRoom: result,
        })
            })
            .catch(err => {
                console.log(err);
                res.status(501).json({
                    error: err
                })
            });
        } else {
            res.status(404).json({
                message: 'No user found'
            })
        }
    });

});

//POST a new message in an existing room
router.post('/:roomId/messages', async (req, res, next) => {

    try{
        const id = req.params.roomId;

        const message = new Message({
            _id: new mongoose.Types.ObjectId(),
            user: req.body.User,
            message_body: req.body.message_body,
            message_status: req.body.message_status,
            created_at: req.body.created_at
        })

        const result = await Room.updateOne({_id: id}, {$push:{
            messages: message
        }});

        console.log(result);
        res.status(201).json({
            message: "message added to room",
            result: result
        })

    } catch(err) {
        res.status(501).json({
            error: err
        })
    }
});

//POST a new User in an existing room
router.post('/:roomId/users', async (req, res, next) => {

    try{
        const id = req.params.roomId;

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            user_name: req.body.user_name,
            avatar: req.body.avatar,
            email: req.body.email,
            password: req.body.password,
            is_active: req.body.is_active
        })

        const result = await Room.updateOne({_id: id}, {$push:{
            users: user
        }});

        console.log(result);
        res.status(201).json({
            message: "user added to room",
            result: result
        })

    } catch(err) {
        res.status(501).json({
            error: err
        })
    }
});

//fetch a single room based on id
router.get('/:roomId', (req, res, next) =>{
    const id = req.params.roomId;

    Room.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided id.'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

router.patch('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    const updateOps ={};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Room.update({_id: id}, {$set: updateOps})
    .exec()
    .then( result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
})


router.delete('/:roomId', (req, res, next) => {
    const id = req.params.roomId;
    Room.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
})

module.exports = router;