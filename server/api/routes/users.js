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

    Room.find({'owner.uid': userId})
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

//TODO: fetch all friends of a user
router.get('/:userId/friends', (req, res, next) => {

    const userId = req.params.userId;

    User.findOne({uid:userId})
    .select('friends')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json({
                uid: userId,
                result: doc
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

//POST a new friend into an existing user
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
                    //found user to add.
                    //add bothe user into each others friends
                    //update the added user with 'requested' code, 
                    //update current user with 'pending' code

                    sender.friends.push({reciever, status: 0});
                    sender.save()

                    reciever.friends.push({sender, status: 1});
                    reciever.save();

                    res.status(201).json({
                        message: 'user added',
                        requestUid: from,
                        recipientUid: reciever.uid
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