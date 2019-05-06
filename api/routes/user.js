const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../middleware/auth");
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({ error: "Email already taken." });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                res
                  .status(201)
                  .json({ message: "User created .", user: result });
              })
              .catch(err => {
                res.status(500).json({ error: err });
              });
          }
        });
      }
    });
});
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          error: "Auth failed."
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Auth failed."
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                _id: user[0]._id
              },
              "nodeSecret",
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              success: "Auth Successful.",
              token: token
            });
          } else {
            return res.status(401).json({
              error: "Auth failed."
            });
          }
        });
      }
    })
    .catch();
});

router.delete("/user/:id",Auth,(req, res, next) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then(result => {
      res.status(200).json({ message: "User deleted." });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});
module.exports = router;
