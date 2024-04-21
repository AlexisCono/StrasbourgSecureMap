import React, { useState } from "react";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import PropType from "prop-types";
import { icons } from "../constants/icons.js";

const SidebarIcon = ({ selectedIcon, setSelectedIcon, mode }) => {
  const searchText = "";
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
              {filteredIcons.map(([category, icons]) => (
                <SubMenu
                  key={category}
                  style={{
                    display: icons.some((icon) =>
                      icon.label
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                      ? "flex"
                      : "none",
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
            </Menu>
          </div>{" "}
          <br />
        </Sidebar>
      )}
    </div>
  );
};

SidebarIcon.propTypes = {
  mode: PropType.string,
  selectedIcon: PropType.object,
  setSelectedIcon: PropType.func.isRequired,
};

export default SidebarIcon;
