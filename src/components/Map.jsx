import React, { useEffect, useState, useRef } from "react";
import { addIcon } from "../function/addIconsFct.jsx";
import { initializeDraw } from "../function/draw.jsx";
import JSONExporter from "./JSONExporter.jsx";
import PDFExporter from "./PDFExporter.jsx";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/button.css";
import "../styles/icons.css";
import { icons } from "../constants/icons.js";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import ReasetProjet from "./ReasetProjet.jsx";
import { timeConvert } from "../function/timeConvert.jsx";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// A décommenter à la fin ! //
// mapboxgl.accessToken = localStorage.getItem('mapboxApiKey');

const Map = () => {
  const [jsonDataIcon, setJsonDataIcon] = useState(null);
  const [jsonDataItiZone, setJsonDataItiZone] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(undefined);
  const [iconSubmitValues, setIconSubmitValues] = useState({});
  const [itiZoneValues, setItiZoneValues] = useState({});

  const searchText = "";
  const [searchTerm, setSearchTerm] = useState("");

  const onIconSubmit = (iconValues) => {
    setIconSubmitValues((prevValues) => {
      return {
        ...prevValues,
        [iconValues.coor]: iconValues,
      };
    });
  };

  const deleteIconValues = (id) => {
    setIconSubmitValues((prevValues) => {
      const newValues = { ...prevValues };
      delete newValues[id];
      return newValues;
    });
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      const fileContent = await selectedFile.text();
      const parsedData = JSON.parse(fileContent);
      const { icons, itiZones } = parsedData;
      setJsonDataIcon(icons);
      setJsonDataItiZone(itiZones);
    } catch (error) {
      console.error("Error parsing JSON file:", error);
    }
  };

  const [mode, setMode] = useState();

  const mapContainer = useRef(null);
  const map = useRef(null);

  // État local pour stocker le terme de recherche

  useEffect(() => {
    const lat = 7.7482;
    const lng = 48.5828;
    const zoom = 15.2;
    const bounds = [
      [6.96, 48.14], // Southwest coordinates
      [8.47, 48.85], // Northeast coordinates
    ];
    // Création de la carte une seule fois
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lat, lng],
      zoom: zoom,
      maxBounds: bounds, // Set the map's geographical boundaries.
    });

    map.current.addControl(new mapboxgl.FullscreenControl());
    initializeDraw(map.current, setItiZoneValues, jsonDataItiZone, setMode);

    if (jsonDataIcon) {
      Object.values(jsonDataIcon).forEach((jsonIcon) => {
        const [lat, lng] = jsonIcon.coor.split(" ").map(parseFloat);
        const coordinates = { lat, lng };

        addIcon(
          map.current,
          coordinates,
          jsonIcon,
          onIconSubmit,
          deleteIconValues,
          jsonDataIcon
        );
      });
    }

    // Nettoyage de la carte lors du démontage du composant
    return () => map.current.remove();
  }, [jsonDataItiZone, jsonDataIcon]); // Effectue l'effet uniquement lors du montage initial

  useEffect(() => {
    // Ajout de l'événement de clic avec la gestion de l'icône ou du parcours
    const clickHandler = (e) => {
      if (mode === "addIcon") {
        if (selectedIcon) {
          const iconCoordinates = e.lngLat;
          addIcon(
            map.current,
            iconCoordinates,
            selectedIcon,
            onIconSubmit,
            deleteIconValues,
            null
          );
        }
      }
    };

    map.current.on("click", clickHandler);

    // Retrait de l'événement de clic lors du démontage du composant
    return () => {
      map.current.off("click", clickHandler);
    };
  }, [selectedIcon, mode, iconSubmitValues]); // Effectue l'effet lors du changement d'icône

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

  const generateIconValues = (iconValues, index) => {
    return (
      <ul key={index}>
        <b>
          {iconValues.label} x {iconValues.quantities}
        </b>
        <br />
        {iconValues.startHours && (
          <li>
            <em>Pose:</em> {timeConvert(iconValues.startHours)}
          </li>
        )}
        {iconValues.endHours && (
          <li>
            <em>Enlèvement:</em> {timeConvert(iconValues.endHours)}
          </li>
        )}
        <li>{iconValues.streetName}</li>
        {iconValues.describe && iconValues.describe.trim() !== "" && (
          <li>
            <em>Description:</em> {iconValues.describe}
          </li>
        )}
        <br />
      </ul>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {mode === "addIcon" && (
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
                      backgroundColor: active ? "#BDE5FF" : "#d1cfff",
                    };
                },
              }}
            >
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
              {filteredIcons.map(([category, icons]) => {
                const categoryHasMatchingIcons = icons.some((icon) =>
                  icon.label.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return (
                  <SubMenu
                    key={category}
                    style={{
                      display: categoryHasMatchingIcons ? "flex" : "none",
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
                );
              })}
            </Menu>
          </div>
        </Sidebar>
      )}
      {/* Carte */}
      <div
        id="map-container"
        ref={mapContainer}
        style={{ flex: 1, position: "relative" }}
        // Ajustement pour occuper tout l'espace restant
      />

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
                    backgroundColor: active ? "#BDE5FF" : "#d1cfff",
                  };
              },
            }}
          >
            <SubMenu
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                fontSize: "80%",
              }}
              label="Paramètres"
            >
              <div className="parametreButton">
                <div>
                  <input
                    style={{
                      display: "none",
                    }}
                    id="fileInput"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="fileInput" className="Import">
                    Importer un fichier
                  </label>
                </div>

                <JSONExporter
                  iconSubmitValues={iconSubmitValues}
                  itiZoneValues={itiZoneValues}
                />
                <PDFExporter
                  iconSubmitValues={iconSubmitValues}
                  itiZoneValues={itiZoneValues}
                />
                <ReasetProjet />
              </div>
            </SubMenu>
          </Menu>
        </div>

        <Menu>
          <div style={{ position: "relative" }}>
            <SubMenu
              key="Barrières"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                fontSize: "80%",
              }}
              label="Barrières"
            >
              {Object.values(iconSubmitValues).map(
                (iconValues, index) =>
                  iconValues.category === "Barrières" &&
                  generateIconValues(iconValues, index)
              )}
            </SubMenu>

            <SubMenu
              key="Élmts béton"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                fontSize: "80%",
              }}
              label="Élmts béton"
            >
              {Object.values(iconSubmitValues).map(
                (iconValues, index) =>
                  iconValues.category === "Élmts béton" &&
                  generateIconValues(iconValues, index)
              )}
            </SubMenu>

            <SubMenu
              key="Véhicules"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                fontSize: "80%",
              }}
              label="Véhicules"
            >
              {Object.values(iconSubmitValues).map(
                (iconValues, index) =>
                  iconValues.category === "Véhicules" &&
                  generateIconValues(iconValues, index)
              )}
            </SubMenu>

            <SubMenu
              key="Sécurisation"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                fontSize: "80%",
              }}
              label="Sécurisation"
            >
              {Object.values(iconSubmitValues).map(
                (iconValues, index) =>
                  iconValues.category === "Sécurisation" &&
                  generateIconValues(iconValues, index)
              )}
            </SubMenu>

            <SubMenu
              key="Animation"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                fontSize: "80%",
              }}
              label="Animation"
            >
              {Object.values(iconSubmitValues).map(
                (iconValues, index) =>
                  iconValues.category === "Animation" &&
                  generateIconValues(iconValues, index)
              )}
            </SubMenu>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default Map;
