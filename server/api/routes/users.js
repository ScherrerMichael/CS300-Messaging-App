const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');

const User = require('../models/user');
const Room = require('../models/room');

//fetch all users
router.get('/', (req, res, next) => {
    User.find()
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

//fetch all rooms that contain a user Id.
router.get('/rooms/:userId', (req, res, next) => {

    const userId = req.params.userId;

    Room.find({'$or': [{'owner.uid': userId}, {'users.uid': userId}]})
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs.length){
            res.status(200).json({
                message: 'rooms that contain user id: ' + userId,
                result: docs,
            });
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

//POST a new user
router.post('/', (req, res, next) => {

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        uid: req.body.uid,
        user_name: req.body.user_name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: req.body.password,
        friends: req.body.friends,
        is_active: req.body.is_active
    })
    
    user.save()
        .then( result => {
            console.log(result);
        res.status(201).json({
            messsage: 'created new user',
            createdUser: result
    })
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            })
        });

});

//GET a user with a name that exists
router.get('/:name/exists', (req, res, next) => {
    const name = req.params.name;

    User.findOne({user_name: name})
    .exec()
    .then(doc => {

        if(doc)
        {
            res.status(200).json({
                result: 1
            })
        }
        else
        {
            throw new Error('user name does not exists')
        }
    })
    .catch(e => {
            res.status(400).json({
                error: e
            })
    })

});

//POST a new friend into an existing user (not confirmed)
router.post('/:userId/add-friend', (req, res, next) => {

    //if user to add accepts, update both users to 'friends' code

    const from = req.params.userId;
    const to = req.body.user_name;

    //find current user
    User.findOne({uid:from})
    .exec()
    .then(sender => {
        if(sender){
            User.findOne({user_name:to})
            .exec()
            .then(reciever => {
                if(reciever){
                    if(sender.user_name !== reciever.user_name)
                    {

                    User.bulkWrite([
                        {
                            updateOne:{
                                filter:{uid: from, 'friends.uid':{$ne: reciever.uid}},
                                update:{
                                    $push:{
                                        friends: {
                                            user_name: reciever.user_name,
                                            uid: reciever.uid,
                                            status: 0
                                        }
                                    }
                                }
                            }
                        },

                        {
                            updateOne:{
                                filter:{user_name: to, 'friends.uid':{$ne: sender.uid}},
                                update:{
                                    $push:{
                                        friends: {
                                            user_name: sender.user_name,
                                            uid: sender.uid,
                                            status: 1
                                        }
                                    }
                                }
                            }
                        }
                    ], function(err, result) {
                        if(err){
                            res.send(err)
                        } else {
                            res.status(201).json({
                                message: 'friend request sent',
                                senderUid : sender.uid,
                                recipientUid : reciever.uid,
                            })
                        }
                    })
                }

                } else { //no reciepient found 
                    res.status(404).json({
                        message: 'No valid entry found for provided uid.'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: 'could not find sender',
                    error: err
                })
            });
        } else { //user to send is not found.
            res.status(404).json({
                message: 'could not find reciever'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
    
});


//POST an acception request from a pending friend, updating both
router.post('/accept-friend', (req, res, next) => {

    //if user to add accepts, update both users to 'friends' code

    const from = req.body.from_uid;
    const to = req.body.to_uid;

    //find current user
    User.findOne({uid: from})
    .exec()
    .then(sender => {
        if(sender){
            User.findOne({uid: to})
            .exec()
            .then(reciever => {
                if(reciever){

                    let sf = sender.friends.find(f => f.uid === to)
                    sf.status = 2;
                    sender.save();

                    let rf = reciever.friends.find(f => f.uid === from)
                    rf.status = 2;
                    reciever.save();

                    res.status(201).json({
                        message: 'user added',
                        requestUid: from,
                        recipientUid: reciever.uid,
                        result_sender: sender,
                        result_recipient: reciever,
                    })


                } else { //no reciepient found 
                    res.status(404).json({
                        message: 'No valid entry found for provided uid.'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: 'could not find sender',
                    error: err
                })
            });
        } else { //user to send is not found.
            res.status(404).json({
                message: 'could not find reciever'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });

});

router.post('/:userId/rooms', (req, res, next) => {

    const id = req.params.userId;

    User.findById(id)
    
    user.save()
        .then( result => {
            console.log(result);
        res.status(201).json({
            messsage: 'created new user',
            createdUser: result
    })
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            })
        });

});

//fetch a single user based on userId
router.get('/:userId', (req, res, next) =>{
    const uid = req.params.userId;

    User.findOne({uid:uid})
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json(doc);
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
});

//Update fields
router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps ={};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    User.update({uid: id}, {$set: updateOps})
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

//remove a user's friend with uid //!!!!TODO: for some reason Patch/Delete requests do not work on chrome!!
router.post('/:userId/friends', (req, res, next) => {

    const id = req.params.userId;
    const friendId = req.body.friend_uid;

    User.findOneAndUpdate({uid: id},{$pull: {'friends': {'uid': friendId}} })
    .exec()
    .then(user => { // remove the user from the other list
        User.findOneAndUpdate({uid: friendId}, {$pull: {'friends': {'uid': id}} })
        .exec()
        .then(result => {
            console.log(user)
            res.status(200).json({
                message: 'friends list updated',
                user: id,
                removed: friendId,
                result: user,
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })

})

//DELETE a user with id
router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({uid: id})
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