
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


require('dotenv').config();

const app = express();

app.use(express.static('public'))
const port = process.env.PORT || 5000;
const corsOptions = {
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}
app.use(cors(corsOptions));
app.use(express.json());


const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true,  dbName: "userDB" }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');


app.use('/orders', ordersRouter);
app.use('/products', productsRouter);



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
