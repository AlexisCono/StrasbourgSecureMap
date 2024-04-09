import React, { useState } from 'react';
import { useMapboxApiKey } from './useMapboxApiKey';

const MapboxApiKeyForm = () => {
  const [newApiKey, setNewApiKey] = useState('');
  const mapboxApiKey = useMapboxApiKey();

  const handleInputChange = (event) => {
    setNewApiKey(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Mettre à jour la clé Mapbox avec la nouvelle valeur
    // (vous pouvez implémenter la logique pour sauvegarder dans une API, localStorage, etc.)
    console.log('Nouvelle clé Mapbox :', newApiKey);
  };

  return (
    <div>
      <h2>Modifier la clé Mapbox</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="newApiKey">Nouvelle clé :</label>
        <input
          type="text"
          id="newApiKey"
          value={newApiKey}
          onChange={handleInputChange}
        />
        <button type="submit">Enregistrer</button>
      </form>
      <p>Clé actuelle : {mapboxApiKey}</p>
    </div>
  );
};

export default MapboxApiKeyForm;
