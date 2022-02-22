import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
const Header = () => {
  const [{ basket, user }, dispatch] = useStateValue();
  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };
  return (
    <div className="header">
      <Link to="/">
        <img
          className="header__logo"
          src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
        />
      </Link>

      <div className="header__search">
        <input className="header__searchInput" type="text" />
        {/* logo */}
        <SearchIcon className="header__searchIcon" />
      </div>
      <div className="header__nav">
        {/* //agar logout h to usse signin dikhega to login page pe jao waran wo
        already logged in h to ispe clik krne pe bas signout kr do aur usi page
        pe raho */}
        <Link to={!user && "/login"}>
          <div onClick={handleAuthentication} className="header__option">
            <span className="header_option_LineOne">
              Hello {!user ? "Guest" : user.email}
            </span>
            <span className="header_option_LineTwo">
              {/* //optional chaining */}
              {user ? "Sign Out" : "Sign In"}
            </span>
          </div>
        </Link>
        <Link to="/orders">
          <div className="header__option">
            <span className="header_option_LineOne">Returns</span>
            <span className="header_option_LineTwo">& Orders</span>
          </div>
        </Link>
        <div className="header__option">
          <span className="header_option_LineOne">Your</span>
          <span className="header_option_LineTwo">Prime</span>
        </div>
        <Link to="/checkout">
          <div className="header__optionBasket">
            <ShoppingCartIcon />
            <span className="header__optionLineTwo header__basketCount">
              {/* ? to handle the error if basket is undefined optional chaining*/}
              {basket?.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
