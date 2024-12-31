const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
