import React from "react";
import "./styles/App.css";
import PropTypes from "prop-types";

const Banner = ({ children }) => {
  return (
    <div>
      <header className="banner">
        <div className="bannerTitle">
          <img
            src="../public/image/logo_tous.png"
            alt="logo_SSM_TPS_strasbourg"
            className="logo"
          />
          <div>{children}</div>
          <h1 id="title">Strasbourg Secure Map</h1>
        </div>
      </header>
    </div>
  );
};

Banner.propTypes = {
  children: PropTypes.node,
};

export default Banner;
