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
    
      <form class="form" onSubmit={handleSubmit}>
      <div class="title">Pour utiliser Strasbourg Secure Map,<br/> <span>une clé "MapBox" est nécessaire</span></div>
        <label htmlFor="newApiKey"></label>
        <input
         class="input" name="text"  type="text"
          id="newApiKey"
          placeholder="Veuillez entrer une nouvelle clé MapBox..."  
          value={newApiKey}
          style={{color:'#00114d'}}
          onChange={handleInputChange}
        />
            
       <button class="button-confirm" type="submit">Enregistrer</button>
        <div style={{color: '#FFFF', fontSize:'80%', fontFamily: 'Consolas,monaco,monospace'}}> <p>Clé actuelle : {mapboxApiKey}</p>
        </div>
        </form>
      
  );
};

export default MapboxApiKeyForm;
