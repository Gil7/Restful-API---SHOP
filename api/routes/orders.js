const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')
router.get('/', (req, res, next) => {
    Order.find()
    .select('productId quantity _id')
    .populate('productId','name price')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders : docs.map(order => {
                return {
                    _id: order._id,
                    productId: order.productId,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
})
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(result => {
        if(!result){
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            productId: req.body.productId,
            quantity: req.body.quantity
        })
        return order.save()

    })
    .then(result => {
        res.status(201).json({
            message: 'Order created',
            order: {
                _id: result._id,
                productId: result.productId,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }   
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
})
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('productId quantity _id')
    .populate('productId', 'name price')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http//localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
})

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id : req.params.orderId}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: 'ID',
                    quantity: 'Number'
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

module.exports = router