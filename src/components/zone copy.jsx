export function initZone(map, coordinates, zoneId) {
    if (!map || !coordinates || !zoneId) return;
  
    map.on('style.load', () => {
      const zone = {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [coordinates] // Une seule ligne est suffisante pour définir une zone fermée
        }
      };

      map.addSource(zoneId, {
        'type': 'geojson',
        'data': zone
      });
  
      map.addLayer({
        'id': zoneId,
        'source': zoneId,
        'type': 'fill',
        'paint': {
          'fill-color': '#FF0000',
          'fill-opacity': 0.5
        }
      });
    });
  }
  
export function updateZone(map, coordinates, zoneId) {
    if (!map || !coordinates || !zoneId) return;

    const zone = {
        'type': 'Feature',
        'geometry': {
        'type': 'Polygon',
        'coordinates': [coordinates] // Une seule ligne est suffisante pour définir une zone fermée
        }
    };
    map.getSource(zoneId).setData(zone);
}
