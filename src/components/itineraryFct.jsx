import { length, along, lineString, distance } from '@turf/turf'; // Importer seulement les fonctions nécessaires

function calculateIconSize(zoom) {
  return zoom ? 2 * Math.pow(1.2, zoom - 15) : 30; // Valeur par défaut : 30
}

export function initRoute(map, coordinates, id_route) {
  if (!map || !coordinates || !id_route) return;

  map.on('style.load', () => {
    const route = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
        }
      }]
    };

    const point = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': coordinates[0]
        }
      }]
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
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': coordinates
      }
    }]
  };

  const point = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': coordinates[0]
      }
    }]
  };
  map.getSource(id_route).setData(route);
  map.getSource('point').setData(point);
}

export function deleteLastCoordinates(map, coordinates, id_route) {
  if (!coordinates || coordinates.length === 0) return;
  coordinates.pop(); // Supprimer la dernière coordonnée du tableau
  updateRoute(map, coordinates, id_route);
}

export function startItiAnimation(map, positions) {
  if (!map || !positions || positions.length === 0) return;
  const intermediateCoordinates = addIntermediateCoordinates(positions,10);
  let index = 0; // Indice actuel dans le tableau de positions

  function animate() {
    // Vérifier si l'indice est dans la plage des positions
    if (index < intermediateCoordinates.length) {
      if (index === intermediateCoordinates.length-1) {
        const currentCoordinate = intermediateCoordinates[index];
        changeImagePosition(map, currentCoordinate);
        return
      }
      const currentCoordinate = intermediateCoordinates[index];
      const nextCoordinate = intermediateCoordinates[index + 1];

      // Calculer la distance entre les coordonnées actuelle et suivante
      const dist = distance(currentCoordinate, nextCoordinate, { units: 'kilometers' });
      // Convertir la distance en millisecondes pour déterminer le pas de temps
      const timeStep = dist * 10000; // 1 km correspond à 1 seconde

      // Changer la position de l'image en utilisant la fonction changeImagePosition
      changeImagePosition(map, currentCoordinate);
      setTimeout(() => {
        index++; // Passer à la prochaine position dans le tableau
        animate(); // Appeler récursivement la fonction animate pour passer à la position suivante
      }, timeStep);
    }
  }
  // Démarrer l'animation lorsque la fonction est appelée
  animate();
}

export function addIntermediateCoordinates(coordinates, numberOfPoints) {
  const newCoordinates = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
      const startPoint = coordinates[i];
      const endPoint = coordinates[i + 1];

      // Créer une ligne entre le point de départ et le point d'arrivée
      const line = lineString([startPoint, endPoint]);

      // Ajouter le point de départ
      newCoordinates.push(startPoint);

      // Calculer la longueur totale de la ligne
      const lineLength = length(line, { units: 'kilometers' });

      // Calculer la distance entre chaque point intermédiaire
      const stepDistance = lineLength / (numberOfPoints + 1);

      // Ajouter des points intermédiaires
      for (let j = 1; j <= numberOfPoints; j++) {
          const newPoint = along(line, j * stepDistance, { units: 'kilometers' }).geometry.coordinates;
          newCoordinates.push(newPoint);
      }
  }

  // Ajouter le dernier point
  newCoordinates.push(coordinates[coordinates.length - 1]);

  return newCoordinates;
}

export function changeImagePosition(map, newPosition) {
  if (!map || !newPosition) return;
  // Créer un objet de point avec la nouvelle position
  const newPoint = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': newPosition
      }
    }]
  };

  // Mettre à jour la source de données du point sur la carte avec la nouvelle position
  map.getSource('point').setData(newPoint);
}