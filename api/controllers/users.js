const bcrypt = require("bcrypt");
const bcryptRounds = Number(process.env.BCRYPT_ROUND);
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_KEY;
const mongoose = require("mongoose");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((doc) => {
      if (doc.length >= 1) {
        res.status(409).json({
          errorMessage: "Email Address Already Exsist",
        });
      } else {
        bcrypt.hash(req.body.password, bcryptRounds, (err, hash) => {
          if (err) {
            res.status(500).json({
              errorMessage: "Error in BCrypt password",
            });
          } else {
            const newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            newUser
              .save()
              .then((doc) => {
                res.status(201).json({
                  message: "New User Created!",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  errorMessage: "Fail to Create New User!",
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong!",
      });
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length === 0) {
        res.status(401).json({
          errorMessage: "Auth Failed!",
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, resp) => {
        if (err) {
          res.status(401).json({
            errorMessage: "Auth Failed!",
          });
        }

        if (resp) {
          const jwtToken = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            jwtSecretKey,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth Success!",
            token: jwtToken,
          });
        }
        res.status(401).json({
          errorMessage: "Auth Failed!",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong!",
      });
    });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ email: req.params.email })
    .exec()
    .then((doc) => {
      res.status(200).json({
        message: "User Deteled!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong!",
      });
    });
};
