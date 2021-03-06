const mongoose = require("mongoose");
const Product = require("../models/product");

exports.getAllProducts = (req, res, next) => {
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
};

exports.createNewProduct = (req, res, next) => {
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
};

exports.getProductById = (req, res, next) => {
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
};

exports.updateProduct = (req, res, next) => {
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
};

exports.deleteProduct = (req, res, next) => {
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
};
