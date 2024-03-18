import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Importer le fichier CSS
import { addIcon, filterMarkersByTime } from "./iconsFct.jsx";
import {
  initRoute,
  updateRoute,
  deleteLastCoordinates,
  startItiAnimation,
} from "./itineraryFct.jsx";
import "../styles/Button.css";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { icons } from "../constants/icons.js";
import { initZone, updateZone } from "./zone.jsx";
import Clock from "./Clock.jsx";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleGlzY29ubyIsImEiOiJjbHRnMHAxZHEwZHg4Mmxxd29yem96cW81In0.dm0ZihVmXRT_T7S6IHDFzg";

const Map = () => {
  const [selectedIcon, setSelectedIcon] = useState(undefined);

  const countForIcons = Object.values(icons).map((icon) => ({
    label: icon.label,
    countIcons: 0,
  }));
  const [count, setCount] = useState(countForIcons);

  const [appTime, setAppTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [mode, setMode] = useState();

  const [sidebarOpen, setSidebarOpen] = useState(false); // État pour suivre si la sidebar est ouverte ou fermée

  const mapContainer = useRef(null);
  const map = useRef(null);

  const day_style = "mapbox://styles/alexiscono/cltfzxe96009n01nr6rafgsbz";

  const [itiCoordinates] = useState([]);
  const [zoneCoordinates] = useState([]);

  const handleDeleteLastCoordinate = () => {
    // Appel de la fonction deleteLastCoordinates ici
    deleteLastCoordinates(map.current, itiCoordinates, "route1"); // Supposons que 'coordinates' soit votre tableau de coordonnées
  };

  const handleStartAnimation = () => {
    // Appelez la fonction startAnimation avec les paramètres nécessaires
    startItiAnimation(map.current, itiCoordinates);
  };

  // Fonction pour mettre à jour l'heure de l'application
  const handleTimeChange = (newTime) => {
    setAppTime(newTime);
  };

  useEffect(() => {
    const lng = 7.7482;
    const lat = 48.5828;
    const zoom = 15.2;

    // Création de la carte une seule fois
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: day_style,
      center: [lng, lat],
      zoom: zoom,
    });

    initRoute(map.current, itiCoordinates, "route1");
    initZone(map.current, zoneCoordinates, "zone1");

    // Nettoyage de la carte lors du démontage du composant
    return () => map.current.remove();
  }, [itiCoordinates, zoneCoordinates]); // Effectue l'effet uniquement lors du montage initial

  useEffect(() => {
    // Ajout de l'événement de clic avec la gestion de l'icône ou du parcours
    const clickHandler = (e) => {
      if (mode === "itinerary") {
        itiCoordinates.push([e.lngLat.lng, e.lngLat.lat]);
        updateRoute(map.current, itiCoordinates, "route1");
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
      } else if (mode === "zone") {
        zoneCoordinates.push([e.lngLat.lng, e.lngLat.lat]);
        updateZone(map.current, zoneCoordinates, "zone1");
      }
    };

    map.current.on("click", clickHandler);

    // Retrait de l'événement de clic lors du démontage du composant
    return () => {
      map.current.off("click", clickHandler);
    };
  }, [selectedIcon, mode, count, itiCoordinates, zoneCoordinates]); // Effectue l'effet lors du changement d'icône

  useEffect(() => {
    filterMarkersByTime(appTime);
  }, [appTime]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Inversion de l'état de la sidebar
  };

  // Regroupe les icônes par catégorie
  const iconsByCategory = Object.values(icons).reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar collapsed={!sidebarOpen} width="200px" backgroundColor="#d1cfff">
        {/* Contenu de la sidebar */}
        <div style={{ position: "relative" }}>
          {/* Bouton pour ouvrir/fermer la sidebar */}
          <button
            className="boutonSidebar"
            onClick={toggleSidebar}
            style={{
              marginTop: "450px",
              position: "absolute",
              marginLeft: "8px",
              marginRight: "10px",
              zIndex: 999,
            }}
          >
            {sidebarOpen ? "Fermer" : "Ouvrir"}
          </button>
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
              label={
                <span style={{ fontSize: "15px" }}>🗺️​ Itinéraire / Zone</span>
              }
              backgroundColor="#d1cfff"
              onClick={() => setMode("itinerary")}
            >
              {mode === "itinerary" && (
                <div style={{ marginLeft: "10px" }}>
                  {/* Parcours 1 */}
                  Parcours 1
                  <br />
                  <button onClick={handleDeleteLastCoordinate}>
                    <img
                      src={`./public/image/return.png`}
                      alt="return"
                      style={{
                        width: "30px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                  <button onClick={handleStartAnimation}>Start</button>
                </div>
              )}
            </SubMenu>
            <SubMenu
              backgroundColor="#d1cfff"
              label={
                <span style={{ fontSize: "15px" }}>Elmts de Sécurisation</span>
              }
              onClick={() => setMode("addIcon")}
            >
              {mode === "addIcon" && (
                <div>
                  {/* Parcours des catégories et affichage des sous-menus */}
                  {Object.entries(iconsByCategory).map(([category, icons]) => (
                    <SubMenu key={category} label={category}>
                      {/* Affichage des icônes pour chaque catégorie */}
                      {icons.map((icon, index) => (
                        <img
                          key={index}
                          src={`icons/${icon.path}`}
                          alt={icon.label}
                          style={{
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                            border:
                              selectedIcon === icon
                                ? "2px solid #17A71B"
                                : "none",
                          }}
                          onClick={() => setSelectedIcon(icon)}
                        />
                      ))}
                    </SubMenu>
                  ))}
                </div>
              )}
            </SubMenu>

            <SubMenu label="Détails">
              <ul>
                {Object.values(count).map(
                  (icon, index) =>
                    icon.countIcons !== 0 && (
                      <li key={index}>
                        <p>
                          {icon.label} : {icon.countIcons}
                        </p>
                      </li>
                    )
                )}
              </ul>
            </SubMenu>

            <SubMenu
              backgroundColor="#d1cfff"
              label="Définition d'une zone"
              onClick={() => setMode("zone")}
            >
              {mode === "addIcon" && <br />}
            </SubMenu>
          </Menu>
        </div>
      </Sidebar>
      <Clock onTimeChange={handleTimeChange} />
      {/* Carte */}
      <div
        id="map-container"
        ref={mapContainer}
        style={{ flex: 1, position: "relative" }} // Ajustement pour occuper tout l'espace restant
      ></div>

      {/* Bouton pour ouvrir/fermer la sidebar */}
    </div>
  );
};

export default Map;
