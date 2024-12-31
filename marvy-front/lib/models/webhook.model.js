const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderwSchema = new Schema(
  {
    
    products: [
      { productId: { type: String }, quantity: { type: Number, default: 1 } },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Order", orderwSchema);

module.exports = Orders;