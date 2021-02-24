
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Groups were fetched'
    })
})

router.post('/', (req, res, next) => {
    const group = {
        groupId: req.body.groupId,
        name: req.body.name
    }
    res.status(201).json({
        message: 'Groups were created',
        groupCreated: group
    })
})

router.get('/:groupId', (req, res, next) => {
    res.status(201).json({
        message: 'Group details',
        orderId: req.params.orderId
    })
})

router.delete('/:groupId', (req, res, next) => {
    res.status(201).json({
        message: 'Group details',
        orderId: req.params.orderId
    })
})

module.exports = router;