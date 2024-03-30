import React from "react";
import PropTypes from "prop-types";
import "../styles/popUp.css";

const PopUp = ({ label, formValues, setFormValues }) => {
  const updateFormValues = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  return (
    <div className="popup-content">
      <h2>{label}</h2>
      <h3>Quantité :</h3>
      <input
        type="number"
        name="quantities"
        id="quantitiesInput" // Ajout de l'attribut id
        value={formValues.quantities}
        onChange={(event) => updateFormValues("quantities", event.target.value)}
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
      <button id="deleteButton">Supprimer</button>
    </div>
  );
};

PopUp.propTypes = {
  label: PropTypes.string.isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
};

export default PopUp;
