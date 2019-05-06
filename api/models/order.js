const mongoose = require("mongoose");
// this creates a collection in the database known as Products via the model name
const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required:true},
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model("Order", OrderSchema);
