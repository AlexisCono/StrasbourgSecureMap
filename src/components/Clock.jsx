import React, { useState } from "react";
import PropTypes from "prop-types"; // Importez PropTypes

const Clock = ({ onTimeChange }) => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setCurrentTime(newTime);
        onTimeChange(newTime);
    };

    return (
        <div>
            <label htmlFor="clock">Heure :</label>
            <input type="time" id="clock" value={currentTime} onChange={handleTimeChange} />
        </div>
    );
};

// Ajoutez une validation de props
Clock.propTypes = {
    onTimeChange: PropTypes.func.isRequired, // Assurez-vous que onTimeChange est une fonction requise
};

export default Clock;
