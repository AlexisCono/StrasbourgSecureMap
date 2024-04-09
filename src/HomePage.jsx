import React, { useState } from "react";
import Button from "./Button"; // Assurez-vous d'importer correctement le composant Button
import Banner from "./Banner";
import "./styles/Button.css";
import MapboxApiKeyForm from "./MapboxApiKeyForm";

const HomePage = () => {

  return (
    <div>
      <Banner />
      <header className="App-header">
        <img src="./image/Logo4.png"  style={{width: '25%', height: 'auto', marginTop: '-3%'}}></img>       
        <div className="buttonAccueil" style={{ marginTop: '3%'}}>
          <Button href="/interactive_map" classe="buttonHref">
            Nouveau projet
          </Button>
          <div style={{ width: '50px' }}></div> {/* Espace entre les boutons */}
          <Button href="/backups" classe="buttonHref"  >Projets sauvegardés</Button>
        </div>
      </header>
      <MapboxApiKeyForm />
    </div>
  );
};

export default HomePage;

