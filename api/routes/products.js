const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Product = require("../models/product");

router.get("/", (req, res, next) => {
	Product.find()
		.exec()
		.then((doc) => {
			res.status(200).json(doc);
		})
		.catch((err) => {
			res.status(500).json({
				errorMessage: err?.message,
			});
		});
});

router.post("/", (req, res, next) => {
	// Create New Model from Product Schema
	const newProduct = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
	});

	// Save to DB
	newProduct
		.save()
		.then((doc) => {
			console.log(doc);
			res.status(201).json({
				message: "Handling POST request to /products",
				createdProduct: doc,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				errorMessage: err?.message,
			});
		});
});

router.get("/:productId", (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.exec()
		.then((doc) => {
			console.log("From DB: ", doc);
			doc
				? res.status(200).json(doc)
				: res.status(404).json({
						message: "No Valid Entry for given Id",
				  });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				errorMessage: err?.message,
			});
		});
});

router.patch("/:productId", (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};

	/* Format for the RequestBody
	 [
    	{
        	"propName": "name",
        	"value": "Harry Potter in SIN"
    	}
	 ]
	*/

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	Product.update({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json({
				errorMessage: err?.message,
			});
		});
});

router.delete("/:productId", (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then((doc) => {
			console.log(err);
			res.status(200).json(doc);
		})
		.catch((err) => {
			res.status(500).json({
				errorMessage: err?.message,
			});
		});
});

module.exports = router;
