import React from "react";
import "../styles/App.css";
import PropTypes from "prop-types";
import Button from "./Button";
import "../styles/button.css";

const Banner = ({ children }) => {
  return (
    <div>
      <header className="banner">
        <div className="bannerTitle">
          <div>{children}</div>
          <h1 id="title" style={{ textAlign: "center", marginLeft: "7.5%" }}>
            Strasbourg Secure Map
          </h1>
          <Button href="/" classe="buttonRetourAcc">
            MENU
          </Button>
        </div>
      </header>
    </div>
  );
};

Banner.propTypes = {
  children: PropTypes.node,
};

export default Banner;
