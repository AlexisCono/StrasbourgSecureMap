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

export function initializeDraw(map, setItiZoneValues, jsonDataItiZone) {
  map.addControl(drawInstance, "top-left");

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
