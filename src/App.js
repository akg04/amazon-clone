import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Checkout from "./Checkout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";
import Orders from "./Orders";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const promise = loadStripe(
  "pk_test_51KUDhkSJTuaHWiyyj4V7WNIexlI3YIOMDzjYzJTETzpoAq9XqtjATpODnRbwXSLQJ1c7uVMFLbbM6tjsdpmdpZ5g00UGi0yyfv"
);
function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    //will only change after the app component loads.. ye listner h login ya logout hone pe bhi refire hoga ye code
    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>", authUser);
      if (authUser) {
        //the user just logged in /or the user was logged in
        dispatch({
          type: "SETUSER",
          user: authUser,
        });
      } else {
        //the user is logged out
        dispatch({
          type: "SETUSER",
          user: null,
        });
      }
    });
  }, []);
  return (
    // bem convention
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={[<Header />, <Home />]} />

          <Route path="/checkout" element={[<Header />, <Checkout />]} />
          <Route path="/login" element={[<Login />]} />
          <Route
            path="/payment"
            element={[
              <Header />,
              <Elements stripe={promise}>
                <Payment />
              </Elements>,
            ]}
          />
          <Route path="/orders" element={[<Header />, <Orders />]} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
