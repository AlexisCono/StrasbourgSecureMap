import React, { useState } from 'react';
import '../styles/TimePicker.css'; // Fichier CSS séparé pour les styles

function TimePicker() {
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  return (
    <div className="time-picker-container">
      <label className="time-picker-label">Heure de début:</label>
      <input className="time-picker-input" type="time" value={startTime} onChange={handleStartTimeChange} />

      <label className="time-picker-label">Heure de fin:</label>
      <input className="time-picker-input" type="time" value={endTime} onChange={handleEndTimeChange} />
    </div>
  );
}

export default TimePicker;
