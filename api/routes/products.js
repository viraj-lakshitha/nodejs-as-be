const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductController = require("../controllers/products");

const storageStrategy = multer.diskStorage({
  // storage configurations
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = function (req, file, cb) {
  // file type configurations
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); //accept file
  } else {
    cb(null, false); // decline file
  }
};
const upload = multer({
  storage: storageStrategy,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
}); // Accept upto 5mb

// Handle GET request to /products
router.get("/", ProductController.getAllProducts);

// Handle POST request to /products
// Use Form Data for Request
router.post(
  "/",
  upload.single("productImage"),
  checkAuth,
  ProductController.createNewProduct
);

// Handle GET request to /products/:productId
router.get("/:productId", ProductController.getProductById);

// Handle PATCH request to /products/:productId
router.patch("/:productId", checkAuth, ProductController.updateProduct);

// Handle DELETE request to /products/:productId
router.delete("/:productId", checkAuth, ProductController.deleteProduct);

module.exports = router;
