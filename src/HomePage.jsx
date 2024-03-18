import React from "react";
import Button from "./Button"; // Importer correctement le composant Button
import Banner from "./Banner";
import "./styles/Button.css";

const HomePage = () => {

  return (
    <div>
      <Banner />
      <header className="App-header">
      <img src="./image/logoSSM.png" alt="HomePage_logoSSM" style={{ width: '20%', height: 'auto', marginTop: '-40px'}} />        
      <div className="buttonAccueil" style={{ marginTop: '85px'}}>
        <Button href="/interactive_map" classe="buttonHref">
          Nouveau projet
        </Button>
        <div style={{ width: '50px' }}></div> {/* Espace entre les boutons */}
        <Button href="/backups" classe="buttonHref"  >Projets sauvegardés</Button>
      </div>
      </header>
    </div>
  );
};

export default HomePage;
