import React from "react";
import Button from "./components/Button";
import Banner from "./components/Banner";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <header className="App-header">
        <img
          src="./image/Logo4.png"
          style={{ width: "18%", height: "auto", marginTop: "1%" }}
          alt="Logo"
        ></img>
        <div className="buttonAccueil" style={{ marginTop: "1%" }}>
          <Button href="/interactiveMap" classe="buttonHref">
            Accéder à un projet
          </Button>
          <div style={{ width: "50px" }}></div>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
