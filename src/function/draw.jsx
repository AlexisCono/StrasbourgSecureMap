import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const drawInstance = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    polygon: true,
    trash: true,
    custom: true, // Ajoutez votre nouvelle option à la barre des contrôles
  },
});

export function initializeDraw(
  map,
  setItiZoneValues,
  jsonDataItiZone,
  setMode
) {
  map.addControl(drawInstance, "top-left");

  // Ajoutez vos propres contrôles
  const customControl = new CustomControl();
  map.addControl(customControl, "top-left");

  map.on("draw.modechange", () => {
    setMode("draw");
  });

  map.on("draw.custom", () => {
    setMode((currentMode) => (currentMode === "addIcon" ? null : "addIcon"));
  });

  if (jsonDataItiZone) {
    Object.values(jsonDataItiZone).forEach((itiZone) => {
      drawInstance.add(itiZone);
    });
    const initialDrawingsData = drawInstance.getAll();
    const initialjsonDataItiZoneSave = JSON.stringify(initialDrawingsData);
    setItiZoneValues(JSON.parse(initialjsonDataItiZoneSave));
  }

  const saveDrawings = () => {
    const drawingsData = drawInstance.getAll();
    const jsonDataItiZoneSave = JSON.stringify(drawingsData);
    setItiZoneValues(JSON.parse(jsonDataItiZoneSave));
  };

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
    customControlIcon.src = "../public/asset/object.png"; // Remplacez par le chemin de votre image
    customControlIcon.alt = ""; // Ajoutez un texte alternatif pour l'accessibilité
    customControlIcon.style.width = "24px"; // Définissez la largeur de l'image
    customControlIcon.style.height = "24px"; // Définissez la hauteur de l'image

    customControlButton.appendChild(customControlIcon);

    this._container.appendChild(customControlButton);

    // Écoutez l'événement de clic sur le bouton personnalisé
    customControlButton.addEventListener("click", () => {
      this._map.fire("draw.custom");
    });

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
