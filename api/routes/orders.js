const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const Auth = require('../middleware/auth')

router.get("/", Auth,(req, res, next) => {
  Order.find()
    .select("productId quantity _id")
    .populate('productId','name')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Order: docs
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post("/",Auth,(req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        productId: req.body.productId,
        quantity: req.body.quantity
      });
      order
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({ message: "Order made." });
        })
        .catch(err => {
          res.status(500).json({ error: err });
        });
    })
    .catch(err => {
      res.status(500).json({ message: "Invalid product id. " });
    });
});

router.get("/:orderId",Auth, (req, res, next) => {
  let id = req.params.orderId;
  Order.findById(id).populate('productId','name')
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Order not found." });
      }
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:orderId",Auth,(req, res, next) => {
  let id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({ message: "Order was deleted ." });
    })
    .catch(err => {
      error: err;
    });
});

module.exports = router;
