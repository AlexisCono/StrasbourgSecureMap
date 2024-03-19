import React, { useState } from "react";
import Map from "./components/map";
import Banner from "./Banner";
import Clock from "./components/Clock";
import "./styles/Clock.css";
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
        
        <div style={{marginLeft:"1%"}}>
        <Clock style={{ zIndex: 999}} onTimeChange={handleTimeChange} />
        </div>
      </Banner>
      
      <Map />
    </div>
  );
}

export default InteractiveMap;
