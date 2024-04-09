import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
import { initializeDrawZone } from "./zone.jsx";
import "../styles/Clock.css";
import "../styles/Icones.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = () => {
  const [selectedIcon, setSelectedIcon] = useState(undefined);
  const [toggleZone, setToggleZone] = useState(false);

  const [iconSubmitValues, setIconSubmitValues] = useState({});

  const onIconSubmit = (iconValues) => {
    console.log(iconValues);
    setIconSubmitValues((prevValues) => {
      return { ...prevValues, [iconValues.id]: iconValues };
    });
  };

  const deleteIconValues = (id) => {
    setIconSubmitValues((prevValues) => {
      const newValues = { ...prevValues };
      delete newValues[id];
      return newValues;
    });
  };

  const [mode, setMode] = useState();

  const [searchText, setSearchText] = useState("");

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [selectedRoute, setSelectedRoute] = useState("route1");
  const [itiCoordinates1, setItiCoordinates1] = useState([]);
  const [itiCoordinates2, setItiCoordinates2] = useState([]);

  const [selectedZone, setSelectedZone] = useState("zone1");
  const [zoneCoordinates1, setZoneCoordinates1] = useState([]);
  const [zoneCoordinates2, setZoneCoordinates2] = useState([]);
  const [zoneCoordinates3, setZoneCoordinates3] = useState([]);

  const vit_course = 8;
  const vit_marche = 5;

  const handleToggleZone = () => {
    setToggleZone((prevState) => !prevState);
  };

  const handleChangeRoute = () => {
    setSelectedRoute(selectedRoute === "route1" ? "route2" : "route1");
  };

  const handleChangeZone = () => {
    setSelectedZone((prevSelectedZone) => {
      switch (prevSelectedZone) {
        case "zone1":
          return "zone2";
        case "zone2":
          return "zone3";
        case "zone3":
          return "zone1";
        default:
          return prevSelectedZone;
      }
    });
  };

  const handleDeleteLastCoordinate = (itiCoordinates) => {
    // Appel de la fonction deleteLastCoordinates ici
    deleteLastCoordinates(map.current, itiCoordinates, selectedRoute); // Supposons que 'coordinates' soit votre tableau de coordonnées
  };

  const handleStartAnimation = (itiCoordinates, vitesse) => {
    // Appelez la fonction startAnimation avec les paramètres nécessaires
    startItiAnimation(map.current, itiCoordinates, selectedRoute, vitesse);
  };

  // État local pour stocker le terme de recherche
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const lng = 7.7482;
    const lat = 48.5828;
    const zoom = 15.2;

    // Création de la carte une seule fois
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    initRoute(map.current, itiCoordinates1, "route1", "#4254f5");
    initRoute(map.current, itiCoordinates2, "route2", "#52db40 ");

    //initZone(map.current, zoneCoordinates1, "zone1");
    //initZone(map.current, zoneCoordinates2, "zone2");
    //initZone(map.current, zoneCoordinates3, "zone3");

    // Nettoyage de la carte lors du démontage du composant
    return () => map.current.remove();
  }, [
    itiCoordinates1,
    itiCoordinates2,
    zoneCoordinates1,
    zoneCoordinates2,
    zoneCoordinates3,
  ]); // Effectue l'effet uniquement lors du montage initial

  useEffect(() => {
    // Ajout de l'événement de clic avec la gestion de l'icône ou du parcours
    const clickHandler = (e) => {
      if (mode === "itinerary") {
        const updatedCoordinates = [e.lngLat.lng, e.lngLat.lat];
        if (selectedRoute === "route1") {
          const newCoordinates = [...itiCoordinates1, updatedCoordinates];
          setItiCoordinates1(newCoordinates);
          updateRoute(map.current, newCoordinates, selectedRoute);
        } else if (selectedRoute === "route2") {
          const newCoordinates = [...itiCoordinates2, updatedCoordinates];
          setItiCoordinates2(newCoordinates);
          updateRoute(map.current, newCoordinates, selectedRoute);
        }
      } else if (mode === "zone") {
        const updatedCoordinates = [e.lngLat.lng, e.lngLat.lat];
        if (selectedZone === "zone1") {
          initializeDrawZone(map.current);
        }
      } else if (mode === "addIcon") {
        if (selectedIcon) {
          const iconCoordinates = e.lngLat;
          addIcon(
            map.current,
            iconCoordinates,
            selectedIcon,
            onIconSubmit,
            deleteIconValues
          );
        }
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
    selectedRoute,
    itiCoordinates1,
    itiCoordinates2,
    selectedZone,
    iconSubmitValues,
  ]); // Effectue l'effet lors du changement d'icône

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
      <Sidebar width="200px" backgroundColor="#d1cfff">
        {/* Contenu de la sidebar */}
        <div style={{ position: "relative" }}>
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
                  {/* Bouton pour changer d'itinéraire */}
                  <button onClick={handleChangeRoute}>
                    Changer d&apos;itinéraire
                  </button>

                  {/* Parcours sélectionné */}
                  {selectedRoute === "route1" && (
                    <div>
                      {/* Parcours 1 */}
                      Course
                      <br />
                      <button
                        onClick={() =>
                          handleDeleteLastCoordinate(itiCoordinates1)
                        }
                      >
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
                      <button
                        onClick={() =>
                          handleStartAnimation(itiCoordinates1, vit_course)
                        }
                      >
                        Start
                      </button>
                    </div>
                  )}

                  {selectedRoute === "route2" && (
                    <div>
                      {/* Parcours 2 */}
                      Marche
                      <br />
                      <button
                        onClick={() =>
                          handleDeleteLastCoordinate(itiCoordinates2)
                        }
                      >
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
                      <button
                        onClick={() =>
                          handleStartAnimation(itiCoordinates2, vit_marche)
                        }
                      >
                        Start
                      </button>
                    </div>
                  )}
                </div>
              )}
            </SubMenu>

            <SubMenu
              backgroundColor="#d1cfff"
              label="🗺️ Zone"
              onClick={() => setMode("zone")}
            >
              {mode === "zone" && (
                <div style={{ marginLeft: "10px" }}>
                  {/* Bouton pour changer d'itinéraire */}
                  <button onClick={handleChangeZone}>
                    Changer de zone
                  </button>{" "}
                  <br />
                  <a>{selectedZone}</a>
                </div>
              )}
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
              {Object.values(iconSubmitValues).map((iconValues, index) => (
                <ul key={index}>
                  <li>
                    <b>{iconValues.label}</b>
                  </li>
                  <li>quantities: {iconValues.quantities}</li>
                  {iconValues.startHours && iconValues.endHours && (
                    <li>
                      de {iconValues.startHours} à {iconValues.endHours}
                    </li>
                  )}
                  <li>lng lat: {iconValues.id}</li>
                </ul>
              ))}
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
