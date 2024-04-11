import React, { useState, useEffect } from "react";
import axios from "axios";
import PropType from "prop-types";

const ReverseGeocoding = ({ latitude, longitude }) => {
  const [streetName, setStreetName] = useState("");

  useEffect(() => {
    const fetchStreetName = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        if (response.data && response.data.address) {
          const street = response.data.address.road;
          setStreetName(street);
        }
      } catch (error) {
        console.error("Error fetching street name:", error);
      }
    };

    fetchStreetName();

    return () => {
      setStreetName("");
    };
  }, [latitude, longitude]);

  return streetName;
};

ReverseGeocoding.propTypes = {
  latitude: PropType.number.isRequired,
  longitude: PropType.number.isRequired,
};

export default ReverseGeocoding;
