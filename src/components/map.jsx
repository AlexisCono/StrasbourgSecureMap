import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Importer le fichier CSS
import { addIcon } from "./addIconsFct.jsx";
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
import "../styles/Clock.css";
import "../styles/Icones.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = () => {
  const [selectedIcon, setSelectedIcon] = useState(undefined);

  const [formValues, setFormValues] = useState({
    quantities: 1,
    startHours: "",
    endHours: "",
  });

  const countForIcons = Object.values(icons).map((icon) => ({
    label: icon.label,
    countIcons: 0,
  }));
  const [count, setCount] = useState(countForIcons);

  const [mode, setMode] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false); // État pour suivre si la sidebar est ouverte ou fermée

  const [searchText, setSearchText] = useState("");

  const mapContainer = useRef(null);
  const map = useRef(null);

  // const day_style = "mapbox://styles/alexiscono/cltfzxe96009n01nr6rafgsbz";

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

  useEffect(() => {
    const lng = 7.7482;
    const lat = 48.5828;
    const zoom = 15.2;

    // Création de la carte une seule fois
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
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
        if (selectedIcon) {
          const iconCoordinates = e.lngLat;
          addIcon(
            map.current,
            iconCoordinates,
            selectedIcon,
            formValues,
            setFormValues
          );
        }
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
  }, [selectedIcon, mode, count, itiCoordinates, zoneCoordinates, formValues]); // Effectue l'effet lors du changement d'icône

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Inversion de l'état de la sidebar
  };

  // État local pour stocker le terme de recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction de gestion de la saisie de texte
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // Regroupe les icônes par catégorie
  const iconsByCategory = Object.values(icons).reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {});

  // Fonction pour filtrer les icônes en fonction du texte de recherche
  const filteredIcons = Object.entries(iconsByCategory).filter(
    ([category, icons]) =>
      icons.some((icon) =>
        icon.label.toLowerCase().includes(searchText.toLowerCase())
      )
  );

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
              label={<span style={{ fontSize: "15px" }}>〰️ Itinéraire</span>}
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
              label="🗺️ Zone"
              onClick={() => setMode("zone")}
            >
              {mode === "addIcon" && <br />}
            </SubMenu>

            <SubMenu
              backgroundColor="#d1cfff"
              label={<span style={{ fontSize: "15px" }}>🏗️ Sécurisation</span>}
              onClick={() => setMode("addIcon")}
            >
              {mode === "addIcon" && (
                <div>
                  {/* Champ de recherche */}
                  <input
                    className="RechercherIcone"
                    style={{
                      marginTop: "5%",
                      marginLeft: "5%",
                      marginBottom: "5%",
                    }}
                    type="text"
                    placeholder="Rechercher ..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  {/* Parcours des catégories filtrées et affichage des sous-menus */}
                  {filteredIcons.map(([category, icons]) => (
                    <SubMenu
                      key={category}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        fontSize: "80%",
                      }}
                      label={category}
                    >
                      {/* Affichage des icônes filtrées pour chaque catégorie */}
                      {icons
                        .filter((icon) =>
                          icon.label
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((icon, index) => (
                          <div
                            key={index}
                            style={{ textAlign: "center", margin: "10%" }}
                          >
                            <img
                              key={index}
                              src={`icons/${icon.path}`}
                              alt={icon.label}
                              style={{
                                width: "25%",
                                height: "25%",
                                marginLeft: "5%",
                                marginRight: "5%",
                                marginTop: "0.5%",
                                marginBottom: "0.2%",
                                cursor: "pointer",
                                border:
                                  selectedIcon === icon
                                    ? "2px solid #17A71B"
                                    : "none",
                              }}
                              onClick={() => setSelectedIcon(icon)}
                            />

                            <div style={{ fontSize: "10px", marginTop: "2%" }}>
                              {icon.label}
                            </div>
                          </div>
                        ))}
                    </SubMenu>
                  ))}
                </div>
              )}
            </SubMenu>

            <SubMenu label="🗒️​ Détails">
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
          </Menu>
        </div>
      </Sidebar>

      {/* Carte */}
      <div
        id="map-container"
        ref={mapContainer}
        style={{ flex: 1, position: "relative" }}
        // Ajustement pour occuper tout l'espace restant
      ></div>
    </div>
  );
};

export default Map;
