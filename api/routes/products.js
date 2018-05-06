const express = require('express')
const router = express.Router()


const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product.find().exec()
    .then(docs => {
        console.log(docs)
        res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})
router.post('/', (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    })
    product.save()
    .then(result => {console.log(result)})
    .catch(error => console.log(error))
    res.status(201).json({
        message: "product created",
        productCreated : product
    })
})
router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId).exec()
    .then(doc => {
        console.log("doc : ", doc)
        res.status(200).json(doc)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
    
})
router.put('/:productId', (req, res, next) => {
    const productId = req.params.productId
    const updateOps = {}
    for (const key of Object.keys(req.body)) {
        updateOps[key] = req.body[key]
    }

    Product.update({_id : productId}, { $set:  updateOps  })
    .exec()
    .then( doc => {
        res.status(200).json(doc)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
    
})

router.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.remove({_id : productId}).exec()
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})
module.exports = router