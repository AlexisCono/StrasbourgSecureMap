import React, { useState } from "react";
import MapComponent from "./components/MapComponent.jsx";
import Banner from "./components/Banner";

function InteractiveMap() {
  return (
    <div>
      <Banner />
      <MapComponent />
    </div>
  );
}

export default InteractiveMap;
