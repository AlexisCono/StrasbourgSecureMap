import React from "react";
import "./styles/App.css";
import PropTypes from "prop-types";

const Banner = ({ children }) => {
  return (
    <div>
      <header className="banner">
        <div className="bannerTitle">
          <div>{children}</div>
          <h1 id="title" style={{ textAlign: "center", margin: "0 auto" }}>Strasbourg Secure Map</h1>
        </div>
      </header>
    </div>
  );
};

Banner.propTypes = {
  children: PropTypes.node,
};

export default Banner;
