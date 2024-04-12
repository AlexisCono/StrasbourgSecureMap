import React, { createContext, useState } from "react";
import PropType from "prop-types";

// Créez le contexte
export const GlobalStateContext = createContext();

// Créez un composant fournisseur pour envelopper toute votre application
export const GlobalStateProvider = ({ children }) => {
  const [mapboxApiKey, setMapboxApiKey] = useState("");

  return (
    <GlobalStateContext.Provider value={{ mapboxApiKey, setMapboxApiKey }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

GlobalStateProvider.propTypes = {
  children: PropType.node.isRequired,
};
