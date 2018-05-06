const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allor-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization')
    if (res.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, PATCH');
        res.json({})
    }
})


app.use('/products', productsRouter)
app.use('/orders', ordersRouter)


app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error : {
            message: error.message
        }
    })
})
module.exports = app