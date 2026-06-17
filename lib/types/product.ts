export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
   discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images?: string[];
  category: string;
};

export interface CartItem {
  id: number; // product id
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}