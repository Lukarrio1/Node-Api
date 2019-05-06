const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/product");
const Auth = require('../middleware/auth')
// thiS package accept form multi part data
const multer = require("multer");
// this is the storage config  for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
// validate img
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// this is a get request for all of the products
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id Image")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        product: docs
      };
      if (docs.length >= 1) {
        res.status(200).json(response);
      } else {
        res.status(204).json({ message: "Products table empty." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});
// this stores a new product
router.post("/", Auth,upload.single("productImg"),(req, res, next) => {
  console.log(req.file);
  let name = req.body.name;
  let price = parseFloat(req.body.price);
  if (name.length < 3) {
    res.status(404).json({ error: "Item name  is too short." });
  } else if (price < 1 || NaN) {
    res.status(404).json({ error: "price is not valid." });
  } else {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      price: price,
      Image: req.file.path
    });
    product
      .save()
      .then(result => {
        res.status(201).json({
          message: "Product created.",
          createdProduct: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
});
// this returns a single product by id
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id.length < 23) {
    res.status(404).json({ error: "invalid id." });
  } else {
    Product.findById(id)
      .exec()
      .then(doc => {
        console.log("From the database ", doc);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({
            message: "error not found."
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
});
// this updates a single product
router.patch("/:productId",Auth, (req, res, next) => {
  const id = req.params.productId;
  let name = req.body.name;
  let price = parseFloat(req.body.price);
  if (name < 3) {
    res.status(404).json({ message: "Product name is too short." });
  } else if (price < 1) {
    res.status(404).json({ message: "Product price is not valid." });
  } else {
    Product.update({ _id: id }, { name: name, price: price })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
});
// this deletes a product by id
router.delete("/:productId",Auth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(res => {
      res.status(200).json(res);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
