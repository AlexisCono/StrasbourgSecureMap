import mapboxgl from "mapbox-gl";
import "../styles/Popup.css";
import React from "react";

import ReactDOM from "react-dom";
import Popup from "./Popup";

let markerCoordinatesArray = [];
// Structure de données pour stocker les informations sur les marqueurs

export function addIcon(map, coordinates, selectedIcon, popUpRef) {
  const zoom = map.getZoom();
  const size = 30 * Math.pow(1.2, zoom - 15);
  let iconDistanceThreshold = 40; // Seuil de distance initial en pixels

  const newMarkerCoordinates = map.project(coordinates); // Convertir les nouvelles coordonnées en coordonnées de la carte

  // Vérifier la distance entre les nouvelles coordonnées et les coordonnées des icônes existants
  for (const markerCoordinates of markerCoordinatesArray) {
    const distance = Math.sqrt(
      Math.pow(markerCoordinates.x - newMarkerCoordinates.x, 2) +
        Math.pow(markerCoordinates.y - newMarkerCoordinates.y, 2)
    );

    if (distance < iconDistanceThreshold) {
      // Si la distance est inférieure au seuil, ne pas ajouter le nouvel icône
      console.log("L'icône est trop proche d'un autre icône existant.");
      return;
    }
  }

  // Création de l'icône
  const popUpNode = document.createElement("div");
  popUpNode.className = "marker";
  popUpNode.style.backgroundImage = `url(icons/${selectedIcon.path})`; // Utilisation de l'URL de l'image importée
  popUpNode.style.width = size + "px"; // Taille initiale du marqueur
  popUpNode.style.height = size + "px";
  popUpNode.style.backgroundSize = "cover";
  popUpNode.style.borderRadius = "100%";
  popUpNode.style.cursor = "pointer";

  // Fonction de gestion de l'événement de clic
  const handleClick = () => {
    ReactDOM.createRoot(popUpNode).render(
      <Popup label={selectedIcon.label} />,
      popUpNode
    );
    popUpRef.current.setLngLat(coordinates).setDOMContent(popUpNode).addTo(map);
  };

  // Ajout de l'icône à la carte
  const markerElement = new mapboxgl.Marker({ element: popUpNode })
    .setLngLat(coordinates)
    .addTo(map);

  // Attacher l'événement de clic à l'icône
  markerElement.getElement().addEventListener("click", handleClick);
}

export function incrementCount(setCount, label) {
  setCount((prevCount) =>
    prevCount.map((iconCount) => {
      if (iconCount.label === label) {
        return {
          ...iconCount,
          countIcons: iconCount.countIcons + 1,
        };
      }
      return iconCount;
    })
  );
}

export function decreaseCount(setCount, label) {
  setCount((prevCount) =>
    prevCount.map((iconCount) => {
      if (iconCount.label === label && iconCount.countIcons > 0) {
        return { ...iconCount, countIcons: iconCount.countIcons - 1 };
      }
      return iconCount;
    })
  );
}
