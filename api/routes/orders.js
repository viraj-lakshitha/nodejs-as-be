const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Orders were Fetched!'
	});
});

router.post('/', (req, res, next) => {
	const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	}
	res.status(201).json({ // 201 - created status code
		message: 'New Orders Created!',
		createdOrder: order
	});
});

router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	res.status(200).json({
		message: 'Order Fetched!',
		id: id
	});
});

router.delete('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	res.status(200).json({
		message: 'Order Deleted!',
		id: id
	});
});

module.exports = router;