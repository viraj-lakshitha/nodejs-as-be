const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware.js/check-auth");
const Order = require("../models/order");
const Product = require("../models/product");

// Handle GET request to /orders
router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate('product', '_id name')
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Orders were Fetched!",
        orders: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error?.message,
      });
    });
});

// Handle POST request to /orders
router.post("/", checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: "Product not found for the Id " + req.body.productId,
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save().then((result) => {
        console.log(result);
        res.status(201).json({
          // 201 - created status code
          message: "New Orders Created!",
          createdOrder: order,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err?.message,
      });
    });
});

// Handle GET request to /orders/:orderId
router.get("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("_id product quantity")
    .populate('product', '_id name')
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order Fetched!",
        id: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error?.message,
      });
    });
});

// Handle DELETE request to /orders/:orderId
router.delete("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((res) => {
      res.status(200).json({
        message: "Order Deleted!",
        id: id,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err?.message,
      });
    });
});

module.exports = router;
