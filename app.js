const express = require('express')
const morgan = require('morgan')
const app = express()
const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')

app.use(morgan('dev'))


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