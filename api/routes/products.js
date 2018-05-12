const express = require('express')
const router = express.Router()


const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    requuest: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            }) 
        }
        res.status(200).json(response)
    })
    .catch(err => {
        
        res.status(500).json(err)
    })
})
router.post('/', (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    })
    product.save()
    .then(result => {
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
})
router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId)
    .select('name price _id')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            })
        }
        else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            })
        }
    })
    .catch(err => {
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

        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + productId
            }
        })
    })
    .catch(err => {
        
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
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        })
    })
    .catch(err => {
        
        res.status(500).json({
            error : err
        })
    })
})
module.exports = router