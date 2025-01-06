import { Product } from "../types";
import {
  getBlinkitHeaders,
  getInstamartHeaders,
  getZeptoHeaders,
} from "./header";
import { Location } from "../types";
import {
  transformBlinkitData,
  transformInstamartData,
  transformZeptoData,
} from "./transformers";
const BLINKIT_API_URL = "/api/blinkit/layout/search";
const INSTAMART_API_URL = "/api/instamart/search";
const ZEPTO_API_URL = "/api/zepto/v3/search";

const INSTAMART_STORE_URL = "/api/instamart/home?clientId=INSTAMART-APP";
const ZEPTO_CONFIG_URL = "api/zepto/v1/config/layout";
async function fetchBlinkitProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${BLINKIT_API_URL}?q=${encodeURIComponent(
        query
      )}&search_type=auto_suggest`,
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

async function getZeptoStoreLocation(
  location: Location
): Promise<{ storeId: string; eta: string }> {
  try {
    const params = new URLSearchParams({
      latitude: location.lat.toString(),
      longitude: location.lon.toString(),
      page_type: "HOME",
      version: "v2",
      show_new_eta_banner: "false",
      page_size: "10",
    });

    const response = await fetch(`${ZEPTO_CONFIG_URL}/?${params}`, {
      headers: getZeptoHeaders(),
    });

    if (!response.ok) throw new Error("Zepto store location API error");

    const data = await response.json();
    const storeId = data?.storeServiceableResponseV2?.[0]?.storeId;
    if (!storeId) {
      return { storeId: "", eta: "" };
    }
    let eta = "";
    if (data?.pageLayout?.widgets) {
      const etaBanner = data.pageLayout.widgets.find(
        (widget: any) => widget.widgetType === "ETA_BANNER_WIDGET"
      );
      eta = etaBanner?.data?.eta || "";
    }

    console.log("ETA found:", eta);

    return { storeId, eta };
  } catch (error) {
    console.error("Zepto store location fetch error:", error);
    return { storeId: "", eta: "" };
  }
}

async function fetchZeptoProducts(
  query: string,
  location: Location
): Promise<Product[]> {
  try {
    const { storeId: zeptoStoreId, eta } = await getZeptoStoreLocation(
      location
    );

    const headers = {
      ...getZeptoHeaders(),
      accept: "application/json, text/plain, */*",
      app_sub_platform: "WEB",
      app_version: "12.25.0",
      appversion: "12.25.0",
      platform: "WEB",
      store_id: zeptoStoreId,
      store_ids: zeptoStoreId,
      storeid: zeptoStoreId,
      tenant: "ZEPTO",
      "x-without-bearer": "true",
    };

    const body = {
      query,
      pageNumber: 0,
      mode: "AUTOSUGGEST",
      intentId: crypto.randomUUID(), // Generate a random UUID for intentId
    };
    const bodyString = JSON.stringify(body);

    const response = await fetch(ZEPTO_API_URL, {
      method: "POST",
      headers,
      body: bodyString,
    });

    if (!response.ok) throw new Error("Zepto API error");
    const data = await response.json();
    return transformZeptoData(data?.layout || [], eta); // You'll need to create this transformer
  } catch (error) {
    console.error("Zepto fetch error:", error);
    return [];
  }
}

export async function searchProducts(
  query: string,
  location: Location
): Promise<Product[]> {
  try {
    const [blinkitProducts, instamartProducts, zeptoProducts] =
      // , instamartProducts, flipkartProducts] =
      await Promise.all([
        fetchBlinkitProducts(query),
        fetchInstamartProducts(query),
        fetchZeptoProducts(query, location),
      ]);

    return [...blinkitProducts, ...instamartProducts, ...zeptoProducts].sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
