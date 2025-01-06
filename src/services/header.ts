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
export function getZeptoHeaders() {
  return {
    accept: "application/json",
    app_sub_platform: "WEB",
    app_version: "12.25.0",
    appversion: "12.25.0",
    compatible_components:
      "CONVENIENCE_FEE,RAIN_FEE,EXTERNAL_COUPONS,STANDSTILL,BUNDLE,MULTI_SELLER_ENABLED,PIP_V1,ROLLUPS,SCHEDULED_DELIVERY,SAMPLING_ENABLED,ETA_NORMAL_WITH_149_DELIVERY,ETA_NORMAL_WITH_199_DELIVERY,HOMEPAGE_V2,NEW_ETA_BANNER,VERTICAL_FEED_PRODUCT_GRID,AUTOSUGGESTION_PAGE_ENABLED,AUTOSUGGESTION_PIP,AUTOSUGGESTION_AD_PIP,BOTTOM_NAV_FULL_ICON,COUPON_WIDGET_CART_REVAMP,DELIVERY_UPSELLING_WIDGET,MARKETPLACE_CATEGORY_GRID,NEW_FEE_STRUCTURE,NEW_BILL_INFO,RE_PROMISE_ETA_ORDER_SCREEN_ENABLED,SUPERSTORE_V1,MANUALLY_APPLIED_DELIVERY_FEE_RECEIVABLE,MARKETPLACE_REPLACEMENT,ZEPTO_PASS,ZEPTO_PASS:1,ZEPTO_PASS:2,ZEPTO_PASS_RENEWAL,CART_REDESIGN_ENABLED,SUPERSTORE_V1,SHIPMENT_WIDGETIZATION_ENABLED,TABBED_CAROUSEL_V2,24X7_ENABLED_V1,",
    platform: "WEB",
    tenant: "ZEPTO",
    "Content-Type": "application/json",
  };
}
