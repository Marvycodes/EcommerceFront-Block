const express = require("express");
const router = require("express").Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let Orders = require("../models/checkout.models");
let Order = require("../models/webhook.model");

router.route("/").get((req, res) => {
  Orders.find()
    .sort({ updatedAt: -1 })
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/create-checkout-session").post(async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      img: JSON.stringify(req.body.cartProducts.map((p) => p.images[0])),
      cart: JSON.stringify(req.body.cartProducts.map((p) => p.title)),
    },
  });
  const line_items = req.body.cartProducts.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.images[0]],

          metadata: {
            _id: item._id,
            name: item.title,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: req.body.cartProducts.filter((obj) => obj._id === item._id)
        .length,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "NG"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    mode: "payment",

    success_url: `${process.env.PUBLIC_URL}/checkout-success`,
    cancel_url: `${process.env.PUBLIC_URL}/cart`,
  });

  const name = req.body.name;
  const email = req.body.email;
  const city = req.body.city;
  const postalCode = req.body.postalCode;
  const streetAddress = req.body.streetAddress;
  const country = req.body.country;
  const cartProducts = req.body.cartProducts;

  const newOrders = new Orders({
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
    line_items,
  });

  newOrders
    .save()
    .then(res.send({ url: session.url }))
    .catch((err) => res.status(400).json("Error: " + err));
});

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const products = Items.map((item) => {
    return {
      productId: item._id,
      quantity: item.cartQuantity,
    };
  });

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};
let endpointSecret;
// endpointSecret =  "whsec_f877defef842a9f5c05d8b405aae45ab00c2aebd4506e793b0d0522ed53f5c64";
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let data;
    let eventType;
    if (endpointSecret) {
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook verified");
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        console.log(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            createOrder(customer, data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const city = req.body.city;
  const postalCode = req.body.postalCode;
  const streetAddress = req.body.streetAddress;
  const country = req.body.country;
  const cartProducts = req.body.cartProducts;

  const newOrders = new Orders({
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
    line_items,
  });

  newOrders
    .save()
    .then(() => res.json("Orders added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
