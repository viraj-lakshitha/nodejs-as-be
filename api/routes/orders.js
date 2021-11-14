const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/orders");

// Handle GET request to /orders
router.get("/", checkAuth, OrdersController.getAllOrders);

// Handle POST request to /orders
router.post("/", checkAuth, OrdersController.createNewOrder);

// Handle GET request to /orders/:orderId
router.get("/:orderId", checkAuth, OrdersController.getOrderById);

// Handle DELETE request to /orders/:orderId
router.delete("/:orderId", checkAuth, OrdersController.deleteOrder);

module.exports = router;
