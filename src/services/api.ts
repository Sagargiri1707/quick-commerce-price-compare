import { Product } from "../types";
import {
  getBlinkitHeaders,
  getInstamartHeaders,
  getFlipkartHeaders,
  getInstamartBody,
} from "./header";
import { transformBlinkitData, transformInstamartData } from "./transformers";
const BLINKIT_API_URL = "/api/blinkit/layout/search";
const INSTAMART_API_URL = "/api/instamart/search";
const INSTAMART_STORE_URL = "/api/instamart/home?clientId=INSTAMART-APP";
// const FLIPKART_API_URL = "https://flipkart.com/api/v1/search";
// const BLINKIT_API_URL = "https://blinkit.com/v1/layout/search";
async function fetchBlinkitProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${BLINKIT_API_URL}?q=${encodeURIComponent(
        query
      )}&search_type=type_to_search`,
      {
        headers: getBlinkitHeaders(),
        method: "POST",
      }
    );

    if (!response.ok) throw new Error("Blinkit API error");
    const data = await response.json();
    return transformBlinkitData(data);
  } catch (error) {
    console.error("Blinkit fetch error:", error);
    return [];
  }
}
async function getInstamartStoreLocation(): Promise<{
  storeId: string;
  sla: string;
}> {
  try {
    const response = await fetch(
      `${INSTAMART_STORE_URL}?clientId=INSTAMART-APP`,
      {
        headers: getInstamartHeaders(),
        method: "GET",
      }
    );

    if (!response.ok) throw new Error("Instamart store location API error");

    const data = await response.json();
    return { storeId: data?.data?.storeId, sla: data?.data?.slaString };
  } catch (error) {
    console.error("Instamart store location fetch error:", error);
    throw error;
  }
}
async function fetchInstamartProducts(query: string): Promise<Product[]> {
  try {
    const { storeId: instamartStoreLocation, sla } =
      await getInstamartStoreLocation();
    const response = await fetch(
      `${INSTAMART_API_URL}?query=${encodeURIComponent(
        query
      )}&storeId=${instamartStoreLocation}&primaryStoreId=${instamartStoreLocation}&limit=10`,
      {
        headers: getInstamartHeaders(),
        method: "POST",
        body: JSON.stringify({ facets: {}, sortAttribute: "" }),
      }
    );

    if (!response.ok) throw new Error("Instamart API error");
    const data = await response.json();
    const processedData = transformInstamartData(data.data, sla);
    return processedData;
  } catch (error) {
    console.error("Instamart fetch error:", error);
    return [];
  }
}

// async function fetchFlipkartProducts(query: string): Promise<Product[]> {
//   try {
//     const response = await fetch(
//       `${FLIPKART_API_URL}?q=${encodeURIComponent(query)}`,
//       {
//         headers: {
//           Authorization: process.env.FLIPKART_API_KEY || "",
//         },
//       }
//     );
//     if (!response.ok) throw new Error("Flipkart API error");
//     const data = await response.json();
//     return transformFlipkartData(data);
//   } catch (error) {
//     console.error("Flipkart fetch error:", error);
//     return [];
//   }
// }

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const [blinkitProducts, instamartProducts] =
      // , instamartProducts, flipkartProducts] =
      await Promise.all([
        fetchBlinkitProducts(query),
        fetchInstamartProducts(query),
        // fetchFlipkartProducts(query),
      ]);

    return [...blinkitProducts, ...instamartProducts];
    //...instamartProducts, ...flipkartProducts];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
