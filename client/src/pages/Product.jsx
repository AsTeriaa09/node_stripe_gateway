import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const stripeKey = import.meta.env.VITE_STRIPE_KEY;
const paymentAPI = import.meta.env.VITE_API_KEY;

const Product = () => {
  const [product, setProduct] = useState({
    name: "Coffee",
    price: 60,
    productBy: "AsTerism",
  });



const makePayment = (token) => {
    const body = { token, product };
    const headers = { "Content-Type": "application/json" };
  
    fetch(paymentAPI, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("Payment response:", data);
      })
      .catch((error) => {
        console.log("Payment error:", error);
      });
  };

  return (
    <div>
      Price : {product.price}
      <StripeCheckout
        stripeKey={stripeKey}
        token={makePayment}
        name="Buy Coffee "
        amount={product.price * 100}
      >
      </StripeCheckout>
    </div>
  );
};

export default Product;
