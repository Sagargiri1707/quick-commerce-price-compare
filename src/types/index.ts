export interface Product {
  name: string;
  price: string;
  time: string;
  dlUrl: string;
  display_name: string;
  imgUrl: string;
  platform: string;
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
  latitude: number;
  longitude: number;
}
