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

//POST a new friend into an existing user
router.post('/:userId/add-friend', (req, res, next) => {

    //if user to add accepts, update both users to 'friends' code

    const from = req.params.userId;
    const to = req.body.user_name;

    User.findOne({ user_name: to })
        .exec()
        .then(reciever => {
            if (reciever) {

                //found user to add.
                //add both user into each others friends
                //update the added user with 'requested' code, 
                //update current user with 'pending' code

                User.findOneAndUpdate({ uid: from }, { 'friends.User': { $ne: reciever.uid } }, {
                    $push: {
                        friends: reciever
                    }
                })
                .then(() => {
                        User.findOneAndUpdate({ user_name: to }, { 'friends.User': { $ne: from } }, {
                            $push: {
                                friends: from
                            }
                        })
                    })
                    .then(() => {
                        res.status(201).json({
                            message: 'user added',
                            requestUid: from,
                            recipientUid: reciever.uid,
                            result: sender,
                        })
                    })
                    .catch(error =>{
                        res.status(404).json({
                            error: error
                        })
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
                message: 'could not find reciepient',
                error: err
            })
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

    User.find

    User.findOneAndUpdate({uid: id}, {$pull: {'friends': {'uid': friendId}} })
    .exec()
    .then(() => { // remove the user from the other list
        User.findOneAndUpdate({uid: friendId}, {$pull: {'friends': {'uid': id}} })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'friends list updated',
                user: id,
                removed: friendId,
                result: result,
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