export interface Product {
  name: string;
  price: string;
  time: string;
  dlUrl: string;
  display_name: string;
  imgUrl: string;
  weight: string;
  platform: any;
}

export interface Platform {
  name: string;
  logo: string;
  color: string;
  discount?: BankDiscount[];
}

export interface BankDiscount {
  bank: string;
  discount: string;
  description: string;
}

export interface Location {
  lat: number;
  lon: number;
}
export interface InstamartVariation {
  images: any;
  sku_quantity_with_combo: any;
  display_variant: boolean;
  price: {
    offer_price: number;
  };
  weight_in_grams: string;
}

export interface InstamartItem {
  in_stock: boolean;
  product_id: string;
  display_name: string;
  variations: InstamartVariation[];
  images: string[];
}

export interface InstamartProduct {
  widgets: Array<{
    data: InstamartItem[];
  }>;
}
