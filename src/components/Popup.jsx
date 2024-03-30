import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

const Popup = ({ label }) => {
  const [formvalues, setFormValues] = useState({
    quantities: 1,
    startHours: undefined,
    endHours: undefined,
  });

  const updateFormValues = (key, value) => {
    setFormValues({
      ...formvalues,
      [key]: value,
    });
  };

  return (
    <div className="popup">
      <h2>{label}</h2>
      <h3>Quantité :</h3>
      <input
        type="number"
        name="quantities"
        id="quantitiesInput" // Ajout de l'attribut id
        value={formvalues.quantities}
        onChange={(event) => updateFormValues("quantities", event.target.value)}
      />
      <h3>Heure de pose :</h3>
      <input
        type="time"
        name="startHours"
        id="startHoursInput" // Ajout de l'attribut id
        value={formvalues.startHours}
        onChange={(event) => updateFormValues("startHours", event.target.value)}
      />
      <h3>Heure de dépose :</h3>
      <input
        type="time"
        name="endHours"
        id="endHoursInput" // Ajout de l'attribut id
        value={formvalues.endHours}
        onChange={(event) => updateFormValues("endHours", event.target.value)}
      />
      <button id="deleteButton">Supprimer</button>
    </div>
  );
};

Popup.propTypes = {
  label: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired,
};

export default Popup;
