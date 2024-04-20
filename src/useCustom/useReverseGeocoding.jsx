import { useState, useEffect } from "react";
import axios from "axios";

export const getReverseGeocoding = async ({ latitude, longitude, signal }) => {
  if (!latitude || !longitude) return;
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${
        import.meta.env.VITE_MAPBOX_TOKEN
      }`,
      { signal }
    );
    if (response?.data?.features?.length > 0) {
      const fullAddress = response.data.features[0].place_name;
      return fullAddress;
    }
  } catch (error) {
    console.error("Error fetching street name:", error);
  }
};

const useReverseGeocoding = ({ latitude, longitude }) => {
  const [streetName, setStreetName] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getReverseGeocoding({
      latitude,
      longitude,
      signal: controller.signal,
    }).then((fullAddress) => {
      setStreetName(fullAddress);
    });

    return () => {
      controller.abort();
    };
  }, [latitude, longitude]);

  return streetName;
};

export default useReverseGeocoding;
