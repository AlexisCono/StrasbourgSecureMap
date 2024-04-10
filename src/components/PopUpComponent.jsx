import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/popUp.css";

const PopUp = ({ icon, onSubmit, coordKey }) => {
  const [formValues, setFormValues] = useState({
    label: icon.label,
    path: icon.path,
    quantities: 1,
    startHours: "",
    endHours: "",
    coor: coordKey,
  });

  const updateFormValues = (key, value) => {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  return (
    <div className="popup-content">
      <h2>{icon.label}</h2>
      <h3>Quantité :</h3>
      <input
        type="number"
        name="quantities"
        id="quantitiesInput" // Ajout de l'attribut id
        value={formValues.quantities}
        min="1"
        onChange={(event) =>
          updateFormValues("quantities", parseInt(event.target.value))
        }
      />
      <h3>Heure de pose :</h3>
      <input
        type="time"
        name="startHours"
        id="startHoursInput" // Ajout de l'attribut id
        value={formValues.startHours}
        onChange={(event) => updateFormValues("startHours", event.target.value)}
      />
      <h3>Heure de dépose :</h3>
      <input
        type="time"
        name="endHours"
        id="endHoursInput" // Ajout de l'attribut id
        value={formValues.endHours}
        onChange={(event) => updateFormValues("endHours", event.target.value)}
      />
      <button onClick={() => onSubmit(formValues)} type="submit">
        Sauvegarder
      </button>
      <button id="deleteButton">Supprimer</button>
    </div>
  );
};

PopUp.propTypes = {
  icon: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  coordKey: PropTypes.string.isRequired,
};

export default PopUp;
