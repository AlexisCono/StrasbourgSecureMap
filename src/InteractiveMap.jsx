import React from "react";
import Map from "./components/map";
import Banner from "./Banner";
import Button from "./Button";
import TimePicker from "./components/TimePicker";
import "./styles/Button.css";

function InteractiveMap() {
  return (
    <div>
      <Banner>
        <Button href="/" classe="buttonRetourAcc">
          Accueil
        </Button>
      </Banner>
      <TimePicker/>
      <Map />
    </div>
  );
}

export default InteractiveMap;
