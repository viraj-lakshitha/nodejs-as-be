const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");

// Handle POST request to /users/signup
router.post("/signup", UserController.signup);

// Handle POST request to /users/login
router.post("/login", UserController.login);

// Handle DELETE request to /users/:email
router.delete("/:email", UserController.deleteUser);

module.exports = router;
