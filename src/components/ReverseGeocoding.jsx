import { useState, useEffect } from "react";
import axios from "axios";

const useReverseGeocoding = ({ latitude, longitude }) => {
  const [streetName, setStreetName] = useState("");
  const cords = { latitude, longitude };

  useEffect(() => {
    const controller = new AbortController();
    const fetchStreetName = async () => {
      if (!cords.latitude || !cords.longitude) return;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${cords.latitude}&lon=${cords.longitude}&format=json`,
          { signal: controller.signal }
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
      controller.abort();
    };
  }, [cords.longitude, cords.latitude]);

  return streetName;
};

export default useReverseGeocoding;
