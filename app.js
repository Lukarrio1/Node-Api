const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
mongoose.connect(
  "mongodb+srv://json:root@cluster0-oe3tj.mongodb.net/Node?retryWrites=true",
  { useNewUrlParser: true }
);
// this is a logger for node js
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
// this parses the body of data that is sent to the api
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Controller-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
// this is the product routes
app.use("/products", productRoutes);
// this is the order routes
app.use("/orders", orderRoutes);
// this is the user routes
app.use("/user", userRoutes);
// this middleware handles the errors
app.use((req, res, next) => {
  const error = new Error("Not found.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
