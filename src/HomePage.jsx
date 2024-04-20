import React from "react";
import Button from "./components/Button";
import MapboxApiKeyForm from './components/MapboxApiKeyForm.jsx'

const HomePage = () => {
  return (
    <div>
      <header className="App-header">
        <img
          src="./image/Logo4.png"
          style={{ width: "18%", height: "auto", marginTop: "0.1%" }}
          alt="Logo"
        ></img>
        <div className="buttonAccueil" style={{ marginTop: "1.2%"}}>
          <Button href="/interactiveMap" classe="buttonHref">
            Accéder à un projet
          </Button>
          
        </div>
  <MapboxApiKeyForm />
      </header>
    </div>
  );
};

export default HomePage;
