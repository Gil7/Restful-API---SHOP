const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file , cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
const upload = multer({ 
    storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter
})
const Product = require('../models/product')



router.get('/', (req, res, next) => {
    Product.find()
    .select('name price productImage _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
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
router.post('/', upload.single('productImage'),(req, res, next) => {
    console.log(req.file)
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage : req.file.path
    })
    product.save()
    .then(result => {
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
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
    .select('name price productImage  _id')
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