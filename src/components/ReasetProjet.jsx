import React from "react";

const ResetButton = () => {
  const handleReset = (event) => {
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir réinitialiser le projet ?"
    );

    if (!isConfirmed) {
      event.preventDefault(); // Annuler la navigation si la réinitialisation est annulée
    }
  };

  return (
    <a href="/interactiveMap" className="resetButton" onClick={handleReset}>
      Réinitialiser le projet
    </a>
  );
};

export default ResetButton;
