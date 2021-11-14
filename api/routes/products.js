const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const storageStrategy = multer.diskStorage({
  // storage config
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = function (req, file, cb) {
  // file type config
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); //accept the file
  } else {
    cb(null, false); // decline file
  }
};
const upload = multer({
  storage: storageStrategy,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
}); // Accept upto 5mb

const router = express.Router();
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id image") // select only required fields
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: err?.message,
      });
    });
});

// Use Form Data for Request
router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  // Create New Model from Product Schema
  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file?.path,
  });
  // Save to DB
  newProduct
    .save()
    .then((doc) => {
      console.log(doc);
      res.status(201).json({
        message: "Created Product Successfully",
        createdProduct: {
          _id: doc.id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
        },
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
    .select("name price _id image") // select only required fields
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
