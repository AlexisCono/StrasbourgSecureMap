import React, { createContext, useState } from "react";
import PropType from "prop-types";

// Créez le contexte
export const MapboxKeyContext = createContext();

// Créez un composant fournisseur pour envelopper toute votre application
export const MapboxKeyProvider = ({ children }) => {
  const [mapboxApiKey, setMapboxApiKey] = useState("");

  return (
    <MapboxKeyContext.Provider value={{ mapboxApiKey, setMapboxApiKey }}>
      {children}
    </MapboxKeyContext.Provider>
  );
};

MapboxKeyProvider.propTypes = {
  children: PropType.node.isRequired,
};
