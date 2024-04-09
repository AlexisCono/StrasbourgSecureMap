import MapboxDraw from "@mapbox/mapbox-gl-draw";

export function initializeDrawZone(map) {
  const drawInstance = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
    defaultMode: "draw_polygon",
    styles: [
      // Définir un style personnalisé pour les contrôles
      // Ici, nous utilisons une couleur verte pour les contrôles
      {
        id: "gl-draw-polygon-fill-inactive",
        type: "fill",
        filter: ["==", "active", "false"],
        paint: {
          "fill-color": "#513ecf", // couleur verte
          "fill-outline-color": "#513ecf", // couleur verte
          "fill-opacity": 0.35, // opacité
        },
      },
      {
        id: "gl-draw-polygon-midpoint",
        type: "circle",
        filter: ["==", "meta", "midpoint"],
        paint: {
          "circle-radius": 3,
          "circle-color": "#513ecf", // couleur verte
        },
      },
      {
        id: "gl-draw-polygon-active",
        type: "fill",
        filter: ["==", "active", "true"],
        paint: {
          "fill-color": "#513ecf", // couleur verte
          "fill-outline-color": "#513ecf", // couleur verte
          "fill-opacity": 0.35, // opacité
        },
      },
      {
        id: "gl-draw-polygon-and-line-vertex-inactive",
        type: "circle",
        filter: [
          "all",
          ["==", "meta", "vertex"],
          ["==", "$type", "Point"],
          ["!=", "mode", "static"],
        ],
        paint: {
          "circle-radius": 3,
          "circle-color": "#513ecf", // couleur verte
        },
      },
      {
        id: "gl-draw-polygon-and-line-vertex-active",
        type: "circle",
        filter: [
          "all",
          ["==", "meta", "vertex"],
          ["==", "$type", "Point"],
          ["==", "active", "true"],
        ],
        paint: {
          "circle-radius": 6,
          "circle-color": "#513ecf", // couleur verte
        },
      },
      {
        id: "gl-draw-line-inactive",
        type: "line",
        filter: [
          "all",
          ["==", "$type", "LineString"],
          ["==", "active", "false"],
        ],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#513ecf", // couleur verte
          "line-width": 4,
        },
      },
      {
        id: "gl-draw-line-active",
        type: "line",
        filter: [
          "all",
          ["==", "$type", "LineString"],
          ["==", "active", "true"],
        ],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#513ecf", // couleur verte
          "line-dasharray": [0.2, 2],
          "line-width": 4,
        },
      },
    ],
  });
  if (!map.getSource("mapbox-gl-draw-cold")) {
    map.addControl(drawInstance);
  }
}
