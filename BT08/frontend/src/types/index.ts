export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: number;
  quantity: number;
  selected: boolean;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  selectedCount: number;
  totalPrice: number;
  selectedTotalPrice: number;
}
