const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "products"
    })
})
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "product created"
    })
})
router.get('/:productId', (req, res, next) => {
    res.status(200).json({
        message: "product details"
    })
})
router.put('/:productId', (req, res, next) => {
    res.status(200).json({
        message: "producted updated"
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: "product deleted"
    })
})
module.exports = router