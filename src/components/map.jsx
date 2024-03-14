import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Importer le fichier CSS
import { addIcon } from "./iconsFct.jsx";
import {
  initRoute,
  updateRoute,
  deleteLastCoordinates,
  startItiAnimation,
} from "./itineraryFct.jsx";


import { icons } from "../constants/icons";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGlzY29ubyIsImEiOiJjbHRnMHAxZHEwZHg4Mmxxd29yem96cW81In0.dm0ZihVmXRT_T7S6IHDFzg";

const Map = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [count, setCount] = useState({
    barrier: 0,
    policecar: 0,
    policeman: 0,
  });

  const [mode, setMode] = useState("itinerary");

  const mapContainer = useRef(null);
  const map = useRef(null);

  const day_style = "mapbox://styles/alexiscono/cltfzxe96009n01nr6rafgsbz";

  const [itiCoordinates, setItiCoordinates] = useState([]);
  const handleDeleteLastCoordinate = () => {
    // Appel de la fonction deleteLastCoordinates ici
    deleteLastCoordinates(map.current, itiCoordinates, "route1"); // Supposons que 'coordinates' soit votre tableau de coordonnées
  };

  const handleStartAnimation = () => {
    // Appelez la fonction startAnimation avec les paramètres nécessaires
    startItiAnimation(map.current, itiCoordinates);
  };

  useEffect(() => {
    const lng = 7.7482;
    const lat = 48.5828;
    const zoom = 15.2;

    // Création de la carte une seule fois
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: day_style,
      center: [lng, lat],
      zoom: zoom,
    });

    initRoute(map.current, itiCoordinates, "route1");

    // Ajout de la couche pour la 3D et initialisation des parcours
    // Nettoyage de la carte lors du démontage du composant
    return () => map.current.remove();
  }, [itiCoordinates]); // Effectue l'effet uniquement lors du montage initial

  useEffect(() => {
    // Ajout de l'événement de clic avec la gestion de l'icône ou du parcours
    const clickHandler = (e) => {
      if (mode === "itinerary") {
        itiCoordinates.push([e.lngLat.lng, e.lngLat.lat]);
        updateRoute(map.current, itiCoordinates, "route1");
      } else if (mode === "addIcon") {
        const iconCoordinates = e.lngLat;
        const imageUrl = `icons/${selectedIcon.path}`;
        addIcon(
          map.current,
          iconCoordinates,
          imageUrl,
          setCount,
          selectedIcon.label
        );
      }
    };

    map.current.on("click", clickHandler);

    // Retrait de l'événement de clic lors du démontage du composant
    return () => {
      map.current.off("click", clickHandler);
    };
  }, [selectedIcon, mode, count, itiCoordinates]); // Effectue l'effet lors du changement d'icône

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#7fb9f0",
      }}
    >
      {/* Liste des éléments à gauche de la carte */}
      <ul style={{ listStyle: "square", padding: 20, marginRight: "50px" }}>
        <li>
          {" "}
          {/*Boutons choix Iti / AddIcon */}
          <button
            onClick={() => setMode("itinerary")}
            style={{
              marginRight: "10px",
              padding: "5px",
              backgroundColor: mode === "itinerary" ? "lightblue" : "white",
            }}
          >
            Mode Itinéraire
          </button>
          <button
            onClick={() => setMode("addIcon")}
            style={{
              padding: "5px",
              backgroundColor: mode === "addIcon" ? "lightgreen" : "white",
            }}
          >
            Ajouter Icône
          </button>
        </li>
        <br />

        {mode === "addIcon" && (
          <div>
            {/* Choix Icones */}
            <label>Sélectionner une icône :</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              {Object.values(icons).map((icon, index) => (
                <img
                  key={index}
                  src={`icons/${icon.path}`}
                  alt={icon.label}
                  style={{
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    border:
                      selectedIcon === icon ? "2px solid #17A71B" : "none",
                  }}
                  onClick={() => setSelectedIcon(icon)}
                />
              ))}
            </div>

            {/* Nombre d'objets */}
            <p>Nombre de barrière : {count.barrier}</p>
            <p>Nombre de policecar : {count.policecar}</p>
            <p>Nombre de policeman : {count.policeman}</p>
          </div>
        )}

        {mode === "itinerary" && (
          <div>
            {/* Parcours 1 */}
            <button
              onClick={() => setMode("itinerary")}
              style={{
                marginRight: "10px",
                padding: "5px",
                backgroundColor:
                  mode === "itinerary" ? "lightgreen" : "lightgray",
              }}
            >
              Parcours de dingue
            </button>
            <button onClick={handleDeleteLastCoordinate}>
              Delete last coordinate
            </button>
            <button onClick={handleStartAnimation}>Start</button>
          </div>
        )}
      </ul>
      {/* Carte */}
      <div
        id="map-container"
        ref={mapContainer}
        style={{ width: "1625px", height: "743px" }}
      />
    </div>
  );
};

export default Map;
