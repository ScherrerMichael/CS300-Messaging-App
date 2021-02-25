const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');

const Message = require('../models/message');

//fetch all messages
router.get('/', (req, res, next) => {
    Message.find()
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

router.post('/', (req, res, next) => {
    console.log(req.body);
    const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.User,
        message_body: req.body.message_body,
        message_status: req.body.message_status,
        created_at: req.body.created_at
    })
    
    message.save()
        .then( result => {
            console.log(result);
        res.status(201).json({
            messsage: 'Handling POST requests to /messages',
            created_message: result
    })
        })
        .catch(err => {
            console.log(err);
            res.status(501).json({
                error: err
            })
        });

});

//fetch a single message based on id
router.get('/:messageId', (req, res, next) =>{
    const id = req.params.messageId;

    Message.findById(id)
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

router.patch('/:messageId', (req, res, next) => {
    const id = req.params.messageId;
    const updateOps ={};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Message.update({_id: id}, {$set: updateOps})
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

router.delete('/:messageId', (req, res, next) => {
    const id = req.params.messageId;
    Message.remove({_id: id})
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