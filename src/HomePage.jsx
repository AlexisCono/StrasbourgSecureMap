import React, { useState } from "react";
import Button from "./Button";
import Banner from "./Banner";
import MapboxApiKeyForm from "./MapboxApiKeyForm";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <header className="App-header">
        <img
          src="./image/Logo4.png"
          style={{ width: "18%", height: "auto", marginTop: "0.1%" }}
          alt="Logo"
        ></img>
        <div className="buttonAccueil" style={{ marginTop: "1.2%"}}>
          <Button href="/interactiveMap" classe="buttonHref">
            Commencer un projet
          </Button>
          
        </div>
  <MapboxApiKeyForm />
      </header>
    </div>
  );
};

export default HomePage;
