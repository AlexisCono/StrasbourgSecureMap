import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/popUp.css";

const PopUp = ({ icon, onSubmit, coordKey, jsonDataIcon }) => {
  const [formValues, setFormValues] = useState({
    label: icon.label,
    path: icon.path,
    quantities: jsonDataIcon ? icon.quantities : 1,
    startHours: jsonDataIcon ? icon.startHours : "",
    endHours: jsonDataIcon ? icon.endHours : "",
    coor: coordKey,
  });

  const updateFormValues = (key, value) => {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (jsonDataIcon) {
      onSubmit(formValues);
    }
  }, [formValues, onSubmit, jsonDataIcon]);

  return (
    <div className="popup-content">
      <h2>{icon.label}</h2>
      <h3>Quantité :</h3>
      <input
        type="number"
        name="quantities"
        id="quantitiesInput"
        value={formValues.quantities}
        min="1"
        onChange={(event) =>
          updateFormValues("quantities", parseInt(event.target.value))
        }
      />
      <h3>Heure de pose :</h3>
      <input
        type="datetime-local"
        name="startHours"
        id="startHoursInput"
        value={formValues.startHours}
        onChange={(event) => updateFormValues("startHours", event.target.value)}
      />

      <h3>Heure de dépose :</h3>
      <input
        type="datetime-local"
        name="endHours"
        id="endHoursInput"
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
  jsonDataIcon: PropTypes.object.isRequired,
};

export default PopUp;
