const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')
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
router.get('/',  ProductsController.products_get_products)
router.post('/', upload.single('productImage'), ProductsController.products_create_product)
router.get('/:productId', ProductsController.products_get_product)
router.put('/:productId', checkAuth, ProductsController.products_update_product)
router.delete('/:productId', checkAuth, ProductsController.products_delete_product)
module.exports = router