import React from "react";
import Map from "./components/map";
import Banner from "./Banner";
import Button from "./Button";
import "./styles/Button.css";

function InteractiveMap() {
  return (
    <div>
      <Banner>
        <Button href="/" classe="buttonRetourAcc" >
          MENU
        </Button>
      </Banner>
      <Map />
    </div>
  );
}

export default InteractiveMap;
