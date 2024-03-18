import React, { useState } from "react";
import PropTypes from "prop-types"; // Importez PropTypes
import "../styles/Clock.css"
const Clock = ({ onTimeChange }) => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setCurrentTime(newTime);
        onTimeChange(newTime);
    };

    return (
        <div style={{ fontFamily: "Consolas,monaco,monospace", display: 'flex', alignItems: 'center' }} className="clock-container">
          <div style={{ border: '1px solid #00114d', background: '#00114d', padding: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>  
           
            
  <label htmlFor="clock" style={{ fontSize: '14px', fontFamily:'Consolas,monaco,monospace', color: '#2c9caf', marginLeft: '5px',marginRight:'5px' }}>HEURE</label>
  <input className="Horloge" type="time" id="clock" value={currentTime} onChange={handleTimeChange} style={{ color: '#00114d', border: 'none',display: 'flex', outline: 'none' }} />
</div>
</div>



    
    );
};

// Ajoutez une validation de props
Clock.propTypes = {
    onTimeChange: PropTypes.func.isRequired, // Assurez-vous que onTimeChange est une fonction requise
};

export default Clock;
