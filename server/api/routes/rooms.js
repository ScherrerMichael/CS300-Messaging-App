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

//POST a new private room, given two owners id (uid) //TODO: might make a 'is direct message' attribute
router.post('/:userId/private', (req, res, next) => {
    var userId = req.params.userId;
    var otherUserId = req.body.userId;
    var roomTopic = req.body.topic;
    var room;

    User.findOne({uid: userId})
    .exec()
    .then(doc => { 
        if(doc){

            User.findOne({uid: otherUserId})
            .exec()
            .then(doc2 =>{
                if(doc2){
                    room = new Room({
                        _id: new mongoose.Types.ObjectId(),
                        owner: [doc, doc2],
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
                                    message: 'second user not found'
                                })
                            }
            })
        } else {
            res.status(404).json({
                message: 'No user found'
            })
        }
    });

});

//POST a new message in an existing room
router.post('/:roomId/messages', async (req, res, next) => { //TODO Test This!!

        const userId = req.body.uid
        const id = req.params.roomId;

        let  message = new Message({
            _id: new mongoose.Types.ObjectId(),
            message_body: req.body.message_body,
            message_status: req.body.message_status,
            created_at: req.body.created_at
        })

        User.findOne({uid: userId})
        .then(doc => {
            if(doc)
            {
                message.user = doc;

                Room.updateOne({_id: id}, {$push:{
                    messages: message,
                }})
                .then(() => {
                    res.status(201).json({
                        message: "message added to room",
                        result: message
                    })
                });

            } else {
                res.status(404).json({
                    message: 'user not found'
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
});


//POST a new User in an existing room
router.post('/:roomId/add-user', async (req, res, next) => {

        const userId = req.body.uid;
        const id = req.params.roomId;


        User.findOne({'uid':userId})
        .exec()
        .then(user => {
            if(user){

                Room.updateOne({_id: id}, {$push:{
                    users: user,
                    user_name: user.user_name,
                    uid: user.uid,
                }})
                .then(result => {

                    res.status(201).json({
                        message: "user added to room",
                    })
                })


            } else {
                console.log('no user found');
                res.status(404).json({
                    message: 'No valid entry found for provided uid.'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
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


router.post('/:roomId/remove', (req, res, next) => { //TODO: dont know why delete request are not accepted..
    //I changed this to post for that reason
    const id = req.params.roomId;
    Room.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'removed room',
            removed_id: id,
            result: result,
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
})

module.exports = router;