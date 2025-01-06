import { useState, useEffect } from "react";
import { Location } from "../types";

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
      setLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          localStorage.setItem("lat", position.coords.latitude.toString());
          localStorage.setItem("lon", position.coords.longitude.toString());
          document.cookie = `lat=${position.coords.latitude}; path=/`;
          document.cookie = `lng=${position.coords.longitude}; path=/`;

          setLocation(newLocation);
          setLoading(false);
        },
        () => {
          setError("Please enable location access to see nearby stores");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, []);

  return { location, loading, error };
}
