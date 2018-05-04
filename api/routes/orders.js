const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "orders"
    })
})
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "order created"
    })
})
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: "order details"
    })
})
router.put('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: "order updated"
    })
})
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: "order deleted"
    })
})

module.exports = router