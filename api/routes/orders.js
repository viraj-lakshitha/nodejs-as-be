const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Orders were Fetched!'
	});
});

router.post('/', (req, res, next) => {
	res.status(201).json({ // 201 - created status code
		message: 'New Orders Created!'
	});
});

router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	res.status(201).json({ // 201 - created status code
		message: 'Order Fetched!',
		id: id
	});
});

router.delete('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	res.status(201).json({ // 201 - created status code
		message: 'Order Deleted!',
		id: id
	});
});

module.exports = router;