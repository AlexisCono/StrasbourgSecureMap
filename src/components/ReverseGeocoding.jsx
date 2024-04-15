import { useState, useEffect } from "react";
import axios from "axios";

const useReverseGeocoding = ({ latitude, longitude }) => {
  const [streetName, setStreetName] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchStreetName = async () => {
      if (!latitude || !longitude) return;
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${
            import.meta.env.VITE_MAPBOX_TOKEN
          }`,
          { signal: controller.signal }
        );
        if (
          response.data &&
          response.data.features &&
          response.data.features.length > 0
        ) {
          const fullAddress = response.data.features[0].place_name;
          setStreetName(fullAddress);
        }
      } catch (error) {
        console.error("Error fetching street name:", error);
      }
    };

    fetchStreetName();

    return () => {
      controller.abort();
    };
  }, [latitude, longitude]);

  return streetName;
};

export default useReverseGeocoding;
