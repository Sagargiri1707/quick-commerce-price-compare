import { BlinkitLogo } from "../components/BlinkitLogo";
import { InstamartLogo } from "../components/InstamartLogo";
import { Product, InstamartItem, InstamartProduct } from "../types";

// Helper functions
const sortByPrice = (products: Product[]): Product[] => {
  return products.sort((a, b) => {
    const priceA = parseInt(a.price) || 0;
    const priceB = parseInt(b.price) || 0;
    return priceA - priceB;
  });
};

// Blinkit transformer
const extractBlinkitProduct = (snippet: { data: any }): Product => {
  const { data: productData } = snippet;
  return {
    name: productData?.name?.text || "",
    price: (productData?.normal_price?.text || "")
      .replace(/[^0-9]/g, "")
      .toString(),
    time: productData?.eta_tag?.title?.text || "",
    dlUrl: productData?.click_action?.blinkit_deeplink?.url || "",
    display_name: productData?.display_name?.text || "",
    imgUrl: productData?.image?.url || "",
    platform: BlinkitLogo,
    weight: productData.variant?.text || "",
  };
};

export const transformBlinkitData = (data: any): Product[] => {
  try {
    const products = data.response.snippets
      .filter(
        (snippet: { widget_type: string }) =>
          snippet.widget_type === "product_card_snippet_type_2"
      )
      .slice(0, 5)
      .map(extractBlinkitProduct)
      .filter((product: { price: any }) => product.price);

    return sortByPrice(products);
  } catch (error) {
    console.error("Error processing Blinkit data:", error);
    return [];
  }
};

//

const getInstamartImageUrl = (imageId: string): string => {
  return imageId
    ? `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_252,h_272/${imageId}`
    : "";
};

const extractInstamartProduct = (
  item: InstamartItem,
  sla: string
): Product | null => {
  if (!item.in_stock) return null;

  const heroVariant =
    item.variations.length > 1
      ? item.variations.find((variant) => variant.display_variant)
      : item.variations[0];

  if (!heroVariant) return null;

  return {
    name: item.display_name,
    price: heroVariant.price.offer_price.toString(),
    weight: heroVariant.sku_quantity_with_combo,
    time: sla,
    dlUrl: `https://www.swiggy.com/instamart/item/${item.product_id}`,
    display_name: item.display_name,
    imgUrl: getInstamartImageUrl(heroVariant.images?.[0]),
    platform: InstamartLogo,
  };
};

export const transformInstamartData = (
  data: InstamartProduct,
  sla: string
): Product[] => {
  try {
    if (!data?.widgets?.[0]?.data) return [];

    const products = data.widgets[0].data
      .slice(0, 5)
      .map((item) => extractInstamartProduct(item, sla))
      .filter((product): product is Product => product !== null);

    return sortByPrice(products);
  } catch (error) {
    console.error("Error transforming Instamart data:", error);
    return [];
  }
};
