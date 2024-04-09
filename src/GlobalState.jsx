import React, { createContext, useState,} from 'react';

// Créez le contexte
export const GlobalStateContext = createContext();

// Créez un composant fournisseur pour envelopper toute votre application
export const GlobalStateProvider = ({ children }) => {
  const [mapboxApiKey, setMapboxApiKey] = useState('');

  return (
    <GlobalStateContext.Provider value={{ mapboxApiKey, setMapboxApiKey }}>
      {children}
    </GlobalStateContext.Provider>
  );
};