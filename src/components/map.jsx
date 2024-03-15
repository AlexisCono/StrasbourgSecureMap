import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Importer le fichier CSS
import { addIcon } from "./iconsFct.jsx";
import { initRoute, updateRoute } from "./itineraryFct.jsx";
import "../styles/Button.css";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { icons } from "../constants/icons.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGlzY29ubyIsImEiOiJjbHRnMHAxZHEwZHg4Mmxxd29yem96cW81In0.dm0ZihVmXRT_T7S6IHDFzg";

const Map = () => {
  const [selectedIcon, setSelectedIcon] = useState(undefined);

  const initialCountState = Object.fromEntries(
    Object.values(icons).map((icon, index) => [index, 0])
  );

  const [count, setCount] = useState({ initialCountState });

  const [mode, setMode] = useState("addIcon");
  const [modeIti, setModeIti] = useState("iti1");

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [mapStyle, setMapStyle] = useState("night");
  const night_style = "mapbox://styles/alexiscono/cltfzty8400rs01qn8k0w4hoo";
  const day_style = "mapbox://styles/alexiscono/cltfzxe96009n01nr6rafgsbz";
  const [nightMode, setNightMode] = useState(false);

  const [lineColor1, setLineColor1] = useState("#17A71B");
  const [lineColor2, setLineColor2] = useState("#0051FF");

  const [itiCoordinates1, setItiCoordinates1] = useState([]);
  const [itiCoordinates2, setItiCoordinates2] = useState([]);

  const handleLineColorChange = (event, nbr) => {
    if (nbr == 1) setLineColor1(event.target.value);
    else if (nbr == 2) setLineColor2(event.target.value);
  };

  const toggleNightMode = () => {
    setMapStyle((prevStyle) => (prevStyle === "day" ? "night" : "day"));
    console.log(mapStyle);
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
  }, [itiCoordinates1, itiCoordinates2, mapStyle]); // Effectue l'effet uniquement lors du montage initial

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
        const imageUrl = `icons/${selectedIcon.path}`;
        addIcon(
          map.current,
          iconCoordinates,
          imageUrl,
          setCount,
          selectedIcon.label
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

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar backgroundColor="#d1cfff">
        <Menu
          transitionDuration={500}
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  color: disabled ? "#d1cfff" : "#025387", // Couleur de la police
                  backgroundColor: active ? "##BDE5FF" : "#d1cfff",
                };
            },
          }}
        >
          <SubMenu
            label="Mode Itinéraire"
            backgroundColor="#d1cfff"
            onClick={() => setMode("itinerary")}
          >
            {mode === "itinerary" && (
              <div style={{ marginLeft: "10px" }}>
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
          </SubMenu>

          <SubMenu
            backgroundColor="#d1cfff"
            label="Pose et dépose d'objet"
            onClick={() => setMode("addIcon")}
          >
            {mode === "addIcon" && (
              <div>
                {/* Choix Icones */}
                <label style={{ marginLeft: "10px" }}>
                  Sélectionner une icône :
                </label>
                <div
                  style={{
                    fontfamily: " Arial Narrow, sansserif",
                    display: "flex",
                    gap: "10px",
                    marginTop: "5px",
                    marginLeft: "10px",
                  }}
                >
                  {Object.values(icons).map((icon, index) => (
                    <img
                      key={index}
                      src={`icons/${icon.path}`}
                      alt={icon.label}
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
              </div>
            )}
          </SubMenu>

          <SubMenu label="Détails">
            <ul>
              {Object.values(icons).map((icon, index) => (
                <li key={index}>
                  {icon.label} : {index.count}
                </li>
              ))}
            </ul>
          </SubMenu>

          <SubMenu label="Mode Nuit / Mode Jour">
            <div style={{ marginLeft: "10px" }}>
              <br />

              <label className="switch">
                <span className="sun">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g fill="#ffd43b">
                      <circle r="5" cy="12" cx="12" />
                      <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z" />
                    </g>
                  </svg>
                </span>
                <span className="moon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                  </svg>
                </span>
                <input
                  type="checkbox"
                  className="input"
                  checked={nightMode}
                  onChange={toggleNightMode}
                />
                <span className="slider"></span>
              </label>
              <div style={{ height: "10px" }}></div>
              <span className="modeJour">
                {nightMode ? "Mode Nuit" : "Mode Jour"}
              </span>
            </div>
          </SubMenu>
        </Menu>
      </Sidebar>

      {/* Carte */}
      <div
        id="map-container"
        ref={mapContainer}
        style={{ width: "1625px", height: "743px" }}
      ></div>
    </div>
  );
};

export default Map;
