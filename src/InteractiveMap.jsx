import React, { useState } from "react";
import Map from "./components/map";
import Banner from "./Banner";
import Button from "./Button";
import "./styles/Button.css";
import Clock from "./components/Clock";

function InteractiveMap() {
  
  const [appTime, setAppTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
    // Fonction pour mettre à jour l'heure de l'application
    const handleTimeChange = (newTime) => {
      setAppTime(newTime);
    };

  return (
    <div>
      <Banner>
        <Button href="/" classe="buttonRetourAcc">
          MENU
        </Button>
        <Clock style={{ zIndex: 999 }} onTimeChange={handleTimeChange} />
      </Banner>
      <Map />
    </div>
  );
}

export default InteractiveMap;
