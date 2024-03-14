function calculateIconSize(zoom) {
  return zoom ? 2*Math.pow(1.2, zoom - 15) : 30; // Valeur par défaut : 30
}

export function initRoute(map, coordinates, id_route) {
  if (!map || !coordinates || !id_route) return;

  map.on('style.load', () => {
    const route = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates
          }
        }
      ]
    };

    const point = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': coordinates[0]
          }
        }
      ]
    };

    const zoom = map.getZoom();
    const size = calculateIconSize(zoom);

    map.loadImage(
      './public/image/running.png',
      (error, image) => {
        if (error) throw error;
        map.addImage('running', image);
      }
    );

    map.addSource(id_route, {
      'type': 'geojson',
      'data': route
    });

    map.addSource('point', {
      'type': 'geojson',
      'data': point
    });

    map.addLayer({
      'id': id_route,
      'source': id_route,
      'type': 'line',
      'paint': {
        'line-width': 8,
        'line-color': '#7A24B6',
      }
    });

    map.addLayer({
      'id': 'point',
      'source': 'point',
      'type': 'symbol',
      'layout': {
        'icon-image': 'running',
        'icon-size': size / 30, // Normalise la taille de l'icône entre 0 et 1
        'icon-rotate': ['get', 'bearing'],
        'icon-rotation-alignment': 'map',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      }
    });

    // Mettre à jour la taille de l'icône lors du changement de zoom
    map.on('zoom', () => {
      const newZoom = map.getZoom();
      const newSize = calculateIconSize(newZoom);
      map.setLayoutProperty('point', 'icon-size', newSize / 30);
    });
  });
}

export function updateRoute(map, coordinates, id_route) {
  if (!map || !coordinates || !id_route) return;

  const route = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
        }
      }
    ]
  };

  const point = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': coordinates[coordinates.length - 1]
        }
      }
    ]
  };

  map.getSource(id_route).setData(route);
  map.getSource('point').setData(point);
}

export function deleteLastCoordinates(map,coordinates,id_route) {
  if (!coordinates || coordinates.length === 0) return;
  coordinates.pop(); // Supprimer la dernière coordonnée du tableau
  updateRoute(map,coordinates,id_route)
}
