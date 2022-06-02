const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  id: Number,
  name: String,
  description: String,
  ean: String,
  upc: String,
  image: String,
  images: [{ title: String, description: String, url: String }],
  net_price: Number,
  taxes: Number,
  price: Number,
  categories: [String],
  tags: [String],
});

module.exports = model("Product", productSchema);
