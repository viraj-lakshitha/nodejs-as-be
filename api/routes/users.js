const express = require("express");
const mongoose = require("mongoose");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptRounds = Number(process.env.BCRYPT_ROUND);

const router = express.Router();
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    User.find({email: req.body.email}).exec().then(doc =>{
        if (doc.length >= 1) {
            res.status(409).json({
                errorMessage: "Email Address Already Exsist"
            })
        } else {
            bcrypt.hash(req.body.password, bcryptRounds, (err, hash) => {
                if (err) {
                  res.status(500).json({
                    errorMessage: "Error in BCrypt password",
                  });
                } else {
                  const newUser = new user({
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
    }).catch(err => {
        res.status(500).json({
            errorMessage: "Something went wrong!"
        })
    })
});

router.delete('/:email', (req, res, next) => {
    User.deleteOne({email: req.params.email}).exec().then(doc => {
        res.status(200).json({
            message: 'User Deteled!'
        })
    }).catch(err => {
        res.status(500).json({
            errorMessage: "Something went wrong!"
        })
    })
})

module.exports = router;
