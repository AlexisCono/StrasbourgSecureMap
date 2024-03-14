import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Importer le fichier CSS
import { addIcon } from "./iconsFct.jsx";
import { initRoute, updateRoute } from "./itineraryFct.jsx";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGlzY29ubyIsImEiOiJjbHRnMHAxZHEwZHg4Mmxxd29yem96cW81In0.dm0ZihVmXRT_T7S6IHDFzg";

const Map = () => {
  const [selectedIcon, setSelectedIcon] = useState("barrier");
  const [count, setCount] = useState({
    barrier: 0,
    policecar: 0,
    policeman: 0,
  });

  const [mode, setMode] = useState("addIcon");
  const [modeIti, setModeIti] = useState("iti1");

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [mapStyle, setMapStyle] = useState("day");
  const night_style = 'mapbox://styles/alexiscono/cltfzty8400rs01qn8k0w4hoo'
  const day_style = 'mapbox://styles/alexiscono/cltfzxe96009n01nr6rafgsbz'


  const [lineColor1, setLineColor1] = useState("#17A71B");
  const [lineColor2, setLineColor2] = useState("#0051FF");

  const [itiCoordinates1, setItiCoordinates1] = useState([]);
  const [itiCoordinates2, setItiCoordinates2] = useState([]);

  const handleLineColorChange = (event, nbr) => {
    if (nbr == 1) setLineColor1(event.target.value);
    else if (nbr == 2) setLineColor2(event.target.value);
  };

  const toggleMapStyle = () => {
    setMapStyle((prevStyle) => (prevStyle === "day" ? "night" : "day"));
    console.log(mapStyle)
    //il faudrait également réinitiliaser tous les icones
  };
  

  const handleRemoveLastCoordinate = (nbr) => {
    if (nbr == 1) { 
      itiCoordinates1.pop();
      updateRoute(map, itiCoordinates1, lineColor1, "route1");
    } else if (nbr == 2) {
      itiCoordinates2.pop();
      updateRoute(map, itiCoordinates2, lineColor2, "route2");
    }
  };

  useEffect(() => {
    const lng = 7.7482;
    const lat = 48.5828;
    const zoom = 15.2;

    // Création de la carte une seule fois
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === "day" ? day_style : night_style,
      center: [lng, lat],
      zoom: zoom,
    });

    // Ajout de la couche pour la 3D et initialisation des parcours
    map.current.on("load", () => {
      initRoute(map, itiCoordinates1, "route1");
      initRoute(map, itiCoordinates2, "route2");
    });

    // Nettoyage de la carte lors du démontage du composant
    return () => map.current.remove();
  }, [itiCoordinates1, itiCoordinates2,mapStyle]); // Effectue l'effet uniquement lors du montage initial

  useEffect(() => {
    // Ajout de l'événement de clic avec la gestion de l'icône ou du parcours
    const clickHandler = (e) => {
      if (mode === "itinerary") {
        if (modeIti == "iti1") {
          itiCoordinates1.push([e.lngLat.lng, e.lngLat.lat]);
          updateRoute(map, itiCoordinates1, lineColor1, "route1");
        } else if (modeIti == "iti2") {
          itiCoordinates2.push([e.lngLat.lng, e.lngLat.lat]);
          updateRoute(map, itiCoordinates2, lineColor2, "route2");
        }
      } else if (mode === "addIcon") {
        const iconCoordinates = e.lngLat;
        const imageUrl = `./image/${selectedIcon}.png`;
        addIcon(
          map.current,
          iconCoordinates,
          imageUrl,
          setCount,
          selectedIcon
        );
      }
    };

    map.current.on("click", clickHandler);

    // Retrait de l'événement de clic lors du démontage du composant
    return () => {
      map.current.off("click", clickHandler);
    };
  }, [
    selectedIcon,
    mode,
    count,
    lineColor1,
    itiCoordinates1,
    lineColor2,
    itiCoordinates2,
    modeIti,
  ]); // Effectue l'effet lors du changement d'icône

  const iconImages = ["policeman", "policecar", "barrier"];

  return (
    <div style={{ display: "flex", flexDirection: "row",backgroundColor:'#7fb9f0' }}>
      {/* Liste des éléments à gauche de la carte */}
      <ul style={{ listStyle: "square", padding: 20, marginRight: "50px" }}>
        <li>
          {" "}
          {/*Boutons choix Iti / AddIcon */}
          <button
            onClick={() => setMode("itinerary")}
            style={{
              marginRight: "10px",
              padding: "5px",
              backgroundColor: mode === "itinerary" ? "lightblue" : "white",
            }}
          >
            Mode Itinéraire
          </button>
          <button
            onClick={() => setMode("addIcon")}
            style={{
              padding: "5px",
              backgroundColor: mode === "addIcon" ? "lightgreen" : "white",
            }}
          >
            Ajouter Icône
          </button>
        </li>
        <br />

        {mode === "addIcon" && (
          <div>
            {/* Choix Icones */}
            <label>Sélectionner une icône :</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              {iconImages.map((icon) => (
                <img
                  key={icon}
                  src={`image/${icon}.png`}
                  alt={icon}
                  style={{
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    border:
                      selectedIcon === icon ? "2px solid #17A71B" : "none",
                  }}
                  onClick={() => setSelectedIcon(icon)}
                />
              ))}
            </div>

            {/* Nombre d'objets */}
            <p>Nombre de barrière : {count.barrier}</p>
            <p>Nombre de policecar : {count.policecar}</p>
            <p>Nombre de policeman : {count.policeman}</p>
          </div>
        )}

        {mode === "itinerary" && (
          <div>
            {/* Parcours 1 */}
            <button
              onClick={() => setModeIti("iti1")}
              style={{
                marginRight: "10px",
                padding: "5px",
                backgroundColor:
                  modeIti === "iti1" ? "lightgreen" : "lightgray",
              }}
            >
              Parcours 1
            </button>
            <br />
            <label htmlFor="lineColor1" />
            <input
              type="color"
              id="lineColor1"
              value={lineColor1}
              onChange={handleLineColorChange}
            />
            <button onClick={() => handleRemoveLastCoordinate(1)}>
              <img
                src={`./public/image/return.png`}
                alt="return"
                style={{ width: "30px", height: "18px", cursor: "pointer" }}
              />
            </button>
            <br />
            <br />
            {/* Parcous 2 */}
            <button
              onClick={() => setModeIti("iti2")}
              style={{
                padding: "5px",
                backgroundColor:
                  modeIti === "iti2" ? "lightgreen" : "lightgray",
              }}
            >
              Parcours 2
            </button>
            <br />
            <label htmlFor="lineColor2" />
            <input
              type="color"
              id="lineColor2"
              value={lineColor2}
              onChange={handleLineColorChange}
            />
            <button onClick={() => handleRemoveLastCoordinate(2)}>
              <img
                src={`./public/image/return.png`}
                alt="return"
                style={{ width: "30px", height: "18px", cursor: "pointer" }}
              />
            </button>
          </div>
        )}
        <br/><br/><br/>
        <button
        onClick={toggleMapStyle}
        style={{
          backgroundColor: mapStyle === "day" ? "#333333" : "#ffffff",
          color: mapStyle === "day" ?  "#ffffff" : "#333333",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {mapStyle === "day" ? "Mode Nuit" : "Mode Jour"}
        </button>

      </ul>
      {/* Carte */}
      <div
        id="map-container"
        ref={mapContainer}
        style={{ width: "1625px", height: "743px" }}
      >
      </div>
      
    </div>
  );
};

export default Map;
