import React from "react";
import PropTypes from "prop-types";

const JSONExporter = ({ iconSubmitValues }) => {
  // Fonction pour générer les données à sauvegarder dans un fichier JSON
  const generateJSONData = () => {
    const jsonData = iconSubmitValues.map((icon) => ({
      label: icon.label,
      quantities: icon.quantities,
      startHours: icon.startHours,
      endHours: icon.endHours,
      coor: icon.coor,
    }));
    return JSON.stringify(jsonData, null, 2); // Convertit l'objet en chaîne JSON bien formatée
  };

  // Fonction pour télécharger le fichier JSON
  const downloadJSON = () => {
    const data = generateJSONData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "popup_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadJSON}>Télécharger les données JSON</button>;
};

JSONExporter.propTypes = {
  iconSubmitValues: PropTypes.array.isRequired,
};

export default JSONExporter;
