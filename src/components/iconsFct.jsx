import mapboxgl from "mapbox-gl";
import "../styles/Popup.css";
let markerCoordinatesArray = [];
// Structure de données pour stocker les informations sur les marqueurs
const markerData = [];


export function addIcon(map, coordinates, imageUrl, setCount, label) {
  const el = document.createElement("div");
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

  el.className = "marker";
  el.style.backgroundImage = `url(${imageUrl})`; // Utilisation de l'URL de l'image importée
  el.style.width = size + "px"; // Taille initiale du marqueur
  el.style.height = size + "px";
  el.style.backgroundSize = "cover";
  el.style.borderRadius = "100%";
  el.style.cursor = "pointer";

  const popupContent = `
    <div class="popup-content">
      <h3>${label}</h3>
      <label for="quantite">Quantité :</label>
      <input type="number" id="quantite" name="quantite"><br><br>
      <label for="heurePose">Heure de pose :</label>
      <input type="time" id="heurePose" name="heurePose"><br><br>
      <label for="heureDepose">Heure de dépose :</label>
      <input type="time" id="heureDepose" name="heureDepose"><br><br>
      <button id="deleteButton">Supprimer</button>
    </div>
`;

  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

  const marker = new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  // Gestion de la suppression de l'icône associé
  popup.on("open", () => {
    const quantiteInput = document.getElementById("quantite");
    const heurePoseInput = document.getElementById("heurePose");
    const heureDeposeInput = document.getElementById("heureDepose");

    document.getElementById("deleteButton").addEventListener("click", () => {
      marker.remove(); // Supprimer l'icône
      const index = markerCoordinatesArray.findIndex(
        (coords) => coords === newMarkerCoordinates
      );
      if (index !== -1) {
        markerCoordinatesArray.splice(index, 1); // Supprimer les coordonnées du tableau
      }
      popup.remove(); // Supprimer le popup
      decreaseCount(setCount, label);
    });

    popup.on("close", () => {
      const quantity = quantiteInput.value;
      const heurePose = heurePoseInput.value;
      const heureDepose = heureDeposeInput.value;

      // Enregistrer les informations du marqueur dans la structure de données
      const markerInfo = {
        coordinates: coordinates,
        imageUrl: imageUrl,
        type: label,
        quantite: quantity,
        heurePose: heurePose,
        heureDepose: heureDepose,
        popup: popup,
        // Vous pouvez également ajouter ici les heures de pose et de dépose si elles sont dynamiques
      };
      console.log("New marker added:", markerInfo);

      markerData.push(markerInfo);
    });
  });

  map.on("zoom", () => {
    const zoom = map.getZoom();
    const newSize = 30 * Math.pow(1.2, zoom - 15); // Ajustez le facteur de zoom selon votre préférence
    el.style.width = newSize + "px";
    el.style.height = newSize + "px";
  });

  incrementCount(setCount, label);
  markerCoordinatesArray.push(newMarkerCoordinates);
}


export function getMarkerInfo(coordinates) {
  return markerData.find((marker) => marker.coordinates === coordinates);
}

function compareTime(time1, time2) {
  const [hour1, minute1] = time1.split(':').map(Number);
  const [hour2, minute2] = time2.split(':').map(Number);

  // Comparaison des heures
  if (hour1 < hour2) {
      return -1;
  } else if (hour1 > hour2) {
      return 1;
  } else {
      // Si les heures sont égales, comparer les minutes
      if (minute1 < minute2) {
          return -1;
      } else if (minute1 > minute2) {
          return 1;
      } else {
          return 0; // Les heures et les minutes sont égales
      }
  }
}

export function filterMarkersByTime(appTime) {
  markerData.forEach(marker => {
      const heurePose = marker.heurePose;
      const heureDepose = marker.heureDepose;

      // Comparez les heures avec la fonction compareTime
      if (compareTime(heurePose, appTime) <= 0 && compareTime(appTime, heureDepose) <= 0) {
          marker.popup.setLngLat(marker.coordinates); // Replacez le popup à sa position d'origine
      } else {
          marker.popup.setLngLat([0, 0]); // Déplacez le popup hors de la vue de l'utilisateur
      }
  });
}

export function incrementCount(setCount, type) {
  setCount((prevCount) => ({
    ...prevCount,
    [type]: prevCount[type] + 1,
  }));
}

export function decreaseCount(setCount, type) {
  setCount((prevCount) => ({
    ...prevCount,
    [type]: prevCount[type] - 1,
  }));
}
