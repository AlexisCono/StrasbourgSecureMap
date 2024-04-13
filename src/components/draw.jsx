import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const drawInstance = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string : true,
    polygon:true,
    trash: true,
  },
});

export function initializeDraw(map) {
    map.addControl(drawInstance,'top-left');
  
}