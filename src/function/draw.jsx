import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const drawInstance = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    polygon: true,
    trash: true,
  },
});

export function initializeDraw(map, setItiZoneValues, jsonDataItiZone, setMode) {
  map.addControl(drawInstance, "top-left");

  // Ajoutez vos propres contrôles
  const customControl = new CustomControl();
  map.addControl(customControl, "top-left");

  // Écoutez l'événement de clic sur le bouton "line_string" de MapboxDraw
  document.querySelector(".mapbox-gl-draw_line").addEventListener("click", () => {
    setMode("line");
  });

  // Écoutez l'événement de clic sur le bouton "polygon" de MapboxDraw
  document.querySelector(".mapbox-gl-draw_polygon").addEventListener("click", () => {
    setMode("zone");
  });

  // Écoutez l'événement de clic sur le bouton "trash" de MapboxDraw
  document.querySelector(".mapbox-gl-draw_trash").addEventListener("click", () => {
    setMode(null);
  });

  // Écoutez l'événement de clic sur le bouton "custom"
  document.querySelector(".custom-icon").addEventListener("click", () => {
    setMode("addIcon");
  });

  if (jsonDataItiZone) {
    Object.values(jsonDataItiZone).forEach((itiZone) => {
      drawInstance.add(itiZone); // Ajoutez les données dessinées à la carte
    });
    const initialDrawingsData = drawInstance.getAll();
    const initialjsonDataItiZoneSave = JSON.stringify(initialDrawingsData);
    setItiZoneValues(JSON.parse(initialjsonDataItiZoneSave)); // Met à jour l'état avec les données dessinées
  }

  const saveDrawings = () => {
    const drawingsData = drawInstance.getAll();
    const jsonDataItiZoneSave = JSON.stringify(drawingsData);
    setItiZoneValues(JSON.parse(jsonDataItiZoneSave)); // Met à jour l'état avec les données dessinées
  };

  // Écoutez l'événement de modification pour détecter les changements dans les dessins
  map.on("draw.create", saveDrawings);
  map.on("draw.update", saveDrawings);
  map.on("draw.delete", saveDrawings);
  
}

class CustomControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    const customControlButton = document.createElement("button");
    customControlButton.className = "mapboxgl-ctrl-icon custom-icon";

    const customControlIcon = document.createElement("img");
    customControlIcon.src = "../public/image/object.png"; // Remplacez par le chemin de votre image
    customControlIcon.alt = "Icône personnalisée"; // Ajoutez un texte alternatif pour l'accessibilité
    customControlIcon.style.width = "24px"; // Définissez la largeur de l'image
    customControlIcon.style.height = "24px"; // Définissez la hauteur de l'image

    customControlButton.appendChild(customControlIcon);

    this._container.appendChild(customControlButton);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}