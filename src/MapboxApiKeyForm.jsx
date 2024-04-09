import React, { useState, useEffect } from 'react';

const MapboxApiKeyForm = () => {
  const [newApiKey, setNewApiKey] = useState('');
  const [mapboxApiKey, setMapboxApiKey] = useState('');

  // Au chargement du composant, récupérer la valeur de mapboxApiKey depuis localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('mapboxApiKey');
    if (storedApiKey) {
      setMapboxApiKey(storedApiKey);
    }
  }, []);

  const handleInputChange = (event) => {
    setNewApiKey(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Mettre à jour la clé Mapbox avec la nouvelle valeur dans localStorage
    localStorage.setItem('mapboxApiKey', newApiKey);
    setMapboxApiKey(newApiKey);
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
