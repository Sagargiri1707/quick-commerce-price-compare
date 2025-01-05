import { Product } from "../types";

export const transformBlinkitData = (data: any): Product[] => {
  try {
    // Extract snippets array
    const snippets = data.response.snippets;

    // Filter for product_card_snippet_type_2 and map to required format
    const filteredProducts = snippets
      .filter(
        (snippet: { widget_type: string }) =>
          snippet.widget_type === "product_card_snippet_type_2"
      )
      .map((snippet: { data: any }) => {
        const productData = snippet.data;
        return {
          name: productData?.name?.text || "",
          price: (productData?.normal_price?.text || "").replace(/[^0-9]/g, ""),
          time: productData?.eta_tag?.title?.text || "",
          dlUrl: productData?.click_action?.blinkit_deeplink?.url || "",
          display_name: productData?.display_name?.text || "",
          imgUrl: productData?.image?.url || "",
          platform: "blinkit",
          weight: productData.variant?.text || "",
        };
      })
      .filter((product: { price: any }) => product.price); // Remove items without price

    // Sort by price (converting ₹ string to number)
    return filteredProducts
      .sort((a: { price: string }, b: { price: string }) => {
        const priceA = parseInt(a.price) || 0;
        const priceB = parseInt(b.price) || 0;
        return priceA - priceB;
      })
      .slice(0, 3); // Limit to 3 results
  } catch (error) {
    console.error("Error processing snippets:", error);
    return [];
  }
};
interface InstamartProduct {
  widgets: Array<{
    data: Array<{
      in_stock: any;
      product_id: string;
      display_name: string;
      variations: Array<{
        display_variant: boolean;
        price: {
          offer_price: number;
        };
        weight_in_grams: string;
      }>;
      images: string[];
    }>;
  }>;
}

export const transformInstamartData = (
  data: InstamartProduct,
  sla: string
): Product[] => {
  try {
    if (!data?.widgets?.[0]?.data) {
      return [];
    }

    const products = data.widgets[0].data.slice(0, 10).map((item) => {
      if (!item.in_stock) return null;
      // Find the hero variant (display variant)
      const heroVariant =
        item.variations.length > 1
          ? item.variations.find((variant) => variant.display_variant)
          : item.variations[0];

      if (!heroVariant) return null;

      return {
        name: item.display_name,
        price: heroVariant.price.offer_price.toString(),
        weight: heroVariant.weight_in_grams,
        time: sla,
        dlUrl: `https://www.swiggy.com/instamart/item/${item.product_id}`,
        display_name: item.display_name,
        imgUrl: item.images?.[0]
          ? `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_252,h_272/${item.images[0]}`
          : "",
        platform: "instamart",
      };
    });

    // Filter out null values and return only valid products
    return products
      .filter((product) => product !== null)
      .sort((a, b) => {
        const priceA = parseInt(a?.price || "0");
        const priceB = parseInt(b?.price || "0");
        return priceA - priceB;
      })
      .slice(0, 3); // Limit to 3 cheapest products
  } catch (error) {
    console.error("Error transforming Instamart data:", error);
    return [];
  }
};
