import { length, along, lineString, distance } from "@turf/turf"; // Importer seulement les fonctions nécessaires

function calculateIconSize(zoom) {
  return zoom ? 2 * Math.pow(1.2, zoom - 15) : 30; // Valeur par défaut : 30
}

export function initRoute(map, coordinates, id_route, color) {
  if (!map || !coordinates || !id_route) return;

  map.on("style.load", () => {
    const route = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      ],
    };

    const zoom = map.getZoom();
    const size = calculateIconSize(zoom);

    map.addSource(id_route, {
      type: "geojson",
      data: route,
    });

    map.addLayer({
      id: id_route,
      source: id_route,
      type: "line",
      paint: {
        "line-width": 8,
        "line-color": color,
      },
    });
  });
}

export function updateRoute(map, coordinates, id_route) {
  if (!map || !coordinates || !id_route) return;
  const route = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      },
    ],
  };

  map.getSource(id_route).setData(route);
}

export function deleteLastCoordinates(map, coordinates, id_route) {
  if (!coordinates || coordinates.length === 0) return;
  coordinates.pop(); // Supprimer la dernière coordonnée du tableau
  updateRoute(map, coordinates, id_route);
}
