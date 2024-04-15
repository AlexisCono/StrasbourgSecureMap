import React from "react";
import PropTypes from "prop-types";

const JSONExporter = ({ iconSubmitValues, itiZoneValues }) => {
  // Fonction pour générer les données à sauvegarder dans un fichier JSON
  const generateJSONData = () => {
    // Générer les données pour les icônes
    const iconsData = Object.values(iconSubmitValues).map((icon) => ({
      label: icon.label,
      path: icon.path,
      quantities: icon.quantities,
      startHours: icon.startHours,
      endHours: icon.endHours,
      coor: icon.coor,
    }));

    const jsonIcon = iconsData.reduce((acc, cur, idx) => {
      acc[`icon${idx + 1}`] = cur;
      return acc;
    }, {}); // Créer un objet à partir de la liste JSON

    // Générer les données pour les zones et les itinéraires
    let jsonItiZone = {};
    if (itiZoneValues && itiZoneValues.features) {
      const itiZoneData = itiZoneValues.features.map((itiZone, idx) => ({
        [`itiZone${idx + 1}`]: itiZone,
      }));

      jsonItiZone = itiZoneData.reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});
    }

    // Créer l'objet jsonData
    const jsonData = {
      icons: jsonIcon,
      itiZones: jsonItiZone,
    };

    return JSON.stringify(jsonData, null, 2); // Convertit l'objet en chaîne JSON bien formatée
  };

  // Fonction pour télécharger le fichier JSON
  const downloadJSON = () => {
    const data = generateJSONData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "icon_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadJSON}>Télécharger les données JSON</button>;
};

JSONExporter.propTypes = {
  iconSubmitValues: PropTypes.object.isRequired,
  itiZoneValues: PropTypes.object.isRequired,
};

export default JSONExporter;
