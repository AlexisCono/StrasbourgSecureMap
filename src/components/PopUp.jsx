import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/popUp.css";
import useReverseGeocoding from "./ReverseGeocoding";

const PopUp = ({ icon, onSubmit, coordinates, coordKey, jsonDataIcon }) => {
  const [formValues, setFormValues] = useState({
    label: icon.label,
    path: icon.path,
    quantities: jsonDataIcon ? icon.quantities : 1,
    startHours: jsonDataIcon ? icon.startHours : "",
    endHours: jsonDataIcon ? icon.endHours : "",
    coor: coordKey,
  });

  const [latitude, longitude] = coordKey.split(" ").map(parseFloat);
  const streetName = useReverseGeocoding({ latitude, longitude }) || "Inconnu";

  // Il y a un problème, dès que je clique ca m'affiche inconu et un nom de rue, parfoit une reu au piff"

  const updateFormValues = (key, value) => {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  onSubmit({ ...formValues, streetName });
  console.log(streetName);

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
      <button id="deleteButton">Supprimer</button>
    </div>
  );
};

PopUp.propTypes = {
  icon: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  coordKey: PropTypes.string.isRequired,
  jsonDataIcon: PropTypes.object,
  coordinates: PropTypes.object.isRequired,
};

export default PopUp;