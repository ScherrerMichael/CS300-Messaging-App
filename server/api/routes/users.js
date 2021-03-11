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

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        uid: req.body.uid,
        user_name: req.body.user_name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: req.body.password,
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