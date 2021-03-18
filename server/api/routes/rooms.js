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
    var roomTopic = req.body.topic;
    var room;
    const user = new User();

    User.findOne({uid: userId})
    .exec()
    .then(doc => { 
        if(doc){
        room = new Room({
            _id: new mongoose.Types.ObjectId(),
            owner: doc,
            topic: roomTopic,
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
            uid: req.body.uid,
            message_body: req.body.message_body,
            message_status: req.body.message_status,
            created_at: req.body.created_at
        })

        const result = await Room.updateOne({_id: id}, {$push:{
            messages: message
        }});

        res.status(201).json({
            message: "message added to room",
            result: message
        })

    } catch(err) {
        res.status(501).json({
            error: err
        })
    }
});


//POST a new User in an existing room
router.post('/:roomId/add-user', async (req, res, next) => {

        const userId = req.body._id; //database id NOT uid!!!
        const roomId = req.params.roomId;
    try{

        User.findOne({'_id':userId})
        .exec()
        .then(user => {
            if(user){

                Room.updateOne({_id: roomId}, {$push:{
                    users: user
                }})
                .then(result =>{
                    console.log(result);
                    res.status(201).json({
                        message: "user added to room",
                        result: result
                    })
                });

            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided uid.'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });


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