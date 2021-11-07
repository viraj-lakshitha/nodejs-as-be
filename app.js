const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


// app.use((req, res, next) => {
// 	res.status(200).json({
// 		message: "It Works!"
// 	});
// });

// Filter Routes with /products, goes with productRoutes
app.use('/products', productRoutes);

// Filter Routes with /orders, goes with productRoutes
app.use('/orders', orderRoutes);

module.exports = app;