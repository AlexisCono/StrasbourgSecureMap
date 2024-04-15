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

export function initializeDraw(map, setItiZoneValues) {
  map.addControl(drawInstance, "top-left");

  const saveDrawings = () => {
    const drawingsData = drawInstance.getAll();
    const geojsonDataItiZone = JSON.stringify(drawingsData);
    setItiZoneValues(JSON.parse(geojsonDataItiZone)); // Met à jour l'état avec les données dessinées
  };

  // Écoutez l'événement de modification pour détecter les changements dans les dessins
  map.on("draw.create", saveDrawings);
  map.on("draw.update", saveDrawings);
  map.on("draw.delete", saveDrawings);
}

// Fonction pour sauvegarder les dessins dans un fichier JSON
export function saveDrawings(drawingsJSON) {
  const drawingsData = drawInstance.getAll();
  drawingsJSON = JSON.stringify(drawingsData);

  // Vous pouvez utiliser ici une méthode appropriée pour enregistrer les données JSON, par exemple en utilisant le stockage local du navigateur ou en les envoyant à un serveur.
  // Dans cet exemple, je vais simplement afficher les données dans la console.
  console.log(drawingsJSON);
}
