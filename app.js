const express = require('express');
const morgan = require('morgan');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

// Filter Routes with /products, goes with productRoutes
app.use('/products', productRoutes);

// Filter Routes with /orders, goes with productRoutes
app.use('/orders', orderRoutes);

// Handling Errors
// 404 - Not Found Error Handling
app.use((req, res, next) => {
	const error = new Error('Not Found!');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;