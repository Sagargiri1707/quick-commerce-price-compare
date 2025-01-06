import { useState, useEffect } from "react";
import { Location } from "../types";

// async function getPincodes(lat: number, lon: number) {
//   const response = await fetch(
//     `/api/bigbasket/ui-svc/v1/serviceable/?lat=${lat}&lng=${lon}&send_all_serviceability=true`
//   );
//   const data = await response.json();
//   return data.places_info.pincode || "";
// }

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [pinCode, setPinCode] = useState("");
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
      setLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
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
          console.log("Location found:", newLocation);
          //getPincodes(newLocation.lat, newLocation.lon).then((pinCode) =>
          //setPinCode(pinCode)
          // );
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
