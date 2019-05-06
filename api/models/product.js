const mongoose = require("mongoose");
// this creates a collection in the database known as Products via the model name
const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type:String , required:true},
  price: { type: Number, required: true },
  Image:{type:String,required:true}
});

module.exports = mongoose.model("Product", ProductSchema);
