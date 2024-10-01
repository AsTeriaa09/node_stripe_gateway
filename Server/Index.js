require('dotenv').config();
const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("hello!it works!")
})

app.post("/payment", async (req, res) => {
    const { product, token } = req.body;
    //console.log("Product:", product);
    //console.log("Token:", token);

    const idempotencyKey = uuidv4();

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        //console.log("Customer created:", customer.id);

        const charge = await stripe.charges.create({
            amount: product.price * 100, 
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email, 
            description: product.name,
            shipping: {
                name: token.card.name,
                address: { country: token.card.address_country },
            },
        }, { idempotencyKey });

        //console.log("Charge created:", charge.id);
        res.status(200).json(charge);
    } catch (error) {
        //console.error("Error processing payment:", error.message);
        res.status(500).json({ msg: "Payment failed", error: error.message });
    }
});

// app.post("/payment", (req, res) => {
//     const { product, token } = req.body;
//     console.log("Product", product);
//     console.log("price", product.price);
//     const idempotencyKey = uuidv4();

//     return stripe.customers.create({
//         email: token.email,
//         source: token.id
//     }).then(customer => {
//         stripe.charges.create({
//             amount: product.price * 100,
//             currency: 'usd',
//             customer: customer.id,
//             receipt_email: token.email,
//             description: product.name,
//             shipping: {
//                 name: token.card.name,
//                 address: { country: token.card.address_country }
//             }
//         }, { idempotencyKey })
//     }).then(result => {
//         console.log("Charge created:", charge.id);
//         res.status(200).json(charge);
//     }).catch(err => {
//         res.status(500).json({ msg: err });
//     })
// })


// listen
const Port = process.env.port;

app.listen(Port, () => {
    console.log("server is running")
})





