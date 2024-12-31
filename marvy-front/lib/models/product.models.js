const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: {type: [String]},
    category: {type: mongoose.Types.ObjectId, ref:'category'},
    productProperties: {type:Object},

  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("Products", productsSchema);

module.exports = Products;
