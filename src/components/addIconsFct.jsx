import mapboxgl from "mapbox-gl";
import "../styles/popUp.css";
import PopUp from "./PopUpComponent";
import { createRoot } from "react-dom/client";

let markerCoordinatesArray = [];

export function addIcon(
  map,
  coordinates,
  selectedIcon,
  onSubmit,
  deleteIconValues,
  jsonDataIcon
) {
  const el = document.createElement("div");
  const zoom = map.getZoom();
  const size = 30 * Math.pow(1.2, zoom - 15);
  let iconDistanceThreshold = 40; // Seuil de distance initial en pixels

  const coordKey = `${coordinates.lat} ${coordinates.lng}`;

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

  el.className = "marker";
  el.style.backgroundImage = `url(icons/${selectedIcon.path})`; // Utilisation de l'URL de l'image importée
  el.style.width = size + "px"; // Taille initiale du marqueur
  el.style.height = size + "px";
  el.style.backgroundSize = "cover";
  el.style.borderRadius = "100%";
  el.style.cursor = "pointer";

  const popupContent = document.createElement("div");

  createRoot(popupContent).render(
    <PopUp
      icon={selectedIcon}
      onSubmit={onSubmit}
      coordKey={coordKey}
      jsonDataIcon={jsonDataIcon}
    />
  );

  const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);

  const marker = new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  // Gestion de la suppression de l'icône associé
  popup.on("open", () => {
    document.getElementById("deleteButton").addEventListener("click", () => {
      marker.remove(); // Supprimer l'icône
      const index = markerCoordinatesArray.findIndex(
        (coords) => coords === newMarkerCoordinates
      );
      if (index !== -1) {
        markerCoordinatesArray.splice(index, 1); // Supprimer les coordonnées du tableau
      }
      popup.remove(); // Supprimer le popup
      deleteIconValues(coordKey); // Supprimer les valeurs de l'icône du tableau
    });
  });

  map.on("zoom", () => {
    const zoom = map.getZoom();
    const newSize = 30 * Math.pow(1.2, zoom - 15); // Ajustez le facteur de zoom selon votre préférence
    el.style.width = newSize + "px";
    el.style.height = newSize + "px";
  });

  markerCoordinatesArray.push(newMarkerCoordinates);
}
