import MapboxDraw from '@mapbox/mapbox-gl-draw';

export function initializeDrawZone(map) {
    const drawInstance = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });
    map.addControl(drawInstance);
}