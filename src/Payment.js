import React, { useState } from "react";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import { Link, useNavigate } from "react-router-dom";
import Checkout from "./Checkout";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import { useEffect } from "react";
import axios from "./axios";
import { db } from "./firebase";
const Payment = () => {
  const [{ basket, user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  //creating two pieces of state

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);
  //this function depends on changing of basket if ///basket change the secret will change and this function will triger
  useEffect(() => {
    //generate the special stripe secret which
    //allows us to charge a customer ? mark is for query about total
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // Stripe expects the total in a currencies subunits so it will expect price in paise passes total amount to the api
        url: `/payments/create?total=${Math.round(
          getBasketTotal(basket) * 100
        )}`,
      });
      setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
  }, [basket]);
  console.log("the secret is >>>", clientSecret);
  console.log("😊", user);
  const handleSubmit = async (event) => {
    // do stipe stuff
    //stop from refressing
    event.preventDefault();
    //block buy now button after clicking one
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        //payment Intent=payment confirmation
        //no sql database
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        setSucceeded(true);
        setError(null);
        setProcessing(false);
        //ek baar payment kr di to wo page history se hata to taki user uspe doobara back na ja sake empty kr do basket after order sucess
        dispatch({
          type: "EMPTY_BASKET",
        });
        navigate("/orders", { replace: true });
      });
  };
  const handleChange = (event) => {
    //listen for changes in the CardElement
    // and display any errors as the Customer types //their card details if event  is empty then
    //disable the button
    setDisabled(event.empty);
    //if there is any error show the error
    setError(event.error ? event.error.message : "");
  };
  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout(
          <Link to="/checkout">{basket.length} items</Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p> b-4 nand dilshad</p>
            <p> delhi india</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review Items and Delivery</h3>
          </div>
          <div className="payment__items">
            {/* reusing checkout product componet to iska matlab is div me sari us checkout product bhi sare product list hote h uski functionality aa jayegi */}
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/*stripe magic */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total: {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"inr"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {/* error */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
