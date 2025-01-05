interface Headers {
  [key: string]: any;
}

// Utility function to get coordinates from localStorage
export function getCoordinates(): { lat: string; lon: string } {
  if (typeof window !== "undefined") {
    return {
      lat: localStorage.getItem("lat") || "",
      lon: localStorage.getItem("lon") || "",
    };
  }
  return { lat: "", lon: "" };
}

export function getBlinkitHeaders(): Headers {
  const { lat, lon } = getCoordinates();
  return {
    "Content-Type": "application/json",
    lat: lat,
    lon: lon,
    access_token: null,
    app_client: "consumer_web",
    app_version: 1010101010,
  };
}

export function getInstamartHeaders(): Headers {
  const { lat, lon } = getCoordinates();
  return {
    "Content-Type": "application/json",
    lat: lat,
    lon: lon,
    access_token: null,
    app_client: "consumer_web",
    app_version: 1010101010,
  };
}

export function getInstamartQueryParams(storeId: string, searchQuery: string) {
  return {
    clientId: "INSTAMART-APP",
    data: {
      storeId: storeId,
      primaryStoreId: storeId,
      limit: 10,
      query: searchQuery,
    },
  };
}
